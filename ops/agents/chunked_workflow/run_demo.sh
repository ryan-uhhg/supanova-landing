#!/usr/bin/env bash
# run_demo.sh — 로컬 시뮬레이션 예시
# 사용법: ./run_demo.sh JOB_ID TOTAL
set -euo pipefail
JOBID=${1:-demo01}
TOTAL=${2:-5}
OUTDIR=/tmp/chunked_jobs

mkdir -p "$OUTDIR/$JOBID"

# 병렬로 worker 템플릿을 실행(데모용은 간단 sleep 추가)
for i in $(seq 1 $TOTAL); do
  python3 worker_template.py --job-id "$JOBID" --part $i --total $TOTAL --out-dir "$OUTDIR" &
done

# 합치기
python3 orchestrator_merge.py --job-id "$JOBID" --total $TOTAL --out-dir "$OUTDIR" --target "$OUTDIR/$JOBID/final.html" --timeout 60

echo "Demo complete: $OUTDIR/$JOBID/final.html"
