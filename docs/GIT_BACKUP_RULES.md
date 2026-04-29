# Farmerstree Fertilizer Platform Git / Backup Rules

## 1. 기본 원칙

본 프로젝트는 Git과 GitHub를 이용하여 버전 관리한다.

핵심 원칙:

1. 기능을 추가하기 전 커밋한다.
2. 기능을 추가한 후 다시 커밋한다.
3. 하루 작업이 끝나면 GitHub에 push한다.
4. 중요한 변경 전에는 zip 백업을 만든다.
5. CSV 원본, PDF 리포트, 개인정보, 환경변수는 GitHub에 올리지 않는다.

---

## 1-1. 최종 운영 루틴

매 작업 사이클은 아래 순서를 기본으로 한다.

1. 새 기능 만들기 전 `git status` 확인
2. 작업 수행
3. Live Server로 동작 확인
4. 문제 없으면 `git add .`
5. `git commit -m "작업 내용"`
6. `git push`
7. 중요한 날은 `./scripts/backup_project.sh` 실행

---

## 2. GitHub 공개 범위

저장소는 Private으로 운영한다.

이유:

- 제조공정 아이디어 포함
- 원가 구조 포함 가능성 있음
- 품질관리 로직 포함
- 사업화 전 외부 공개 불필요

---

## 3. 커밋 타이밍

다음 작업 후에는 반드시 커밋한다.

- 새 화면 추가
- 계산 로직 수정
- 품질 판정 기준 수정
- 운영 규칙 문서 수정
- CSV 내보내기 기능 수정
- PDF 리포트 양식 수정
- 배치 기록 템플릿 수정

---

## 4. 커밋 메시지 예시

```text
Add fermentation dashboard
Add quality inspection dashboard
Add batch record generator
Add integrated report generator
Add PDF quality report screen
Update operation rules
Fix CSV export encoding
Fix quality judgement logic
```

---

## 5. Push 규칙

1. main에 직접 반영 시에는 기능 단위로 잘게 커밋한다.
2. 로컬 커밋이 3개 이상 쌓이면 당일 내 push한다.
3. 운영 반영 전 최종 상태에서 push 누락이 없는지 확인한다.

점검 명령:

```bash
git status -sb
git log --oneline -n 5
git remote -v
```

---

## 6. 백업 규칙

백업 스크립트:

- scripts/backup_project.sh

백업 실행 시점:

1. 대규모 파일 수정 전
2. 품질 판정 로직 변경 전
3. UI 구조 변경 전
4. 릴리스/시연 전

실행 명령:

```bash
./scripts/backup_project.sh
```

백업 산출물 저장 위치:

- /Volumes/AI_DATA_CENTRE/AI_WORKSPACE/_BACKUPS/farmerstree-fertilizer-platform

---

## 7. 복구 절차

1. 최신 zip 백업 파일 확인
2. 별도 복구 폴더에 압축 해제
3. 손상 파일만 선별 복사
4. 복구 후 즉시 커밋

권장 복구 커밋 메시지:

```text
Restore files from backup after accidental deletion
```

---

## 8. GitHub에 올리면 안 되는 데이터

- 원본 CSV (현장 추출 데이터)
- PDF 성적서 원본
- 개인정보가 포함된 파일
- .env, .env.local 등 환경변수 파일
- 임시/백업 산출물

해당 항목은 .gitignore 규칙으로 관리하며, 예외 파일을 추가할 때는 사전 검토 후 반영한다.