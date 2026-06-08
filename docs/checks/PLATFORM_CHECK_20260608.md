# Farmerstree Fertilizer Platform 전체 점검 기록

## 점검일

2026-06-08

---

## 자동화 점검 결과

| 항목 | 결과 |
|---|---|
| JS 문법 검사 (17개 파일) | ✅ 전원 이상 없음 |
| ESLint 오류 | ✅ 0건 (경고 6건 — 아래 참고) |
| 계산 로직 단위 테스트 (18개) | ✅ 18/18 통과 |

---

## ESLint 경고 내역 (오류 아님, false positive)

| 파일 | 경고 내용 |
|---|---|
| biochar-calculator/app.js | `biocharKg` 변수 선언 후 미사용 (출력에만 사용) |
| farmer-roi-calculator/app.js | `onProductChange`, `onAreaUnitChange` — HTML onclick에서 호출되므로 실제 미사용 아님 |
| farmer-roi-calculator/app.js | `chemRevenue` 계산은 하지만 결과에 미출력 (향후 활용 예정) |
| farmer-roi-calculator/app.js | `copySummary`, `exportCSV` — HTML onclick에서 호출됨 |

> `onProductChange`, `onAreaUnitChange`, `copySummary`, `exportCSV`는 HTML `onclick` 속성에서 직접 호출하므로 실제 버그 아님. ESLint가 HTML을 인식 못 해 발생하는 false positive.

---

## 이번 점검 중 수정된 버그

| 파일 | 내용 |
|---|---|
| batch-generator/app.js | 유효하지 않은 `recipeType` 시 TypeError 크래시 → 키 가드 + 에러 메시지 추가 |
| biochar-calculator/app.js | `targetMoisture >= 1` 시 0 나누기 / 음수 계산 → 조기 검증 후 에러 메시지 표시 |
| biochar-calculator/app.js | `formatKg()` 1kg 미만 값 `0kg` 표시 → 소수점 2자리로 표시 |
| farmer-roi-calculator/app.js | `copySummary()` clipboard 거부 시 조용히 실패 → `.catch()` 알림 추가 |
| farmer-roi-calculator/app.js | 면적 라벨 `1,000㎡` 하드코딩 → `unitSize` 변수 반영으로 커스텀 면적도 정상 표시 |

---

## 브라우저 수동 점검

| 항목 | 결과 |
|---|---|
| 브라우저 수동 점검 | ⬜ 미실시 |
| 운영 투입 가능 여부 | ⬜ 브라우저 점검 완료 후 판정 |

---

## 종합 판정

- 자동 점검: ✅ 통과
- 코드 버그 수정: ✅ 5건 완료
- 브라우저 수동 점검: ⬜ 미실시 → 운영 투입 전 수행 필요
