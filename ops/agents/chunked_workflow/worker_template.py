#!/usr/bin/env python3
"""
worker_template.py
Usage:
  python worker_template.py --job-id JOB --part 1 --total 5 --out-dir /tmp/jobs --prompt-file /path/to/source.html

이 스크립트는 실제 모델 호출 부분을 `generate_part()`로 캡슐화합니다.
worker는 반드시 실패 시 non-zero exit을 반환하거나, 부분 파일을 남기지 않도록 설계하세요.
"""
import argparse
import os
import sys
import time


def split_html_into_parts(html_text, part_index, total_parts):
    """
    매우 단순한 HTML 분할기:
    - <body>...</body> 블록을 찾아 내부를 균등 문자 단위로 분할
    - 각 파트는 원본 <head>와 최소한의 wrapper를 포함
    - 실패 시 전체 텍스트를 부분으로 잘라 반환
    """
    lower = html_text.lower()
    bstart = lower.find('<body')
    bend = lower.find('</body>')
    head = ''
    body_inner = html_text
    if bstart != -1 and bend != -1:
        # find end of opening <body ...>
        start_tag_end = html_text.find('>', bstart)
        if start_tag_end != -1:
            head = html_text[:start_tag_end+1]
            body_inner = html_text[start_tag_end+1:bend]
    # split by approximate size
    L = len(body_inner)
    if L == 0:
        chunks = [''] * total_parts
    else:
        size = max(1, L // total_parts)
        chunks = [body_inner[i*size:(i+1)*size] for i in range(total_parts-1)]
        chunks.append(body_inner[(total_parts-1)*size:])
    idx = max(1, min(total_parts, part_index)) - 1
    part_body = chunks[idx]
    # assemble minimal valid HTML for the part
    if head:
        part_html = head + '\n' + part_body + '\n</body>\n</html>'
    else:
        part_html = '<html><body>' + part_body + '</body></html>'
    return part_html


def generate_part(job_id, part_index, total_parts, prompt_text=None, prompt_file_path=None):
    """
    실제 모델 호출 코드를 이 함수에 넣습니다.
    동작 우선순위:
    1) prompt_text (파일의 내용) 이 제공되면 HTML 분할기를 사용
    2) 그렇지 않으면 기존의 간단한 placeholder 생성
    """
    # If prompt_text provided and looks like HTML, split
    if prompt_text and ('<' in prompt_text and '>' in prompt_text):
        try:
            return split_html_into_parts(prompt_text, part_index, total_parts)
        except Exception as e:
            # fallthrough to placeholder
            print('WARN: split_html failed', e, file=sys.stderr)

    # Fallback placeholder content (same as before)
    content = f"<!-- PART {part_index}/{total_parts} of job {job_id} -->\n"
    content += f"<section class=\"part part-{part_index}\">\n"
    content += f"  <h2>Job {job_id} — Part {part_index}</h2>\n"
    content += f"  <p>This is a placeholder for the model-generated HTML content for part {part_index}.</p>\n"
    content += "</section>\n"
    return content


def atomic_write(path, text):
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        f.write(text)
    os.replace(tmp, path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--job-id', required=True)
    parser.add_argument('--part', type=int, required=True)
    parser.add_argument('--total', type=int, required=True)
    parser.add_argument('--out-dir', default='/tmp/chunked_jobs')
    parser.add_argument('--prompt-file', default=None, help='Optional prompt or input file')
    args = parser.parse_args()

    job_dir = os.path.join(args.out_dir, args.job_id)
    os.makedirs(job_dir, exist_ok=True)

    prompt_text = None
    if args.prompt_file and os.path.exists(args.prompt_file):
        try:
            with open(args.prompt_file, 'r', encoding='utf-8') as f:
                prompt_text = f.read()
        except Exception as e:
            print('ERROR reading prompt_file:', e, file=sys.stderr)
            sys.exit(2)

    try:
        content = generate_part(args.job_id, args.part, args.total, prompt_text=prompt_text, prompt_file_path=args.prompt_file)
        out_path = os.path.join(job_dir, f'part_{args.part:03d}.html')
        atomic_write(out_path, content)
        # 완료 플래그
        done_path = os.path.join(job_dir, f'part_{args.part:03d}.done')
        atomic_write(done_path, str(time.time()))
        print(f'WROTE {out_path}')
        sys.exit(0)
    except Exception as e:
        print('ERROR:', e, file=sys.stderr)
        sys.exit(2)

if __name__ == '__main__':
    main()
