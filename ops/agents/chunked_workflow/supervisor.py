#!/usr/bin/env python3
"""
supervisor.py

로컬 환경(원격서버/S3 없음)에서 청크 워크플로를 안정적으로 실행하기 위한 감독자(supervisor) 스크립트입니다.
기능 요약:
- worker_template.py를 파트별로 병렬 실행(동시 실행 개수 제한)
- 파트별 상태(status.json) 기록: pending, running, done, failed
- 재시도 정책: 실패한 파트만 최대 retry_count 재시도
- 로그 기록(심플한 텍스트 로그)
- 중간 체크포인트(.partial 파일)와 완료 플래그(.done)는 worker가 작성
- 작업 재개(resume) 지원: 이미 완료된 파트는 스킵

사용법:
  python3 supervisor.py --job-id JOB --total 5 --out-dir /tmp/chunked_jobs --concurrency 3 --retries 2

이 스크립트는 worker_template.py를 같은 디렉터리에 두고 실행하는 것을 전제로 합니다.
"""
import argparse
import os
import sys
import subprocess
import time
import json
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

LOCK = threading.Lock()


def now_ts():
    return int(time.time())


def load_status(job_dir):
    status_path = os.path.join(job_dir, 'status.json')
    if os.path.exists(status_path):
        try:
            with open(status_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return None
    return None


def save_status(job_dir, data):
    # Use unique tmp filename to avoid race conditions when multiple threads try to write
    status_path = os.path.join(job_dir, 'status.json')
    tmp = status_path + f'.tmp.{os.getpid()}.{int(time.time()*1000)}'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    # Atomic replace
    try:
        os.replace(tmp, status_path)
    except Exception:
        # Best-effort: if replace fails, try to remove tmp
        try:
            os.remove(tmp)
        except Exception:
            pass


def init_job_status(job_dir, total):
    os.makedirs(job_dir, exist_ok=True)
    status = {
        'job_id': os.path.basename(job_dir),
        'total_parts': total,
        'created_at': now_ts(),
        'parts': {}
    }
    for i in range(1, total+1):
        key = f'part_{i:03d}'
        status['parts'][key] = {
            'index': i,
            'state': 'pending',
            'retries': 0,
            'last_update': None,
            'pid': None,
            'exit_code': None
        }
    save_status(job_dir, status)
    return status


def call_worker(parent_out_dir, job_id, part_index, total, prompt_file=None, python='python3'):
    # parent_out_dir is the base output dir (e.g. /tmp/chunked_jobs). Worker will append job_id itself to create job dir.
    cmd = [python, os.path.join(os.path.dirname(__file__), 'worker_template.py'), '--job-id', job_id, '--part', str(part_index), '--total', str(total), '--out-dir', parent_out_dir]
    if prompt_file:
        cmd += ['--prompt-file', prompt_file]
    # Spawn process
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return p


def run_part(parent_out_dir, job_id, part_index, total, max_retries, prompt_file=None):
    job_dir = os.path.join(parent_out_dir, job_id)
    key = f'part_{part_index:03d}'
    status = load_status(job_dir)
    if not status:
        # Initialize if missing
        status = init_job_status(job_dir, total)
    part = status['parts'][key]

    # If already done, skip
    done_path = os.path.join(job_dir, f'part_{part_index:03d}.done')
    if os.path.exists(done_path):
        part['state'] = 'done'
        part['last_update'] = now_ts()
        save_status(job_dir, status)
        return True

    attempt = 0
    while attempt <= max_retries:
        attempt += 1
        with LOCK:
            part['state'] = 'running'
            part['retries'] = attempt - 1
            part['last_update'] = now_ts()
            save_status(job_dir, status)
        p = call_worker(parent_out_dir, job_id, part_index, total, prompt_file)
        part['pid'] = p.pid
        save_status(job_dir, status)
        out, err = p.communicate()
        exit_code = p.returncode
        with LOCK:
            part['exit_code'] = exit_code
            part['last_update'] = now_ts()
        if exit_code == 0:
            # verify done file exists
            if os.path.exists(done_path):
                with LOCK:
                    part['state'] = 'done'
                    save_status(job_dir, status)
                return True
            else:
                # Worker exited 0 but didn't write done file; treat as failure
                with LOCK:
                    part['state'] = 'failed'
                    save_status(job_dir, status)
                attempt_msg = f"Worker completed but no .done for part {part_index}. stdout={out} stderr={err}"
                print(attempt_msg, file=sys.stderr)
        else:
            with LOCK:
                part['state'] = 'failed'
                save_status(job_dir, status)
            print(f'Part {part_index} failed (exit {exit_code}), stdout:\n{out}\nstderr:\n{err}', file=sys.stderr)
        if attempt <= max_retries:
            print(f'Retrying part {part_index} (attempt {attempt}/{max_retries})...')
            time.sleep(1 + attempt*0.5)
    return False


def supervise(job_id, total, out_dir, concurrency=3, max_retries=1, prompt_file=None):
    parent_out_dir = out_dir
    job_dir = os.path.join(parent_out_dir, job_id)
    status = load_status(job_dir)
    if not status:
        status = init_job_status(job_dir, total)
    else:
        # ensure parts for any missing indexes
        for i in range(1, total+1):
            key = f'part_{i:03d}'
            if key not in status['parts']:
                status['parts'][key] = {'index': i, 'state': 'pending', 'retries': 0, 'last_update': None, 'pid': None, 'exit_code': None}
        save_status(job_dir, status)

    parts = list(range(1, total+1))
    results = {}
    with ThreadPoolExecutor(max_workers=concurrency) as ex:
        futures = {ex.submit(run_part, parent_out_dir, job_id, i, total, max_retries, prompt_file): i for i in parts}
        for fut in as_completed(futures):
            idx = futures[fut]
            try:
                ok = fut.result()
                results[idx] = ok
            except Exception as e:
                results[idx] = False
                print('Exception for part', idx, e, file=sys.stderr)
    # Summary
    success = all(results.get(i, False) for i in parts)
    print('Supervision complete. Success=' + str(success))
    return success


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--job-id', required=True)
    parser.add_argument('--total', type=int, required=True)
    parser.add_argument('--out-dir', default='/tmp/chunked_jobs')
    parser.add_argument('--concurrency', type=int, default=3)
    parser.add_argument('--retries', type=int, default=1)
    parser.add_argument('--prompt-file', default=None)
    args = parser.parse_args()

    ok = supervise(args.job_id, args.total, args.out_dir, concurrency=args.concurrency, max_retries=args.retries, prompt_file=args.prompt_file)
    sys.exit(0 if ok else 2)

if __name__ == '__main__':
    main()
