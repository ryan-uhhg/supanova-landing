# Chunked Workflow (청크 워크플로) — 템플릿

목적
- 대용량 출력(예: HTML 슬라이드)을 작은 파트로 분할하여 서브에이전트가 각각 생성하고, 오케스트레이터가 최종 합치는 패턴입니다.
- 타임아웃(stream stalled)과 재시도 비용을 줄이고 병렬화/복구를 쉽게 합니다.

핵심 규칙
1. 모든 대용량 생성작업은 반드시 `total_parts` 기반의 청크 생성으로 분해합니다.
2. 각 파트는 완료 즉시 원격 스토리지(S3/공유 디스크) 또는 로컬 디렉터리(`/tmp/<job_id>/part_{i}.html`)에 안전하게 씀.
3. 각 파트 생성 후 상태 파일(`/tmp/<job_id>/part_{i}.done` 또는 orchestrator에 POST)로 완료를 알립니다.
4. 오케스트레이터는 모든 `part_{i}.done`을 확인하면 병합(cat)하고 간단 검증(HTML 존재 여부, length check)을 수행합니다.
5. 실패한 파트만 재시도하도록 설계합니다.

파일 구성
- worker_template.py: 서브에이전트(또는 worker 컨테이너)가 실행할 템플릿. 입력(문맥)을 받아 part 파일을 생성하고 완료 플래그를 씁니다.
- orchestrator_merge.py: 오케스트레이터가 job 디렉터리의 파트가 모두 생성되면 합치고 검증합니다.
- run_demo.sh: 로컬에서 시뮬레이션해볼 수 있는 간단한 예시 스크립트.

통합 아이디어
- S3 사용 시: worker는 S3에 `job_id/part_{i}.html` 업로드 후 `job_id/part_{i}.done` 업로드. orchestrator는 S3 목록을 폴링.
- 큐 사용 시: 작업을 메시지로 발행(예: Redis/RabbitMQ). worker는 메시지 수신 후 작업 수행.
- 헬메스(delegate_task) 사용 시: subagent는 작업 템플릿에 `part_index`/`total_parts`를 받고, 작업 끝에 HTTP POST로 orchestrator webhook을 호출.

