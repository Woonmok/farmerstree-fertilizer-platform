# Claude Codex 점검용 프로젝트 컨텍스트

생성일: 2026-06-08 16:01:25

## 프로젝트 루트
- /Volumes/AI_DATA_CENTRE/AI_WORKSPACE/farmerstree-fertilizer-platform

## 점검 목표(권장)
- 프론트엔드 모듈별 JS 로직 오류/예외 처리 점검
- CSV 파싱/보고서 생성 경로의 회귀 버그 점검
- 계산기 모듈(탄소/레시피/ROI)의 입력 검증 및 경계값 점검
- 중복 코드 구조 개선 포인트 식별

## 현재 알려진 이슈(로컬 메모 기반)
- report-generator: CSV가 헤더만 있고 데이터 행이 없으면 제조번호 컬럼 탐지 실패 메시지 발생
- report-generator: UTF-8 BOM 제거 로직 적용됨 (report-generator/app.js)

## 수정 완료된 버그 (2026-06-08) — 재수정 불필요
- [batch-generator/app.js] `calculateRecipe()`: 유효하지 않은 `recipeType` 전달 시 `recipes[recipeType]` undefined TypeError 크래시 → 키 존재 확인 후 에러 메시지 표시 및 빈 배열 반환으로 수정
- [biochar-calculator/app.js] `calculate()`: `targetMoisture >= 1` 시 0으로 나누거나 음수 계산 발생 → 함수 상단에서 즉시 에러 메시지 표시 후 return 처리
- [biochar-calculator/app.js] `formatKg()`: 1kg 미만 값이 `Math.round()` 로 0kg 표시되는 버그 → 1kg 미만은 소수점 2자리로 표시
- [farmer-roi-calculator/app.js] `copySummary()`: `navigator.clipboard.writeText()` 거부 시 `.catch()` 없어 조용히 실패 → `.catch()` 추가하여 사용자에게 알림
- [farmer-roi-calculator/app.js] `calcROI()`: 면적 결과 라벨이 `1,000㎡` 하드코딩 → `unitSize` 변수를 사용해 커스텀 면적도 올바르게 표시

## 폴더 구조(상위 2단계)
- .
- ai-test-report.json
- ai-test-report.md
- app.js
- batch-generator
- batch-generator/app.js
- batch-generator/index.html
- batch-generator/style.css
- biochar-calculator
- biochar-calculator/app.js
- biochar-calculator/index.html
- biochar-calculator/style.css
- biochar-dashboard
- biochar-dashboard/app.js
- biochar-dashboard/index.html
- biochar-dashboard/style.css
- biochar-lot-generator
- biochar-lot-generator/app.js
- biochar-lot-generator/index.html
- biochar-lot-generator/style.css
- biochar-lots
- biochar-lots/.gitkeep
- biochar-lots/FT-BIO-20260429-001.md
- biochar-quality-dashboard
- biochar-quality-dashboard/app.js
- biochar-quality-dashboard/index.html
- biochar-quality-dashboard/style.css
- calculator
- calculator/app.js
- calculator/index.html
- calculator/style.css
- carbon-report
- carbon-report/app.js
- carbon-report/index.html
- carbon-report/style.css
- dashboard
- dashboard/app.js
- dashboard/index.html
- dashboard/style.css
- docs
- docs/checks
- docs/GIT_BACKUP_RULES.md
- docs/MVP_SUMMARY_20260429.md
- docs/OPERATION_RULES.md
- docs/OPERATION_VERIFICATION_CHECKLIST.md
- docs/share
- farmer-roi-calculator
- farmer-roi-calculator/app.js
- farmer-roi-calculator/index.html
- farmer-roi-calculator/style.css
- index.html
- print-report
- print-report/app.js
- print-report/index.html
- print-report/style.css
- qc
- qc/batch_record_template.md
- qc/batches
- qc/qc_checklist.md
- quality-dashboard
- quality-dashboard/app.js
- quality-dashboard/index.html
- quality-dashboard/style.css
- README.md
- recipe-calculator
- recipe-calculator/app.js
- recipe-calculator/index.html
- recipe-calculator/style.css
- recipes
- recipes/standard_recipe.json
- report-generator
- report-generator/app.js
- report-generator/index.html
- report-generator/style.css
- reports
- reports/.gitkeep
- reports/FT-FERT-20260429-001-integrated-report.md
- reports/soil-carbon
- sales-manager
- sales-manager/app.js
- sales-manager/index.html
- sales-manager/style.css
- scripts
- scripts/backup_project.sh
- soil-carbon-calculator
- soil-carbon-calculator/app.js
- soil-carbon-calculator/index.html
- soil-carbon-calculator/style.css
- soil-carbon-dashboard
- soil-carbon-dashboard/app.js
- soil-carbon-dashboard/index.html
- soil-carbon-dashboard/style.css
- style.css
- templates

## 주요 코드 파일 목록
- ai-test-report.json
- ai-test-report.md
- app.js
- batch-generator/app.js
- batch-generator/index.html
- batch-generator/style.css
- biochar-calculator/app.js
- biochar-calculator/index.html
- biochar-calculator/style.css
- biochar-dashboard/app.js
- biochar-dashboard/index.html
- biochar-dashboard/style.css
- biochar-lot-generator/app.js
- biochar-lot-generator/index.html
- biochar-lot-generator/style.css
- biochar-lots/FT-BIO-20260429-001.md
- biochar-quality-dashboard/app.js
- biochar-quality-dashboard/index.html
- biochar-quality-dashboard/style.css
- calculator/app.js
- calculator/index.html
- calculator/style.css
- carbon-report/app.js
- carbon-report/index.html
- carbon-report/style.css
- dashboard/app.js
- dashboard/index.html
- dashboard/style.css
- docs/checks/PLATFORM_CHECK_20260429.md
- docs/checks/PLATFORM_CHECK_20260430.md
- docs/GIT_BACKUP_RULES.md
- docs/MVP_SUMMARY_20260429.md
- docs/OPERATION_RULES.md
- docs/OPERATION_VERIFICATION_CHECKLIST.md
- farmer-roi-calculator/app.js
- farmer-roi-calculator/index.html
- farmer-roi-calculator/style.css
- index.html
- print-report/app.js
- print-report/index.html
- print-report/style.css
- qc/batch_record_template.md
- qc/batches/FT-FERT-20260429-001.md
- qc/qc_checklist.md
- quality-dashboard/app.js
- quality-dashboard/index.html
- quality-dashboard/style.css
- README.md
- recipe-calculator/app.js
- recipe-calculator/index.html
- recipe-calculator/style.css
- recipes/standard_recipe.json
- report-generator/app.js
- report-generator/index.html
- report-generator/style.css
- reports/FT-FERT-20260429-001-integrated-report.md
- sales-manager/app.js
- sales-manager/index.html
- sales-manager/style.css
- soil-carbon-calculator/app.js
- soil-carbon-calculator/index.html
- soil-carbon-calculator/style.css
- soil-carbon-dashboard/app.js
- soil-carbon-dashboard/index.html
- soil-carbon-dashboard/style.css
- style.css

## Claude Codex 프롬프트 템플릿
```text
아래 프로젝트를 코드 리뷰해줘.
1) 기능 오류 가능성
2) 예외 처리 누락
3) 보안/입력 검증 취약점
4) 성능/중복 코드 개선점
5) 파일별 수정 제안(diff 형태 선호)

우선순위는 치명도 순으로 정리하고, 재현 절차와 수정안을 함께 제시해줘.
```
