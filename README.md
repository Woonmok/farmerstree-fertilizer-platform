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
- `biochar-calculator/`: SMS biochar 전환·혼합 계산기
- `biochar-dashboard/`: SMS biochar 공정·품질 대시보드
- `biochar-lot-generator/`: Biochar 로트 기록 Markdown 자동 생성기
- `soil-carbon-dashboard/`: 토양 복원·탄소 효과 대시보드
- `soil-carbon-calculator/`: 토양·탄소 리포트 계산기
- `carbon-report/`: ESG/공공사업용 탄소 성과 리포트 생성기
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

---

## 6. SMS Biochar 확장 구조

Farmerstree Fertilizer Platform은 기존 후배지 고부숙 펠릿비료 구조에 SMS biochar 라인을 추가하여 다음 3층 구조로 확장한다.

```text
[1층] 후배지 기능성 펠릿비료
- 후배지 원료관리
- 염류관리
- C/N 보정
- 고온부숙
- 후숙
- 기능성 미생물 접종
- 펠릿화
- 품질검사

[2층] SMS Biochar
- 후배지 일부 건조
- 450~550℃ 중온 탄화 조건 관리
- 탄화 수율 관리
- biochar pH / EC / 회분 / 고정탄소 / 중금속 검사
- 비료와 혼합 비율 설정

[3층] Farmerstree 데이터 플랫폼
- 제조번호별 원료 이력
- 발효 온도 이력
- 품질검사 이력
- biochar 로트 이력
- 토양검정 데이터
- 작물 생육 데이터
- 화학비료 절감률
- 탄소저장 추정량
- PDF 리포트
```

---

## 7. 신규 모듈 사용 순서

SMS biochar 확장 운영은 아래 순서로 사용하는 것을 권장한다.

1. `biochar-calculator/`에서 후배지 전환 비율, 건조 중량, 탄화 수율, 혼합비, 포대 수를 계산한다.
2. `biochar-dashboard/`에서 로트번호별 탄화 조건과 biochar 품질값을 기록한다.
3. `biochar-lot-generator/`에서 Biochar 로트 기록서를 Markdown으로 자동 생성·저장한다.
4. `quality-dashboard/`와 기존 제조 기록 문서에서 최종 비료 품질을 확인한다.
5. `soil-carbon-dashboard/`에서 토양 유기탄소, pH, EC, 수분 보유력, 작물 수량 변화를 기록한다.
6. `soil-carbon-calculator/`에서 면적당 투입량, 고정탄소량, CO2e 환산량, 화학비료 절감량과 토양개량·ESG용 설명 문장을 계산한다.
7. `carbon-report/`에서 재자원화량, biochar 생산량, 토양 투입량, 탄소저장 추정량을 바탕으로 ESG 및 공공사업용 문장을 생성한다.

---

## 8. 현재 제품 구조

현재 제품 구조는 다음 3개 라인으로 정리한다.

1. A. 후배지 고부숙 펠릿비료: 일반 농가용, 원가 안정, 대량 공급
2. B. 후배지 기능성 미생물 펠릿비료: 프리미엄 농가용, 시설원예·과수, 기능성 미생물 강조
3. C. 후배지 + SMS Biochar 복합 펠릿: 토양개량, 수분 보유, 탄소저장, ESG·공공사업, 고부가가치 브랜드형


---

## 9. Biochar 로트 기록 생성기

Biochar 로트 기록 자동 생성기 모듈과 저장 폴더는 아래 경로를 사용한다.

```text
biochar-lot-generator/index.html
biochar-lots/
biochar-lots/FT-BIO-20260429-001.md
```

---

## 10. 토양·탄소 리포트 계산기

경로:

```text
soil-carbon-calculator/index.html
SMS biochar 복합 펠릿비료의 토양 투입량, 10a당 사용량, 고정탄소량,
안정화 탄소량, CO₂e 환산량, 화학비료 절감량을 계산하고
토양개량·ESG·공공사업용 리포트 문장을 생성한다.
```
