#!/usr/bin/env python3
"""
orchestrator_merge.py
Usage:
  python orchestrator_merge.py --job-id JOB --total 5 --out-dir /tmp/chunked_jobs --target final.html --timeout 300

동작: job 디렉터리 내에서 part_*.done 파일이 모두 생길 때까지 폴링, 이후 part 파일을 정렬하여 합치고 간단 검증 수행.
"""
import argparse
import os
import time
import glob


def wait_for_parts(job_dir, total, timeout=300, poll_interval=2):
    must = [f'part_{i:03d}.done' for i in range(1, total+1)]
    start = time.time()
    while True:
        existing = set(os.path.basename(p) for p in glob.glob(os.path.join(job_dir, 'part_*.done')))
        missing = [m for m in must if m not in existing]
        if not missing:
            return True
        if time.time() - start > timeout:
            return False
        time.sleep(poll_interval)


def merge_parts(job_dir, total, target_path):
    part_files = [os.path.join(job_dir, f'part_{i:03d}.html') for i in range(1, total+1)]
    with open(target_path + '.tmp', 'w', encoding='utf-8') as out:
        for p in part_files:
            if not os.path.exists(p):
                raise FileNotFoundError(p)
            with open(p, 'r', encoding='utf-8') as f:
                out.write(f.read())
                out.write('\n')
    os.replace(target_path + '.tmp', target_path)


def simple_validate_html(path):
    with open(path, 'r', encoding='utf-8') as f:
        txt = f.read()
    # 매우 기본적인 검증: 길이 및 html 태그 포함 여부
    return len(txt) > 200 and ('<' in txt and '>' in txt)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--job-id', required=True)
    parser.add_argument('--total', type=int, required=True)
    parser.add_argument('--out-dir', default='/tmp/chunked_jobs')
    parser.add_argument('--target', default=None)
    parser.add_argument('--timeout', type=int, default=300)
    args = parser.parse_args()

    job_dir = os.path.join(args.out_dir, args.job_id)
    if not os.path.isdir(job_dir):
        print('Job dir not found', job_dir)
        return 2

    ok = wait_for_parts(job_dir, args.total, timeout=args.timeout)
    if not ok:
        print('Timeout waiting for parts', file=sys.stderr)
        return 3

    target = args.target or os.path.join(job_dir, f'{args.job_id}_merged.html')
    try:
        merge_parts(job_dir, args.total, target)
        valid = simple_validate_html(target)
        if not valid:
            print('Validation failed', file=sys.stderr)
            return 4
        print('Merged ->', target)
        return 0
    except Exception as e:
        print('ERROR', e, file=sys.stderr)
        return 5

if __name__ == '__main__':
    raise SystemExit(main())
