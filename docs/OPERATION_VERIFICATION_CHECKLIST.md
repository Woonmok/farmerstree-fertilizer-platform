# Farmerstree 운영 검증 체크리스트 (1 Page)

적용 대상: Farmerstree Fertilizer Platform 운영자/관리자

목표: "로컬 작업 상태 + GitHub 반영 + 백업 가능성"을 5분 내 확인

## A. 시작 전 확인 (30초)

- [ ] 현재 폴더가 프로젝트 루트인지 확인
- [ ] 인터넷 연결 상태 확인 (GitHub 동기화 필요 시)

## B. Git 상태 확인 (1분)

터미널에서 아래 순서대로 실행:

```bash
git status -sb
git log --oneline -n 3
git branch -vv
```

정상 기준:

- [ ] `git status -sb`에 불필요한 변경 파일이 없음
- [ ] 최신 커밋 메시지가 마지막 작업 내용과 일치
- [ ] `main`이 `origin/main`을 추적 중

## C. GitHub 반영 확인 (1분)

- [ ] 저장소 메인 페이지 접근 확인
- [ ] `main` 브랜치 최신 커밋 해시가 로컬과 일치
- [ ] 커밋 목록에서 최근 작업 메시지 확인

확인 URL:

- 저장소: https://github.com/Woonmok/farmerstree-fertilizer-platform
- 커밋: https://github.com/Woonmok/farmerstree-fertilizer-platform/commits/main

## D. 기능 동작 확인 (1~2분)

- [ ] 홈 화면에서 주요 모듈 링크 이동 확인
- [ ] 품질/리포트 입력 후 화면 출력 정상 확인
- [ ] print-report에서 인쇄 미리보기 정상 확인

권장 점검 경로:

- [index.html](index.html)
- [quality-dashboard/index.html](quality-dashboard/index.html)
- [report-generator/index.html](report-generator/index.html)
- [print-report/index.html](print-report/index.html)

## E. 백업 가능성 확인 (1분)

```bash
./scripts/backup_project.sh
```

정상 기준:

- [ ] 실행 중 오류 없음
- [ ] 백업 zip 경로가 출력됨
- [ ] `_BACKUPS` 폴더에 최신 zip 파일 생성됨

관련 파일:

- [scripts/backup_project.sh](scripts/backup_project.sh)
- [docs/GIT_BACKUP_RULES.md](docs/GIT_BACKUP_RULES.md)

## F. 완료 선언 기준

아래 4개가 모두 참이면 "오늘 운영 점검 완료"로 판단:

- [ ] 로컬 Git 상태 정상
- [ ] GitHub 반영 정상
- [ ] 핵심 화면 동작 정상
- [ ] 백업 파일 생성 정상

## G. 이상 발생 시 즉시 조치

1. `git status -sb` 결과 캡처
2. 에러 메시지 원문 저장
3. 최근 변경 커밋 확인 (`git log --oneline -n 5`)
4. 필요 시 백업 zip 기준으로 복구 검토