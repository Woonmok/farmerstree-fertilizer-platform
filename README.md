# Farmerstree Fertilizer Platform

버섯 후배지를 이용한 저염·고부숙 기능성 펠릿비료 제조관리 플랫폼.

본 프로젝트는 후배지 원료관리, 염류관리, C/N 보정, 고온부숙, 후숙, 기능성 미생물 접종, 펠릿화, 품질검사까지 관리하기 위한 현장형 웹 도구와 문서 템플릿을 포함한다.

---

## 1. 핵심 제조 공정

Farmerstree 후배지 펠릿비료 제조 공정은 다음 8단계로 구성한다.

```text
1. 후배지 원료관리
2. 염류관리
3. C/N 보정
4. 고온부숙
5. 후숙
6. 기능성 미생물 접종
7. 펠릿화
8. 품질검사
```

---

## 2. 프로젝트 구성

- `index.html`, `style.css`, `app.js`: 메인 홈 화면
- `calculator/`: 수익성 계산기
- `recipe-calculator/`: 배합 계산기
- `dashboard/`: 발효 온도 기록 대시보드
- `quality-dashboard/`: 품질검사 입력/판정 대시보드
- `batch-generator/`: 배치 기록 마크다운 생성기
- `report-generator/`: CSV 기반 통합 리포트 생성기
- `print-report/`: A4 인쇄/PDF 저장용 품질 성적서 화면
- `qc/`: 체크리스트, 배치 기록서 템플릿, 배치별 기록
- `recipes/`: 표준 레시피 데이터
- `docs/`: 운영 기준 문서
- `scripts/`: 운영 스크립트(백업 등)

---

## 3. 실행 방법

1. VS Code에서 프로젝트 루트를 연다.
2. `index.html`을 Live Server로 실행한다.
3. 홈 화면에서 각 모듈로 이동해 사용한다.

---

## 4. 문서

- 운영 규칙: `docs/OPERATION_RULES.md`
- Git/백업 운영 규칙: `docs/GIT_BACKUP_RULES.md`
- 품질 체크리스트: `qc/qc_checklist.md`
- 배치 기록서 템플릿: `qc/batch_record_template.md`

---

## 5. 목표

단순 후배지 처리 사업이 아니라, 후배지 기반 저염·고부숙 기능성 펠릿비료 제조관리 시스템을 구축한다.

