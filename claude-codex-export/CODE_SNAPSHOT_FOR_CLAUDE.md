# Code Snapshot For Claude

생성일: 2026-06-08 16:01:25


---
## FILE: ai-test-report.json
```
{
  "report_date": "2026-05-17",
  "sop_version": "v1.0",
  "status": "Ready for Deployment",
  "test_results": [
    {
      "id": "test_1",
      "category": "온도 제어",
      "status": "Pass",
      "description": "610°C 이탈 감지, 즉각적인 가열 중단 및 EC 경고 조치 성공"
    },
    {
      "id": "test_2",
      "category": "비상 가스",
      "status": "Pass",
      "description": "O2 5.2% 감지 시 N2 퍼지 증량 및 밀폐/수냉 금지 지시 성공"
    },
    {
      "id": "test_3",
      "category": "품질 관리",
      "status": "Pass",
      "description": "Zn 390mg/kg 감지 시 출하 보류 및 블렌딩 2차 조치 성공"
    },
    {
      "id": "test_4",
      "category": "안전 통제",
      "status": "Pass",
      "description": "작업자 고온 수냉 시도 차단 및 80°C 이하 개방 규칙 강제 성공"
    }
  ]
}

```

---
## FILE: ai-test-report.md
```
# Farmerstree SMC 바이오차 파일럿 AI 에이전트 가동 테스트 보고서

**일자:** 2026-05-17 (SOP v1.0 기준)
**목적:** 하이브리드 데이터(자연어/JSON) 처리 및 SOP 기반 실시간 공정·안전·품질 감독 능력 검증

### 1. 테스트 요약 및 조치 결과
* **Test 1. 정상 운전 중 온도 이탈 통제 (Pass):** 610°C 감지 즉시 550°C 하향 지시 및 EC 급증 리스크 사전 경고
* **Test 2. 비상 상황 즉각 대응 (Pass):** O₂ 5.2% 감지 즉시 N₂ 퍼지 증량 및 수냉 원천 차단
* **Test 3. 아연(Zn) 리스크 트리거 판정 (Pass):** Zn 390 mg/kg 감지 시 출하 보류 및 2:1 블렌딩/용도 전환 지시
* **Test 4. 현장 작업자 금지 행동 통제 (Pass):** 고온 수냉 시도 시 수증기 폭발 위험 고지 및 80°C 이하 개방 통제

### 2. 종합 평가
본 AI 에이전트는 자연어 및 센서 데이터를 완벽히 파싱하여 SOP v1.0 기준에 맞춘 실시간 감독 및 비상 통제 능력을 입증함. 현장 즉시 투입 가능.

```

---
## FILE: app.js
```
console.log("Farmerstree Fertilizer Platform home loaded.");

```

---
## FILE: batch-generator/app.js
```
const inputs = {
  batchId: document.getElementById("batchId"),
  manufactureDate: document.getElementById("manufactureDate"),
  location: document.getElementById("location"),
  manager: document.getElementById("manager"),
  productType: document.getElementById("productType"),
  productName: document.getElementById("productName"),
  bagKg: document.getElementById("bagKg"),
  targetBags: document.getElementById("targetBags"),
  supplier: document.getElementById("supplier"),
  mushroomType: document.getElementById("mushroomType"),
  substrateKg: document.getElementById("substrateKg"),
  elapsedHours: document.getElementById("elapsedHours"),
  initialMoisture: document.getElementById("initialMoisture"),
  initialPh: document.getElementById("initialPh"),
  initialEc: document.getElementById("initialEc"),
  recipeType: document.getElementById("recipeType"),
};

const preview = document.getElementById("preview");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");

let currentMarkdown = "";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

inputs.manufactureDate.value = todayString();

function value(id) {
  return inputs[id].value;
}

function numberValue(id) {
  const parsed = Number(inputs[id].value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateRecipe(substrateKg, recipeType) {
  const scale = substrateKg / 1000;

  const recipes = {
    "A안: 일반 농가용 고부숙 펠릿": [
      ["버섯 후배지", 1000],
      ["발효계분 또는 계분퇴비", 100],
      ["미강", 40],
      ["제올라이트", 30],
      ["바이오차 또는 왕겨숯", 20],
      ["석고", 10],
      ["당밀", 3],
      ["Bacillus 미생물제", 1],
    ],
    "B안: 프리미엄 기능성 펠릿": [
      ["버섯 후배지", 1000],
      ["발효계분 또는 계분퇴비", 80],
      ["유박 또는 깻묵", 60],
      ["미강", 50],
      ["제올라이트", 40],
      ["바이오차 또는 왕겨숯", 40],
      ["석고", 15],
      ["해조분 또는 아미노산 부산물", 15],
      ["당밀", 5],
      ["복합 Bacillus + 효모", 2],
    ],
    "C안: 저염 민감작물용": [
      ["저염 버섯 후배지", 1000],
      ["코코피트 또는 왕겨", 100],
      ["미강", 30],
      ["바이오차 또는 왕겨숯", 40],
      ["제올라이트", 40],
      ["발효계분 또는 계분퇴비", 50],
      ["유박 또는 깻묵", 30],
      ["석고", 10],
      ["당밀", 2],
      ["Bacillus 미생물제", 1],
    ],
  };

  return recipes[recipeType].map(([name, kg]) => {
    const calculated = kg * scale;
    return { name, plannedKg: calculated };
  });
}

function formatKg(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)}톤`;
  }
  return `${Math.round(kg).toLocaleString("ko-KR")}kg`;
}

function makeRecipeRows(recipeItems) {
  return recipeItems
    .map((item) => `| ${item.name} | ${formatKg(item.plannedKg)} |  |  |`)
    .join("\n");
}

function makeTemperatureRows() {
  return Array.from({ length: 14 }, (_, i) => {
    const day = i + 1;
    return `| ${day} | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |`;
  }).join("\n");
}

function generateMarkdown() {
  const substrateKg = numberValue("substrateKg");
  const recipeType = value("recipeType");
  const recipeItems = calculateRecipe(substrateKg, recipeType);
  const targetTotalKg = numberValue("bagKg") * numberValue("targetBags");

  const markdown = `# Farmerstree 후배지 펠릿비료 제조 배치 기록서

## 1. 배치 기본 정보

| 항목 | 내용 |
|---|---|
| 제조번호 | ${value("batchId")} |
| 제조일자 | ${value("manufactureDate")} |
| 제조장소 | ${value("location")} |
| 담당자 | ${value("manager")} |
| 제품 유형 | ${value("productType")} |
| 목표 제품명 | ${value("productName")} |
| 포장 단위 | ${value("bagKg")}kg |
| 목표 생산량 | ${value("targetBags")}포 |
| 목표 총중량 | ${formatKg(targetTotalKg)} |
| 실제 생산량 |  |
| 출하 예정일 |  |

---

## 2. 원료 입고 기록

| 항목 | 내용 |
|---|---|
| 후배지 공급처 | ${value("supplier")} |
| 버섯 종류 | ${value("mushroomType")} |
| 입고일시 | ${value("manufactureDate")} |
| 후배지 입고량 | ${formatKg(substrateKg)} |
| 수거 후 경과시간 | ${value("elapsedHours")}시간 |
| 입고 시 냄새 | 정상 / 약한 발효취 / 암모니아취 / 부패취 |
| 입고 시 색상 | 갈색 / 암갈색 / 검은색 / 기타 |
| 입고 시 수분 | ${value("initialMoisture")}% |
| 입고 시 pH | ${value("initialPh")} |
| 입고 시 EC | ${value("initialEc")} |
| 이물질 여부 | 없음 / 있음 |
| 이물질 내용 |  |
| 원료 사용 판정 | 사용 / 조건부 사용 / 보류 / 폐기 |

### 원료 입고 메모

\`\`\`text

\`\`\`

---

## 3. 선별·파쇄 기록

| 항목 | 내용 |
|---|---|
| 선별일시 |  |
| 제거한 이물질 | 비닐 / 끈 / 플라스틱 / 금속 / 돌 / 병든 잔사 / 기타 |
| 제거량 | kg |
| 파쇄 장비 |  |
| 파쇄 목표 크기 | 20~50mm |
| 파쇄 후 상태 | 균일 / 일부 덩어리 있음 / 재파쇄 필요 |
| 담당자 | ${value("manager")} |

### 선별·파쇄 메모

\`\`\`text

\`\`\`

---

## 4. 염류관리 기록

| 항목 | 내용 |
|---|---|
| 측정일시 |  |
| 측정 방식 | 1:5 추출 / 1:10 추출 / 기타 |
| 후배지 pH | ${value("initialPh")} |
| 후배지 EC | ${value("initialEc")} |
| 후배지 수분 | ${value("initialMoisture")}% |
| 염류 판정 | 낮음 / 중간 / 높음 / 매우 높음 |
| 수행 조치 | 조치 없음 / 흡착재 투입 / 저염 원료 희석 / 세척·탈수 / 혼합비 제한 |
| 투입 흡착재 | 제올라이트 / 바이오차 / 왕겨숯 / 기타 |
| 투입량 | kg |
| 재측정 pH |  |
| 재측정 EC |  |
| 재측정 수분 | % |

### 염류관리 메모

\`\`\`text

\`\`\`

---

## 5. 배합 기록

### 목표 배합

${recipeType}

| 원료 | 계획 투입량 | 실제 투입량 | 비고 |
|---|---:|---:|---|
${makeRecipeRows(recipeItems)}
| 기타 |  |  |  |

## 배합 후 측정값

| 항목 | 목표 | 실제 | 판정 |
|---|---:|---:|---|
| 수분 | 55~60% |  | 적합 / 부적합 |
| pH | 6.5~7.5 |  | 적합 / 부적합 |
| C/N | 25~30 |  | 적합 / 부적합 |
| 냄새 | 부패취 없음 |  | 적합 / 부적합 |
| 통기성 | 양호 |  | 적합 / 부적합 |

### 배합 메모

\`\`\`text

\`\`\`

---

## 6. 고온부숙 기록

| 항목 | 내용 |
|---|---|
| 부숙 시작일 |  |
| 부숙 종료일 |  |
| 더미 높이 | m |
| 더미 폭 | m |
| 통기 방식 | 자연통기 / 뒤집기 / 강제송풍 |
| 목표 온도 | 55~65℃ |
| 고온 유지 목표 | 7~14일 |
| 실제 고온 유지 기간 | 일 |
| 뒤집기 횟수 | 회 |
| 문제 발생 | 없음 / 과열 / 발열 부족 / 부패취 / 암모니아취 / 과습 / 건조 |

## 고온부숙 온도 기록표

| 일차 | 오전 온도 | 오후 온도 | 냄새 | 수분 상태 | 조치 |
|---:|---:|---:|---|---|---|
${makeTemperatureRows()}

### 고온부숙 메모

\`\`\`text

\`\`\`

---

## 7. 후숙 기록

| 항목 | 내용 |
|---|---|
| 후숙 시작일 |  |
| 후숙 종료일 |  |
| 후숙 기간 | 일 |
| 평균 온도 | ℃ |
| 수분 상태 | 적정 / 과습 / 건조 |
| 뒤집기 횟수 | 회 |
| 암모니아취 | 없음 / 약함 / 강함 |
| 부패취 | 없음 / 약함 / 강함 |
| 색상 | 갈색 / 암갈색 / 기타 |
| 촉감 | 부슬부슬 / 끈적임 / 덩어리 많음 |
| 후숙 판정 | 완료 / 추가 후숙 필요 / 재부숙 필요 |

### 후숙 메모

\`\`\`text

\`\`\`

---

## 8. 기능성 미생물 접종 기록

| 항목 | 내용 |
|---|---|
| 접종일시 |  |
| 접종 전 원료 온도 | ℃ |
| 접종 전 수분 | % |
| 미생물제 종류 | Bacillus / Lactobacillus / 효모 / 복합 |
| 미생물제 제품명 또는 균주명 |  |
| 미생물제 투입량 | kg |
| 당밀 투입량 | kg |
| 희석수량 | L |
| 분무 방식 | 수동 / 분무기 / 혼합기 |
| 안정화 발효 기간 | 일 |
| 접종 후 냄새 | 정상 / 산취 / 암모니아취 / 부패취 |
| 접종 판정 | 적합 / 조건부 / 부적합 |

### 미생물 접종 메모

\`\`\`text

\`\`\`

---

## 9. 건조·분쇄·펠릿화 기록

| 항목 | 내용 |
|---|---|
| 건조 시작일 |  |
| 건조 방식 | 자연건조 / 열풍건조 / 저온건조 |
| 건조 온도 | ℃ |
| 건조 후 수분 | % |
| 분쇄 입도 | mm |
| 펠릿 성형일 |  |
| 펠릿기 모델 |  |
| 펠릿 직경 | mm |
| 펠릿 길이 | mm |
| 펠릿 전 수분 | % |
| 펠릿 후 수분 | % |
| 냉각 수행 | 예 / 아니오 |
| 재건조 수행 | 예 / 아니오 |
| 파손율 | % |
| 분진 발생 | 낮음 / 중간 / 높음 |
| 펠릿화 판정 | 적합 / 조건부 / 부적합 |

### 펠릿화 메모

\`\`\`text

\`\`\`

---

## 10. 품질검사 기록

| 검사 항목 | 목표 기준 | 측정값 | 판정 |
|---|---:|---:|---|
| 수분 | 15~20% 권장 |  | 적합 / 부적합 |
| pH | 6.5~8.0 |  | 적합 / 부적합 |
| EC | 작물별 기준에 맞게 관리 |  | 적합 / 주의 / 부적합 |
| 유기물 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 총질소 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 인산 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 칼리 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| C/N | 15~25 권장 |  | 적합 / 주의 / 부적합 |
| 부숙도 | 미숙취·발열 없음 |  | 적합 / 부적합 |
| 발아지수 | 70 이상, 가능하면 80 이상 |  | 적합 / 부적합 |
| 병원성 미생물 | 기준 이내 |  | 적합 / 부적합 |
| 중금속 | 기준 이내 |  | 적합 / 부적합 |
| 악취 | 암모니아취·부패취 없음 |  | 적합 / 부적합 |
| 이물질 | 육안상 없어야 함 |  | 적합 / 부적합 |
| 포장 후 곰팡이 재발 | 없어야 함 |  | 적합 / 부적합 |

### 품질검사 메모

\`\`\`text

\`\`\`

---

## 11. 포장 및 출하 기록

| 항목 | 내용 |
|---|---|
| 포장일 |  |
| 포장 단위 | ${value("bagKg")}kg |
| 포장 수량 | 포 |
| 실제 총중량 | kg |
| 제품명 | ${value("productName")} |
| 로트번호 표시 | 예 / 아니오 |
| 보관 장소 |  |
| 출하 가능 여부 | 가능 / 조건부 / 불가 |
| 출하일 |  |
| 납품처 |  |

---

## 12. 최종 출하 판정

- [ ] 출하 가능
- [ ] 재건조 후 출하 가능
- [ ] 추가 후숙 후 재검사
- [ ] 재부숙 필요
- [ ] 원료 또는 제품 사용 제한
- [ ] 폐기 또는 별도 처리

## 최종 의견

\`\`\`text

\`\`\`

---

## 13. 승인

| 구분 | 이름 | 서명 | 일자 |
|---|---|---|---|
| 작성자 | ${value("manager")} |  |  |
| 검토자 |  |  |  |
| 승인자 |  |  |  |
`;

  currentMarkdown = markdown;
  preview.textContent = markdown;
}

async function copyMarkdown() {
  if (!currentMarkdown) {
    generateMarkdown();
  }

  try {
    await navigator.clipboard.writeText(currentMarkdown);
    window.alert("Markdown 내용이 복사되었습니다.");
  } catch {
    window.alert("복사에 실패했습니다. 미리보기 내용을 직접 선택해 복사하세요.");
  }
}

function downloadMarkdown() {
  if (!currentMarkdown) {
    generateMarkdown();
  }

  const filename = `${value("batchId") || "farmerstree-batch-record"}.md`;
  const blob = new Blob([currentMarkdown], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", generateMarkdown);
  input.addEventListener("change", generateMarkdown);
});

generateButton.addEventListener("click", generateMarkdown);
copyButton.addEventListener("click", copyMarkdown);
downloadButton.addEventListener("click", downloadMarkdown);

generateMarkdown();

```

---
## FILE: batch-generator/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 제조 배치 기록 자동 생성기</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>제조 배치 기록 자동 생성기</h1>
      <p class="description">
        후배지 펠릿비료 제조번호, 원료 입고량, 제품 유형, 담당자 정보를 입력하면
        제조 배치 기록서 Markdown 파일을 자동 생성합니다.
      </p>
    </section>

    <section class="grid">
      <section class="card form-card">
        <h2>배치 정보 입력</h2>

        <div class="form-grid">
          <label>
            제조번호
            <input id="batchId" type="text" value="FT-FERT-20260429-001" />
          </label>

          <label>
            제조일자
            <input id="manufactureDate" type="date" />
          </label>

          <label>
            제조장소
            <input id="location" type="text" value="Farmerstree 발효장" />
          </label>

          <label>
            담당자
            <input id="manager" type="text" value="운목" />
          </label>

          <label>
            제품 유형
            <select id="productType">
              <option value="일반형 고부숙 펠릿">일반형 고부숙 펠릿</option>
              <option value="프리미엄 기능성 펠릿">프리미엄 기능성 펠릿</option>
              <option value="저염 민감작물용">저염 민감작물용</option>
            </select>
          </label>

          <label>
            목표 제품명
            <input id="productName" type="text" value="후배지 고부숙 펠릿비료" />
          </label>

          <label>
            포장 단위 kg
            <input id="bagKg" type="number" value="20" min="1" />
          </label>

          <label>
            목표 생산량 포
            <input id="targetBags" type="number" value="1000" min="1" />
          </label>

          <label>
            후배지 공급처
            <input id="supplier" type="text" value="진안 버섯농가" />
          </label>

          <label>
            버섯 종류
            <select id="mushroomType">
              <option value="느타리">느타리</option>
              <option value="새송이">새송이</option>
              <option value="표고">표고</option>
              <option value="양송이">양송이</option>
              <option value="혼합">혼합</option>
            </select>
          </label>

          <label>
            후배지 입고량 kg
            <input id="substrateKg" type="number" value="1000" min="1" />
          </label>

          <label>
            수거 후 경과시간
            <input id="elapsedHours" type="number" value="24" min="0" />
          </label>

          <label>
            입고 시 수분 %
            <input id="initialMoisture" type="number" value="65" step="0.1" />
          </label>

          <label>
            입고 시 pH
            <input id="initialPh" type="number" value="7.0" step="0.1" />
          </label>

          <label>
            입고 시 EC
            <input id="initialEc" type="number" value="2.5" step="0.1" />
          </label>

          <label>
            목표 배합
            <select id="recipeType">
              <option value="A안: 일반 농가용 고부숙 펠릿">A안: 일반 농가용 고부숙 펠릿</option>
              <option value="B안: 프리미엄 기능성 펠릿">B안: 프리미엄 기능성 펠릿</option>
              <option value="C안: 저염 민감작물용">C안: 저염 민감작물용</option>
            </select>
          </label>
        </div>

        <div class="button-row">
          <button id="generateButton">기록서 생성</button>
          <button id="copyButton">Markdown 복사</button>
          <button id="downloadButton">.md 파일 다운로드</button>
        </div>
      </section>

      <section class="card preview-card">
        <h2>생성 결과 미리보기</h2>
        <pre id="preview"></pre>
      </section>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: batch-generator/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1280px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.2;
}

.description {
  max-width: 900px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4c5748;
}

.grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 24px;
  align-items: start;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

input,
select {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
}

input:focus,
select:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  background: #5f7f45;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.preview-card {
  position: sticky;
  top: 24px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: #1f2a1f;
  color: #f4f6f0;
  border-radius: 16px;
  padding: 20px;
  min-height: 720px;
  max-height: 82vh;
  overflow: auto;
  font-size: 13px;
  line-height: 1.55;
}

@media (max-width: 980px) {
  .grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .preview-card {
    position: static;
  }
}

```

---
## FILE: biochar-calculator/app.js
```
const inputs = {
  totalSmsKg: document.getElementById("totalSmsKg"),
  biocharRatio: document.getElementById("biocharRatio"),
  initialMoisture: document.getElementById("initialMoisture"),
  targetMoisture: document.getElementById("targetMoisture"),
  charYield: document.getElementById("charYield"),
  blendRatio: document.getElementById("blendRatio"),
  fertilizerYield: document.getElementById("fertilizerYield"),
  bagKg: document.getElementById("bagKg"),
  biocharCostPerKg: document.getElementById("biocharCostPerKg"),
  premiumPerBag: document.getElementById("premiumPerBag"),
};

const outputs = {
  smsForBiochar: document.getElementById("smsForBiochar"),
  smsForFertilizer: document.getElementById("smsForFertilizer"),
  driedSmsKg: document.getElementById("driedSmsKg"),
  biocharKg: document.getElementById("biocharKg"),
  baseFertilizerKg: document.getElementById("baseFertilizerKg"),
  finalProductKg: document.getElementById("finalProductKg"),
  bagCount: document.getElementById("bagCount"),
  extraCostPerBag: document.getElementById("extraCostPerBag"),
  netPremiumPerBag: document.getElementById("netPremiumPerBag"),
  message: document.getElementById("message"),
};

function num(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function formatKg(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}톤`;
  }

  return `${Math.round(value).toLocaleString("ko-KR")}kg`;
}

function formatWon(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function calculate() {
  const totalSmsKg = num(inputs.totalSmsKg);
  const biocharRatio = num(inputs.biocharRatio) / 100;
  const initialMoisture = num(inputs.initialMoisture) / 100;
  const targetMoisture = num(inputs.targetMoisture) / 100;
  const charYield = num(inputs.charYield) / 100;
  const blendRatio = num(inputs.blendRatio) / 100;
  const fertilizerYield = num(inputs.fertilizerYield) / 100;
  const bagKg = Math.max(num(inputs.bagKg), 1);
  const biocharCostPerKg = num(inputs.biocharCostPerKg);
  const premiumPerBag = num(inputs.premiumPerBag);

  const smsForBiochar = totalSmsKg * biocharRatio;
  const smsForFertilizer = totalSmsKg - smsForBiochar;

  const dryMatter = smsForBiochar * (1 - initialMoisture);
  const driedSmsKg = targetMoisture < 1 ? dryMatter / (1 - targetMoisture) : dryMatter;

  const biocharKg = driedSmsKg * charYield;
  const baseFertilizerKg = smsForFertilizer * fertilizerYield;

  const maxBiocharByBlend =
    blendRatio > 0 ? (baseFertilizerKg * blendRatio) / (1 - blendRatio) : 0;

  const usedBiocharKg = blendRatio > 0 ? Math.min(biocharKg, maxBiocharByBlend) : 0;
  const unusedBiocharKg = Math.max(biocharKg - usedBiocharKg, 0);

  const finalProductKg = baseFertilizerKg + usedBiocharKg;
  const bagCount = finalProductKg / bagKg;

  const totalBiocharCost = usedBiocharKg * biocharCostPerKg;
  const extraCostPerBag = bagCount > 0 ? totalBiocharCost / bagCount : 0;
  const netPremiumPerBag = premiumPerBag - extraCostPerBag;

  outputs.smsForBiochar.textContent = formatKg(smsForBiochar);
  outputs.smsForFertilizer.textContent = formatKg(smsForFertilizer);
  outputs.driedSmsKg.textContent = formatKg(driedSmsKg);
  outputs.biocharKg.textContent = `${formatKg(biocharKg)} 생산 / ${formatKg(usedBiocharKg)} 사용`;
  outputs.baseFertilizerKg.textContent = formatKg(baseFertilizerKg);
  outputs.finalProductKg.textContent = formatKg(finalProductKg);
  outputs.bagCount.textContent = `${Math.floor(bagCount).toLocaleString("ko-KR")}포`;
  outputs.extraCostPerBag.textContent = formatWon(extraCostPerBag);
  outputs.netPremiumPerBag.textContent = formatWon(netPremiumPerBag);

  outputs.message.textContent = makeMessage({
    blendRatio,
    biocharKg,
    usedBiocharKg,
    unusedBiocharKg,
    extraCostPerBag,
    netPremiumPerBag,
  });
}

function makeMessage({
  blendRatio,
  biocharKg,
  usedBiocharKg,
  unusedBiocharKg,
  extraCostPerBag,
  netPremiumPerBag,
}) {
  if (blendRatio === 0) {
    return "최종 혼합비가 0%입니다. biochar를 제품에 넣지 않는 조건입니다.";
  }

  if (usedBiocharKg <= 0) {
    return "사용 가능한 biochar가 없습니다. biochar 전환 비율, 탄화 수율, 혼합비를 다시 확인하세요.";
  }

  const messages = [];

  messages.push(
    `최종 제품에는 SMS biochar 약 ${formatKg(usedBiocharKg)}이 혼합됩니다.`
  );

  if (unusedBiocharKg > 1) {
    messages.push(
      `생산 biochar 중 약 ${formatKg(unusedBiocharKg)}은 남습니다. 별도 토양개량재, 다음 배치 혼합, 시험포 투입용으로 관리할 수 있습니다.`
    );
  }

  messages.push(
    `biochar로 인한 포대당 추가 원가는 약 ${formatWon(extraCostPerBag)}입니다.`
  );

  if (netPremiumPerBag > 0) {
    messages.push(
      `설정한 프리미엄 가격 기준으로 포대당 약 ${formatWon(netPremiumPerBag)}의 순증 효과가 있습니다. 탄소형 제품으로 사업성이 있습니다.`
    );
  } else {
    messages.push(
      "설정한 프리미엄 가격으로는 biochar 추가 원가를 충분히 회수하지 못합니다. 판매가 상승분 또는 제조비를 조정해야 합니다."
    );
  }

  return messages.join(" ");
}

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", calculate);
});

calculate();

```

---
## FILE: biochar-calculator/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree SMS Biochar 계산기</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>SMS Biochar 전환·혼합 계산기</h1>
      <p class="description">
        버섯 후배지 일부를 SMS biochar로 전환할 때 건조 중량, 탄화 수율, biochar 생산량,
        최종 펠릿비료 혼합비, 제품 포대 수를 계산합니다.
      </p>
    </section>

    <section class="grid">
      <section class="card input-card">
        <h2>입력값</h2>

        <label>
          총 후배지 확보량 kg
          <input id="totalSmsKg" type="number" value="1000" min="1" />
        </label>

        <label>
          Biochar 전환 비율 %
          <input id="biocharRatio" type="number" value="20" min="0" max="100" step="1" />
        </label>

        <label>
          후배지 초기 수분 %
          <input id="initialMoisture" type="number" value="65" min="0" max="95" step="0.1" />
        </label>

        <label>
          탄화 전 목표 수분 %
          <input id="targetMoisture" type="number" value="15" min="0" max="50" step="0.1" />
        </label>

        <label>
          탄화 수율 %
          <input id="charYield" type="number" value="35" min="5" max="80" step="0.1" />
        </label>

        <label>
          최종 비료 내 biochar 혼합비 %
          <input id="blendRatio" type="number" value="5" min="0" max="30" step="0.1" />
        </label>

        <label>
          일반 후배지 펠릿 생산 수율 %
          <input id="fertilizerYield" type="number" value="65" min="10" max="100" step="0.1" />
        </label>

        <label>
          포장 단위 kg
          <input id="bagKg" type="number" value="20" min="1" />
        </label>

        <label>
          Biochar 제조비 원/kg
          <input id="biocharCostPerKg" type="number" value="800" min="0" />
        </label>

        <label>
          Biochar 프리미엄 판매가 상승분 원/포
          <input id="premiumPerBag" type="number" value="1500" min="0" />
        </label>
      </section>

      <section class="card result-card">
        <h2>계산 결과</h2>

        <div class="result-row">
          <span>Biochar 전환용 생후배지</span>
          <strong id="smsForBiochar">0kg</strong>
        </div>

        <div class="result-row">
          <span>비료화용 후배지</span>
          <strong id="smsForFertilizer">0kg</strong>
        </div>

        <div class="result-row">
          <span>탄화 전 건조 후 중량</span>
          <strong id="driedSmsKg">0kg</strong>
        </div>

        <div class="result-row">
          <span>예상 SMS biochar 생산량</span>
          <strong id="biocharKg">0kg</strong>
        </div>

        <div class="result-row">
          <span>기본 펠릿비료 생산량</span>
          <strong id="baseFertilizerKg">0kg</strong>
        </div>

        <div class="result-row">
          <span>최종 혼합 제품 총량</span>
          <strong id="finalProductKg">0kg</strong>
        </div>

        <div class="highlight">
          <span>예상 20kg 포대 수</span>
          <strong id="bagCount">0포</strong>
        </div>

        <div class="highlight secondary">
          <span>Biochar 투입 후 포대당 추가 원가</span>
          <strong id="extraCostPerBag">0원</strong>
        </div>

        <div class="highlight secondary">
          <span>포대당 프리미엄 순증 효과</span>
          <strong id="netPremiumPerBag">0원</strong>
        </div>

        <div id="message" class="message">
          계산 결과가 여기에 표시됩니다.
        </div>
      </section>
    </section>

    <section class="card">
      <h2>제품 포지션</h2>
      <div class="position-grid">
        <div>
          <strong>A. 후배지 고부숙 펠릿비료</strong>
          <p>일반 농가용 제품군으로 원가 안정성과 대량 공급에 초점을 둡니다.</p>
        </div>
        <div>
          <strong>B. 후배지 기능성 미생물 펠릿비료</strong>
          <p>프리미엄 농가용 제품군으로 시설원예·과수 시장과 기능성 미생물 강점을 강조합니다.</p>
        </div>
        <div>
          <strong>C. 후배지 + SMS Biochar 복합 펠릿</strong>
          <p>토양개량, 수분 보유, 탄소저장, ESG·공공사업 대응에 적합한 고부가가치 브랜드형 제품군입니다.</p>
        </div>
      </div>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: biochar-calculator/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1220px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 900;
}

h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.2;
}

.description {
  max-width: 920px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4c5748;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 0.95fr;
  gap: 24px;
  align-items: start;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 24px;
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

.input-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.input-card h2 {
  grid-column: 1 / -1;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

input {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
}

input:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

.result-card {
  position: sticky;
  top: 24px;
}

.result-row,
.highlight {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #edf0e8;
}

.result-row span,
.highlight span {
  color: #566252;
  font-weight: 700;
}

.result-row strong {
  font-size: 20px;
}

.highlight {
  margin-top: 14px;
  padding: 18px;
  border-radius: 16px;
  border: none;
  background: #e8f1dd;
}

.highlight strong {
  font-size: 26px;
  color: #213b18;
}

.highlight.secondary {
  background: #eef3f8;
}

.message {
  margin-top: 22px;
  padding: 18px;
  border-radius: 14px;
  background: #faf8ed;
  color: #574d2f;
  line-height: 1.65;
  font-weight: 800;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.position-grid div {
  padding: 20px;
  border-radius: 18px;
  background: #f7f9f4;
  border: 1px solid #e4eadc;
}

.position-grid strong {
  display: block;
  font-size: 20px;
  margin-bottom: 10px;
}

.position-grid p {
  margin: 0;
  color: #566252;
  line-height: 1.65;
}

@media (max-width: 920px) {
  .grid,
  .input-card,
  .position-grid {
    grid-template-columns: 1fr;
  }

  .result-card {
    position: static;
  }
}

```

---
## FILE: biochar-dashboard/app.js
```
const STORAGE_KEY = "farmerstree-biochar-lots";

const inputs = {
  lotNo: document.getElementById("lotNo"),
  temperature: document.getElementById("temperature"),
  duration: document.getElementById("duration"),
  moisture: document.getElementById("moisture"),
  yield: document.getElementById("yield"),
  ph: document.getElementById("ph"),
  ec: document.getElementById("ec"),
  ash: document.getElementById("ash"),
  fixedCarbon: document.getElementById("fixedCarbon"),
  odor: document.getElementById("odor"),
  color: document.getElementById("color"),
  particle: document.getElementById("particle"),
};

const outputs = {
  count: document.getElementById("count"),
  avgYield: document.getElementById("avgYield"),
  avgFixed: document.getElementById("avgFixed"),
  badCount: document.getElementById("badCount"),
  message: document.getElementById("message"),
  tbody: document.getElementById("tbody"),
};

const addBtn = document.getElementById("addBtn");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

let rows = load();

function n(el) {
  const v = Number(el.value);
  return Number.isFinite(v) ? v : 0;
}

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function judge(row) {
  const issues = [];
  let level = "good";

  if (row.temperature < 450 || row.temperature > 600) issues.push("온도");
  if (row.duration < 45 || row.duration > 150) issues.push("시간");
  if (row.moisture > 15) issues.push("수분");
  if (row.yield < 25 || row.yield > 40) issues.push("수율");
  if (row.ph < 7 || row.ph > 10) issues.push("pH");
  if (row.ec > 3) issues.push("EC");
  if (row.ash < 10 || row.ash > 30) issues.push("회분");
  if (row.fixedCarbon < 45) issues.push("고정탄소");
  if (row.odor !== "normal") issues.push("냄새");

  if (issues.length >= 4) level = "danger";
  else if (issues.length >= 1) level = "warn";

  return {
    level,
    title: level === "good" ? "적합" : level === "warn" ? "주의" : "부적합",
    detail: issues.length ? `${issues.join(", ")} 점검 필요` : "기준 충족",
  };
}

function addRow() {
  const row = {
    id: Date.now(),
    lotNo: inputs.lotNo.value.trim() || `LOT-${Date.now()}`,
    temperature: n(inputs.temperature),
    duration: n(inputs.duration),
    moisture: n(inputs.moisture),
    yield: n(inputs.yield),
    ph: n(inputs.ph),
    ec: n(inputs.ec),
    ash: n(inputs.ash),
    fixedCarbon: n(inputs.fixedCarbon),
    odor: inputs.odor.value,
    color: inputs.color.value,
    particle: n(inputs.particle),
  };

  row.judgement = judge(row);
  rows.push(row);
  save();
  render();
}

function clearAll() {
  if (!window.confirm("로트 기록을 모두 삭제할까요?")) return;
  rows = [];
  save();
  render();
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function exportCsv() {
  if (!rows.length) {
    window.alert("내보낼 로트가 없습니다.");
    return;
  }

  const headers = ["로트번호", "온도", "시간", "수분", "수율", "pH", "EC", "회분", "고정탄소", "냄새", "색상", "입도", "판정", "판정상세"];
  const body = rows.map((r) => [
    r.lotNo, r.temperature, r.duration, r.moisture, r.yield, r.ph, r.ec, r.ash, r.fixedCarbon,
    r.odor, r.color, r.particle, r.judgement.title, r.judgement.detail,
  ]);

  const csv = [headers, ...body].map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `farmerstree-biochar-lots-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function mean(arr, key) {
  if (!arr.length) return 0;
  return arr.reduce((s, r) => s + r[key], 0) / arr.length;
}

function render() {
  outputs.tbody.innerHTML = "";

  rows.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.lotNo}</td>
      <td>${r.temperature}℃</td>
      <td>${r.duration}분</td>
      <td>${r.moisture}%</td>
      <td>${r.yield}%</td>
      <td>${r.ph}</td>
      <td>${r.ec}</td>
      <td>${r.ash}%</td>
      <td>${r.fixedCarbon}%</td>
      <td>${r.odor}</td>
      <td>${r.color}</td>
      <td>${r.particle}mm</td>
      <td><span class="badge ${r.judgement.level}">${r.judgement.title}</span><br />${r.judgement.detail}</td>
    `;
    outputs.tbody.appendChild(tr);
  });

  const badCount = rows.filter((r) => r.judgement.level === "danger").length;
  const warnCount = rows.filter((r) => r.judgement.level === "warn").length;

  outputs.count.textContent = `${rows.length}건`;
  outputs.avgYield.textContent = `${mean(rows, "yield").toFixed(1)}%`;
  outputs.avgFixed.textContent = `${mean(rows, "fixedCarbon").toFixed(1)}%`;
  outputs.badCount.textContent = `${badCount}건`;

  if (!rows.length) {
    outputs.message.textContent = "로트를 저장하면 품질 판정이 표시됩니다.";
  } else if (badCount > 0) {
    outputs.message.textContent = `부적합 로트 ${badCount}건이 있습니다. 온도/수분/고정탄소 중심으로 공정을 보정하세요.`;
  } else if (warnCount > 0) {
    outputs.message.textContent = `주의 로트 ${warnCount}건이 있습니다. 혼합 투입 전에 조건 재확인이 필요합니다.`;
  } else {
    outputs.message.textContent = "현재 기록 로트는 기준 범위 내입니다. 비료 혼합용으로 사용 가능합니다.";
  }
}

addBtn.addEventListener("click", addRow);
exportBtn.addEventListener("click", exportCsv);
clearBtn.addEventListener("click", clearAll);

render();

```

---
## FILE: biochar-dashboard/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree SMS Biochar 공정 대시보드</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>SMS Biochar 공정·품질 대시보드</h1>
      <p class="description">
        탄화 온도, 시간, 수분, 수율, pH, EC, 회분, 고정탄소, 냄새, 색상, 입도, 로트번호를 기록하고
        로트별 품질 상태를 판정합니다.
      </p>
    </section>

    <section class="card">
      <h2>로트 입력</h2>
      <div class="form-grid">
        <label>로트번호<input id="lotNo" type="text" value="FT-BC-20260430-001" /></label>
        <label>탄화 온도 ℃<input id="temperature" type="number" value="520" step="1" /></label>
        <label>탄화 시간 분<input id="duration" type="number" value="90" step="1" /></label>
        <label>수분 %<input id="moisture" type="number" value="12" step="0.1" /></label>
        <label>탄화 수율 %<input id="yield" type="number" value="33" step="0.1" /></label>
        <label>pH<input id="ph" type="number" value="8.7" step="0.1" /></label>
        <label>EC<input id="ec" type="number" value="1.8" step="0.1" /></label>
        <label>회분 %<input id="ash" type="number" value="18" step="0.1" /></label>
        <label>고정탄소 %<input id="fixedCarbon" type="number" value="55" step="0.1" /></label>
        <label>냄새
          <select id="odor">
            <option value="normal">정상</option>
            <option value="smoke">연기취</option>
            <option value="burnt">강한 탄내</option>
            <option value="sour">산취</option>
          </select>
        </label>
        <label>색상
          <select id="color">
            <option value="black">검정</option>
            <option value="darkBrown">암갈색</option>
            <option value="brown">갈색</option>
          </select>
        </label>
        <label>입도 mm<input id="particle" type="number" value="2.5" step="0.1" /></label>
      </div>

      <div class="button-row">
        <button id="addBtn">로트 저장</button>
        <button id="exportBtn">CSV 내보내기</button>
        <button id="clearBtn" class="danger">전체 삭제</button>
      </div>
    </section>

    <section class="grid">
      <section class="card">
        <h2>요약</h2>
        <div class="summary-grid">
          <div><span>기록 로트</span><strong id="count">0건</strong></div>
          <div><span>평균 수율</span><strong id="avgYield">0%</strong></div>
          <div><span>평균 고정탄소</span><strong id="avgFixed">0%</strong></div>
          <div><span>부적합 로트</span><strong id="badCount">0건</strong></div>
        </div>
        <div id="message" class="message">로트를 저장하면 품질 판정이 표시됩니다.</div>
      </section>

      <section class="card">
        <h2>권장 기준</h2>
        <ul class="rule-list">
          <li>탄화 온도: 450~600℃</li>
          <li>탄화 시간: 45~150분</li>
          <li>수분: 15% 이하</li>
          <li>탄화 수율: 25~40%</li>
          <li>pH: 7.0~10.0</li>
          <li>EC: 3.0 이하 권장</li>
          <li>회분: 10~30%</li>
          <li>고정탄소: 45% 이상 권장</li>
        </ul>
      </section>
    </section>

    <section class="card">
      <h2>로트 기록</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>로트번호</th>
              <th>온도</th>
              <th>시간</th>
              <th>수분</th>
              <th>수율</th>
              <th>pH</th>
              <th>EC</th>
              <th>회분</th>
              <th>고정탄소</th>
              <th>냄새</th>
              <th>색상</th>
              <th>입도</th>
              <th>판정</th>
            </tr>
          </thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: biochar-dashboard/style.css
```
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}
.container { width: min(1220px, 92vw); margin: 0 auto; padding: 48px 0; }
.hero { margin-bottom: 24px; }
.eyebrow { margin: 0 0 8px; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #5d7145; font-weight: 800; }
h1 { margin: 0; font-size: 36px; }
.description { margin-top: 14px; max-width: 980px; line-height: 1.7; color: #4c5748; }
.card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
}
h2 { margin: 0 0 18px; }
.form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
label { display: flex; flex-direction: column; gap: 7px; font-size: 14px; font-weight: 700; }
input, select {
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 15px;
  background: #fbfcfa;
}
.button-row { display: flex; gap: 10px; margin-top: 16px; }
button {
  border: none;
  border-radius: 12px;
  padding: 11px 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  color: #fff;
  background: #5f7f45;
}
button.danger { background: #8a3d31; }
.grid { display: grid; grid-template-columns: 1fr 0.9fr; gap: 20px; }
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.summary-grid div { background: #eef4e7; border-radius: 14px; padding: 14px; }
.summary-grid span { display: block; font-size: 13px; color: #566252; margin-bottom: 7px; }
.summary-grid strong { font-size: 22px; }
.message { margin-top: 16px; background: #faf8ed; border-radius: 12px; padding: 14px; line-height: 1.6; font-weight: 700; color: #574d2f; }
.rule-list { margin: 0; padding-left: 18px; line-height: 1.9; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 1100px; }
th, td { border-bottom: 1px solid #edf0e8; padding: 10px; text-align: left; font-size: 13px; }
th { background: #edf4e5; color: #2f4428; }
.badge { display: inline-flex; border-radius: 999px; padding: 4px 8px; font-size: 12px; font-weight: 900; }
.good { background: #e4f3da; color: #2f5e20; }
.warn { background: #fff3cf; color: #735400; }
.danger { background: #ffe0d8; color: #7b2b1d; }
@media (max-width: 980px) {
  .form-grid, .grid, .summary-grid { grid-template-columns: 1fr; }
}

```

---
## FILE: biochar-lot-generator/app.js
```
const inputs = {
  biocharLotId: document.getElementById("biocharLotId"),
  sourceBatchId: document.getElementById("sourceBatchId"),
  manufactureDate: document.getElementById("manufactureDate"),
  location: document.getElementById("location"),
  manager: document.getElementById("manager"),
  useCase: document.getElementById("useCase"),
  rawSmsKg: document.getElementById("rawSmsKg"),
  initialMoisture: document.getElementById("initialMoisture"),
  driedSmsKg: document.getElementById("driedSmsKg"),
  pyrolysisTemp: document.getElementById("pyrolysisTemp"),
  pyrolysisMinutes: document.getElementById("pyrolysisMinutes"),
  pyrolysisMethod: document.getElementById("pyrolysisMethod"),
  biocharKg: document.getElementById("biocharKg"),
  charYield: document.getElementById("charYield"),
  moisture: document.getElementById("moisture"),
  ph: document.getElementById("ph"),
  ec: document.getElementById("ec"),
  ash: document.getElementById("ash"),
  fixedCarbon: document.getElementById("fixedCarbon"),
  particleSize: document.getElementById("particleSize"),
  odor: document.getElementById("odor"),
  foreignMatter: document.getElementById("foreignMatter"),
  heavyMetalTest: document.getElementById("heavyMetalTest"),
  finalStatus: document.getElementById("finalStatus"),
  comment: document.getElementById("comment"),
};

const preview = document.getElementById("preview");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");

let currentMarkdown = "";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

inputs.manufactureDate.value = todayString();

function value(key) {
  return inputs[key].value;
}

function numberValue(key) {
  const parsed = Number(inputs[key].value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatKg(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)}톤`;
  }

  return `${Number(kg).toLocaleString("ko-KR", {
    maximumFractionDigits: 1,
  })}kg`;
}

function calculateYield() {
  const driedSmsKg = numberValue("driedSmsKg");
  const biocharKg = numberValue("biocharKg");

  if (driedSmsKg <= 0) return 0;
  return (biocharKg / driedSmsKg) * 100;
}

function judgementText() {
  const temp = numberValue("pyrolysisTemp");
  const moisture = numberValue("moisture");
  const ph = numberValue("ph");
  const ec = numberValue("ec");
  const fixedCarbon = numberValue("fixedCarbon");
  const heavyMetal = value("heavyMetalTest");
  const odor = value("odor");
  const foreignMatter = value("foreignMatter");

  const notes = [];

  if (temp >= 450 && temp <= 550) {
    notes.push("탄화 온도는 450~550℃ 권장 범위에 해당한다.");
  } else if (temp < 450) {
    notes.push("탄화 온도가 낮아 탄화 부족 가능성이 있으므로 휘발성 잔류물 여부 확인이 필요하다.");
  } else {
    notes.push("탄화 온도가 높아 pH 상승, 회분 증가, 영양성분 손실 가능성 확인이 필요하다.");
  }

  if (moisture <= 10) {
    notes.push("최종 수분은 보관성 측면에서 양호하다.");
  } else if (moisture <= 15) {
    notes.push("최종 수분은 주의 구간으로 장기 보관 전 재건조 검토가 필요하다.");
  } else {
    notes.push("최종 수분이 높아 재건조가 필요하다.");
  }

  if (ph >= 6 && ph <= 10) {
    notes.push("pH는 일반적인 사용 가능 범위에 있다.");
  } else {
    notes.push("pH가 사용 가능 범위를 벗어나 혼합비와 사용 작물 제한 검토가 필요하다.");
  }

  if (ec > 5) {
    notes.push("EC가 높아 민감작물용 제품에는 사용 제한이 필요하다.");
  } else if (ec > 4) {
    notes.push("EC가 다소 높아 저염 제품에는 혼합비를 낮추는 것이 좋다.");
  } else {
    notes.push("EC는 내부 기준상 관리 가능한 범위이다.");
  }

  if (fixedCarbon >= 50) {
    notes.push("고정탄소 함량은 탄소저장형 제품 포지션에 유리하다.");
  } else {
    notes.push("고정탄소 함량은 탄소저장형 제품 기준으로 추가 검토가 필요하다.");
  }

  if (heavyMetal === "미검사") {
    notes.push("중금속 외부검사가 미실시되어 공식 판매 전 시험성적서 확보가 필요하다.");
  } else if (heavyMetal.includes("부적합")) {
    notes.push("중금속 검사 부적합으로 제품 사용 및 판매가 불가하다.");
  } else {
    notes.push("중금속 외부검사는 적합으로 기록되었다.");
  }

  if (odor.includes("부패") || odor.includes("화학")) {
    notes.push("냄새 상태가 부적합하므로 사용 보류가 필요하다.");
  }

  if (foreignMatter === "많음") {
    notes.push("이물질이 많아 재선별 전 사용하면 안 된다.");
  }

  return notes.map((note) => `- ${note}`).join("\n");
}

function generateMarkdown() {
  const calculatedYield = calculateYield();

  currentMarkdown = `# Farmerstree SMS Biochar 로트 기록서

## 1. 기본 정보

| 항목 | 내용 |
|---|---|
| Biochar 로트번호 | ${value("biocharLotId")} |
| 원료 후배지 제조번호 | ${value("sourceBatchId")} |
| 제조일자 | ${value("manufactureDate")} |
| 제조장소 | ${value("location")} |
| 담당자 | ${value("manager")} |
| 사용 목적 | ${value("useCase")} |
| 최종 판정 | ${value("finalStatus")} |

---

## 2. 원료 후배지 기록

| 항목 | 내용 |
|---|---|
| 원료 후배지 제조번호 | ${value("sourceBatchId")} |
| 생후배지 투입량 | ${formatKg(numberValue("rawSmsKg"))} |
| 초기 수분 | ${value("initialMoisture")}% |
| 탄화 전 건조 중량 | ${formatKg(numberValue("driedSmsKg"))} |

### 원료 메모

\`\`\`text

\`\`\`

---

## 3. 탄화 공정 기록

| 항목 | 내용 |
|---|---|
| 탄화 방식 | ${value("pyrolysisMethod")} |
| 탄화 온도 | ${value("pyrolysisTemp")}℃ |
| 탄화 시간 | ${value("pyrolysisMinutes")}분 |
| Biochar 생산량 | ${formatKg(numberValue("biocharKg"))} |
| 입력 탄화 수율 | ${value("charYield")}% |
| 계산 탄화 수율 | ${calculatedYield.toFixed(1)}% |

### 탄화 공정 메모

\`\`\`text

\`\`\`

---

## 4. Biochar 품질검사 기록

| 검사 항목 | 측정값 | 내부 기준 | 판정 |
|---|---:|---|---|
| 수분 | ${value("moisture")}% | 10% 이하 양호, 15% 초과 재건조 |  |
| pH | ${value("ph")} | 6~10 사용 가능 |  |
| EC | ${value("ec")} | 4.0 이하 권장, 5.0 초과 사용 제한 |  |
| 회분 | ${value("ash")}% | 과다 시 염류·무기물 증가 주의 |  |
| 고정탄소 | ${value("fixedCarbon")}% | 높을수록 탄소저장형 제품에 유리 |  |
| 입도 | ${value("particleSize")}mm | 10mm 초과 시 분쇄 권장 |  |
| 냄새 | ${value("odor")} | 부패취·화학취 없어야 함 |  |
| 이물질 | ${value("foreignMatter")} | 없어야 함 |  |
| 중금속 외부검사 | ${value("heavyMetalTest")} | 공식 판매 전 검사 필요 |  |

---

## 5. 내부 판정 근거

${judgementText()}

---

## 6. 최종 의견

\`\`\`text
${value("comment")}
\`\`\`

---

## 7. 사용 연결 기록

| 항목 | 내용 |
|---|---|
| 혼합 대상 비료 제조번호 |  |
| 혼합 비율 | % |
| 혼합일자 |  |
| 혼합 담당자 |  |
| 사용 포장 로트 |  |
| 시험포 또는 납품처 |  |

---

## 8. 확인 사항

- [ ] 원료 후배지 제조번호와 Biochar 로트번호 연결 확인
- [ ] 탄화 온도 및 시간 기록 확인
- [ ] Biochar 생산량 및 수율 확인
- [ ] 수분, pH, EC, 고정탄소 기록 확인
- [ ] 중금속 외부검사 여부 확인
- [ ] 혼합 대상 비료 제조번호 기록
- [ ] 공식 판매 전 관련 법적 기준 확인

---

## 9. 승인

| 구분 | 이름 | 서명 | 일자 |
|---|---|---|---|
| 작성자 | ${value("manager")} |  |  |
| 검토자 |  |  |  |
| 승인자 |  |  |  |
`;

  preview.textContent = currentMarkdown;
}

async function copyMarkdown() {
  if (!currentMarkdown) {
    generateMarkdown();
  }

  try {
    await navigator.clipboard.writeText(currentMarkdown);
    window.alert("Biochar 로트 기록서 Markdown이 복사되었습니다.");
  } catch {
    window.alert("복사에 실패했습니다. 미리보기 내용을 직접 복사하세요.");
  }
}

function downloadMarkdown() {
  if (!currentMarkdown) {
    generateMarkdown();
  }

  const filename = `${value("biocharLotId") || "farmerstree-biochar-lot"}.md`;
  const blob = new Blob([currentMarkdown], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", generateMarkdown);
  input.addEventListener("change", generateMarkdown);
});

generateButton.addEventListener("click", generateMarkdown);
copyButton.addEventListener("click", copyMarkdown);
downloadButton.addEventListener("click", downloadMarkdown);

generateMarkdown();

```

---
## FILE: biochar-lot-generator/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree Biochar 로트 기록 자동 생성기</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>Biochar 로트 기록 자동 생성기</h1>
      <p class="description">
        SMS biochar의 로트번호, 원료 후배지 제조번호, 탄화 조건, 생산량, 품질검사 결과를 입력하면
        Biochar 로트 기록서 Markdown 파일을 자동 생성합니다.
      </p>
    </section>

    <section class="grid">
      <section class="card form-card">
        <h2>Biochar 로트 정보 입력</h2>

        <div class="form-grid">
          <label>
            Biochar 로트번호
            <input id="biocharLotId" type="text" value="FT-BIO-20260429-001" />
          </label>

          <label>
            원료 후배지 제조번호
            <input id="sourceBatchId" type="text" value="FT-FERT-20260429-001" />
          </label>

          <label>
            제조일자
            <input id="manufactureDate" type="date" />
          </label>

          <label>
            제조장소
            <input id="location" type="text" value="Farmerstree Biochar 탄화장" />
          </label>

          <label>
            담당자
            <input id="manager" type="text" value="운목" />
          </label>

          <label>
            사용 목적
            <select id="useCase">
              <option value="후배지 펠릿비료 혼합">후배지 펠릿비료 혼합</option>
              <option value="토양개량재 단독 사용">토양개량재 단독 사용</option>
              <option value="시험포 실증용">시험포 실증용</option>
              <option value="보류 / 연구용">보류 / 연구용</option>
            </select>
          </label>

          <label>
            생후배지 투입량 kg
            <input id="rawSmsKg" type="number" value="200" min="0" step="0.1" />
          </label>

          <label>
            초기 수분 %
            <input id="initialMoisture" type="number" value="65" min="0" max="95" step="0.1" />
          </label>

          <label>
            탄화 전 건조 중량 kg
            <input id="driedSmsKg" type="number" value="82" min="0" step="0.1" />
          </label>

          <label>
            탄화 온도 ℃
            <input id="pyrolysisTemp" type="number" value="500" step="1" />
          </label>

          <label>
            탄화 시간 분
            <input id="pyrolysisMinutes" type="number" value="90" step="1" />
          </label>

          <label>
            탄화 방식
            <select id="pyrolysisMethod">
              <option value="중온 무산소/저산소 탄화">중온 무산소/저산소 탄화</option>
              <option value="저온 탄화">저온 탄화</option>
              <option value="고온 탄화">고온 탄화</option>
              <option value="외주 탄화">외주 탄화</option>
            </select>
          </label>

          <label>
            Biochar 생산량 kg
            <input id="biocharKg" type="number" value="29" min="0" step="0.1" />
          </label>

          <label>
            탄화 수율 %
            <input id="charYield" type="number" value="35" step="0.1" />
          </label>

          <label>
            최종 수분 %
            <input id="moisture" type="number" value="8" step="0.1" />
          </label>

          <label>
            pH
            <input id="ph" type="number" value="8.5" step="0.1" />
          </label>

          <label>
            EC
            <input id="ec" type="number" value="2.5" step="0.1" />
          </label>

          <label>
            회분 %
            <input id="ash" type="number" value="18" step="0.1" />
          </label>

          <label>
            고정탄소 %
            <input id="fixedCarbon" type="number" value="55" step="0.1" />
          </label>

          <label>
            입도 mm
            <input id="particleSize" type="number" value="3" step="0.1" />
          </label>

          <label>
            냄새 상태
            <select id="odor">
              <option value="정상 / 탄화취">정상 / 탄화취</option>
              <option value="강한 연기취">강한 연기취</option>
              <option value="부패취">부패취</option>
              <option value="화학취">화학취</option>
            </select>
          </label>

          <label>
            이물질
            <select id="foreignMatter">
              <option value="없음">없음</option>
              <option value="소량">소량</option>
              <option value="많음">많음</option>
            </select>
          </label>

          <label>
            중금속 외부검사
            <select id="heavyMetalTest">
              <option value="검사 완료 / 적합">검사 완료 / 적합</option>
              <option value="검사 완료 / 부적합">검사 완료 / 부적합</option>
              <option value="미검사">미검사</option>
            </select>
          </label>

          <label>
            최종 판정
            <select id="finalStatus">
              <option value="혼합 사용 가능">혼합 사용 가능</option>
              <option value="조건부 사용">조건부 사용</option>
              <option value="내부 시험용 가능 / 판매 전 검사 필요">내부 시험용 가능 / 판매 전 검사 필요</option>
              <option value="사용 보류">사용 보류</option>
              <option value="사용 금지">사용 금지</option>
            </select>
          </label>

          <label class="wide">
            종합 의견
            <textarea id="comment">현재 입력값 기준으로 후배지 펠릿비료 혼합용 SMS biochar로 사용할 수 있습니다. 단, 공식 판매 전에는 중금속 등 외부 시험성적서와 관련 공정규격 검토가 필요합니다.</textarea>
          </label>
        </div>

        <div class="button-row">
          <button id="generateButton">기록서 생성</button>
          <button id="copyButton">Markdown 복사</button>
          <button id="downloadButton">.md 파일 다운로드</button>
        </div>
      </section>

      <section class="card preview-card">
        <h2>생성 결과 미리보기</h2>
        <pre id="preview"></pre>
      </section>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: biochar-lot-generator/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1280px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 900;
}

h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.2;
}

.description {
  max-width: 960px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4c5748;
}

.grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 24px;
  align-items: start;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

label.wide {
  grid-column: 1 / -1;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
  font-family: inherit;
}

textarea {
  min-height: 110px;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  background: #5f7f45;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.preview-card {
  position: sticky;
  top: 24px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: #1f2a1f;
  color: #f4f6f0;
  border-radius: 16px;
  padding: 20px;
  min-height: 760px;
  max-height: 84vh;
  overflow: auto;
  font-size: 13px;
  line-height: 1.55;
}

@media (max-width: 980px) {
  .grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .preview-card {
    position: static;
  }
}

```

---
## FILE: biochar-lots/FT-BIO-20260429-001.md
```

```

---
## FILE: biochar-quality-dashboard/app.js
```
const STORAGE_KEY = "farmerstree-biochar-quality-records";

const inputs = {
  biocharLotId: document.getElementById("biocharLotId"),
  sourceBatchId: document.getElementById("sourceBatchId"),
  inspectionDate: document.getElementById("inspectionDate"),
  pyrolysisTemp: document.getElementById("pyrolysisTemp"),
  pyrolysisMinutes: document.getElementById("pyrolysisMinutes"),
  charYield: document.getElementById("charYield"),
  moisture: document.getElementById("moisture"),
  ph: document.getElementById("ph"),
  ec: document.getElementById("ec"),
  ash: document.getElementById("ash"),
  fixedCarbon: document.getElementById("fixedCarbon"),
  particleSize: document.getElementById("particleSize"),
  odor: document.getElementById("odor"),
  foreignMatter: document.getElementById("foreignMatter"),
  heavyMetalTest: document.getElementById("heavyMetalTest"),
  useCase: document.getElementById("useCase"),
};

const outputs = {
  finalStatus: document.getElementById("finalStatus"),
  reasonList: document.getElementById("reasonList"),
  recordsTable: document.getElementById("recordsTable"),
};

const evaluateButton = document.getElementById("evaluateButton");
const saveButton = document.getElementById("saveButton");
const exportCsvButton = document.getElementById("exportCsvButton");
const clearButton = document.getElementById("clearButton");

let currentEvaluation = null;
let records = loadRecords();

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

inputs.inspectionDate.value = todayString();

function toNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function labelHeavyMetal(value) {
  const labels = {
    done_pass: "검사 완료 / 적합",
    done_fail: "검사 완료 / 부적합",
    not_done: "미검사",
  };
  return labels[value] || value;
}

function labelUseCase(value) {
  const labels = {
    blend: "후배지 펠릿비료 혼합",
    soil: "토양개량재 단독 사용",
    trial: "시험포 실증용",
    hold: "보류 / 연구용",
  };
  return labels[value] || value;
}

function loadRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveRecordsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getInputData() {
  return {
    id: Date.now(),
    biocharLotId: inputs.biocharLotId.value.trim() || "미지정",
    sourceBatchId: inputs.sourceBatchId.value.trim() || "미지정",
    inspectionDate: inputs.inspectionDate.value || todayString(),
    pyrolysisTemp: toNumber(inputs.pyrolysisTemp),
    pyrolysisMinutes: toNumber(inputs.pyrolysisMinutes),
    charYield: toNumber(inputs.charYield),
    moisture: toNumber(inputs.moisture),
    ph: toNumber(inputs.ph),
    ec: toNumber(inputs.ec),
    ash: toNumber(inputs.ash),
    fixedCarbon: toNumber(inputs.fixedCarbon),
    particleSize: toNumber(inputs.particleSize),
    odor: inputs.odor.value,
    foreignMatter: inputs.foreignMatter.value,
    heavyMetalTest: inputs.heavyMetalTest.value,
    useCase: inputs.useCase.value,
  };
}

function evaluateBiochar(data) {
  const reasons = [];
  let dangerCount = 0;
  let warnCount = 0;

  function add(level, text) {
    reasons.push({ level, text });
    if (level === "danger") dangerCount += 1;
    if (level === "warn") warnCount += 1;
  }

  if (data.pyrolysisTemp < 400) {
    add("danger", `탄화 온도 ${data.pyrolysisTemp}℃: 탄화 부족 가능성이 큽니다. biochar 품질이 불안정할 수 있습니다.`);
  } else if (data.pyrolysisTemp < 450) {
    add("warn", `탄화 온도 ${data.pyrolysisTemp}℃: 권장 범위보다 낮습니다. 휘발성 잔류물 여부를 확인하세요.`);
  } else if (data.pyrolysisTemp <= 550) {
    add("good", `탄화 온도 ${data.pyrolysisTemp}℃: 중온 탄화 권장 범위입니다.`);
  } else if (data.pyrolysisTemp <= 650) {
    add("warn", `탄화 온도 ${data.pyrolysisTemp}℃: 다소 높습니다. pH 상승과 회분 증가 가능성을 확인하세요.`);
  } else {
    add("danger", `탄화 온도 ${data.pyrolysisTemp}℃: 과도한 고온입니다. 제품 pH, 회분, 영양성분 손실 가능성이 큽니다.`);
  }

  if (data.moisture > 15) {
    add("danger", `수분 ${data.moisture}%: 보관 중 곰팡이·품질저하 위험이 큽니다. 재건조가 필요합니다.`);
  } else if (data.moisture > 10) {
    add("warn", `수분 ${data.moisture}%: 보관성 주의 구간입니다. 장기 보관 전 재건조를 검토하세요.`);
  } else {
    add("good", `수분 ${data.moisture}%: 보관성 기준으로 양호합니다.`);
  }

  if (data.ph < 5.5) {
    add("warn", `pH ${data.ph}: 산성에 가깝습니다. 혼합 비율과 사용 작물을 확인하세요.`);
  } else if (data.ph > 10.5) {
    add("danger", `pH ${data.ph}: 과도한 알칼리성입니다. 민감작물 피해 가능성이 있어 사용 제한이 필요합니다.`);
  } else if (data.ph > 9.5) {
    add("warn", `pH ${data.ph}: 알칼리성이 높은 편입니다. 산성 토양 외에는 혼합비를 낮추세요.`);
  } else {
    add("good", `pH ${data.ph}: 사용 가능 범위입니다.`);
  }

  if (data.ec > 5.0) {
    add("danger", `EC ${data.ec}: 염류장해 위험이 큽니다. 민감작물용 제품에는 사용 제한이 필요합니다.`);
  } else if (data.ec > 4.0) {
    add("warn", `EC ${data.ec}: 높은 편입니다. 저염 제품에는 부적합할 수 있습니다.`);
  } else {
    add("good", `EC ${data.ec}: 현재 기준상 사용 가능합니다.`);
  }

  if (data.ash > 40) {
    add("warn", `회분 ${data.ash}%: 무기물·염류 비중이 높은 편입니다. EC와 중금속 검사를 확인하세요.`);
  } else {
    add("good", `회분 ${data.ash}%: 내부 기준상 관리 가능 범위입니다.`);
  }

  if (data.fixedCarbon < 30) {
    add("warn", `고정탄소 ${data.fixedCarbon}%: 탄소저장형 제품으로는 낮은 편입니다.`);
  } else if (data.fixedCarbon >= 50) {
    add("good", `고정탄소 ${data.fixedCarbon}%: 탄소저장형 제품 포지션에 유리합니다.`);
  } else {
    add("good", `고정탄소 ${data.fixedCarbon}%: 사용 가능 범위입니다.`);
  }

  if (data.particleSize > 10) {
    add("warn", `입도 ${data.particleSize}mm: 펠릿 혼합 전 분쇄가 필요할 수 있습니다.`);
  } else {
    add("good", `입도 ${data.particleSize}mm: 혼합·펠릿화에 사용 가능한 범위입니다.`);
  }

  if (data.odor === "rot") {
    add("danger", "부패취 확인: 원료 또는 탄화 전 보관 불량 가능성이 있습니다. 제품 혼합 사용을 금지하세요.");
  } else if (data.odor === "chemical") {
    add("danger", "화학취 확인: 오염 가능성이 있습니다. 사용 보류 및 외부 검사 필요.");
  } else if (data.odor === "smoke") {
    add("warn", "강한 연기취 확인: 후처리·숙성·환기 후 재검사하세요.");
  } else {
    add("good", "냄새 상태: 정상 탄화취 범위입니다.");
  }

  if (data.foreignMatter === "major") {
    add("danger", "이물질 많음: 선별 불량입니다. 재선별 전 사용 금지.");
  } else if (data.foreignMatter === "minor") {
    add("warn", "이물질 소량: 재선별 권장.");
  } else {
    add("good", "이물질 없음.");
  }

  if (data.heavyMetalTest === "done_fail") {
    add("danger", "중금속 외부검사 부적합: 제품 사용 및 판매 금지.");
  } else if (data.heavyMetalTest === "not_done") {
    add("warn", "중금속 외부검사 미실시: 내부 시험용은 가능하나 공식 판매 전 검사가 필요합니다.");
  } else {
    add("good", "중금속 외부검사 적합.");
  }

  let status = {
    level: "good",
    title: "혼합 사용 가능",
    detail: "현재 입력값 기준으로 후배지 펠릿비료 혼합에 사용할 수 있습니다.",
  };

  if (dangerCount > 0) {
    status = {
      level: "danger",
      title: "사용 보류",
      detail: "위험 항목이 있습니다. 재건조, 재선별, 외부검사 또는 사용 제한이 필요합니다.",
    };
  } else if (warnCount > 0) {
    status = {
      level: "warn",
      title: "조건부 사용",
      detail: "주의 항목이 있습니다. 혼합비를 낮추거나 시험포에서 먼저 확인하세요.",
    };
  }

  if (data.heavyMetalTest === "not_done" && status.level !== "danger") {
    status = {
      level: "warn",
      title: "내부 시험용 가능 / 판매 전 검사 필요",
      detail: "중금속 외부검사 전에는 공식 판매용 제품에 사용하는 것을 보류하세요.",
    };
  }

  return {
    ...data,
    status,
    reasons,
  };
}

function renderEvaluation(evaluation) {
  const levelIcon = { good: "✓", warn: "!", danger: "✕", neutral: "–" };
  const icon = levelIcon[evaluation.status.level] || "–";

  outputs.finalStatus.className = `status ${evaluation.status.level}`;
  outputs.finalStatus.innerHTML = `
    <span class="status-badge">${icon} ${evaluation.status.title}</span>
    <p class="status-detail">${evaluation.status.detail}</p>
  `;

  outputs.reasonList.innerHTML = "";

  evaluation.reasons.forEach((reason) => {
    const item = document.createElement("div");
    item.className = `reason ${reason.level}`;
    item.textContent = reason.text;
    outputs.reasonList.appendChild(item);
  });
}

function evaluateCurrent() {
  const data = getInputData();
  currentEvaluation = evaluateBiochar(data);
  renderEvaluation(currentEvaluation);
}

function saveCurrent() {
  if (!currentEvaluation) {
    evaluateCurrent();
  }

  records.push(currentEvaluation);
  saveRecordsToStorage();
  renderRecords();
}

function clearRecords() {
  const ok = window.confirm("전체 SMS biochar 품질검사 기록을 삭제할까요?");
  if (!ok) return;

  records = [];
  saveRecordsToStorage();
  renderRecords();
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportRecordsToCsv() {
  if (records.length === 0) {
    window.alert("내보낼 SMS biochar 품질검사 기록이 없습니다.");
    return;
  }

  const headers = [
    "검사일",
    "Biochar로트번호",
    "원료후배지제조번호",
    "탄화온도",
    "탄화시간",
    "탄화수율",
    "수분",
    "pH",
    "EC",
    "회분",
    "고정탄소",
    "입도",
    "냄새",
    "이물질",
    "중금속검사",
    "사용목적",
    "최종판정",
    "판정상세"
  ];

  const rows = records.map((record) => [
    record.inspectionDate,
    record.biocharLotId,
    record.sourceBatchId,
    record.pyrolysisTemp,
    record.pyrolysisMinutes,
    record.charYield,
    record.moisture,
    record.ph,
    record.ec,
    record.ash,
    record.fixedCarbon,
    record.particleSize,
    record.odor,
    record.foreignMatter,
    labelHeavyMetal(record.heavyMetalTest),
    labelUseCase(record.useCase),
    record.status.title,
    record.status.detail
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `farmerstree-biochar-quality-records-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderRecords() {
  outputs.recordsTable.innerHTML = "";

  records
    .slice()
    .sort((a, b) => String(b.inspectionDate).localeCompare(String(a.inspectionDate)))
    .forEach((record) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${record.inspectionDate}</td>
        <td>${record.biocharLotId}</td>
        <td>${record.sourceBatchId}</td>
        <td>${record.pyrolysisTemp}℃</td>
        <td>${record.moisture}%</td>
        <td>${record.ph}</td>
        <td>${record.ec}</td>
        <td>${record.fixedCarbon}%</td>
        <td>${labelHeavyMetal(record.heavyMetalTest)}</td>
        <td><span class="badge ${record.status.level}">${record.status.title}</span></td>
      `;

      outputs.recordsTable.appendChild(row);
    });
}

evaluateButton.addEventListener("click", evaluateCurrent);
saveButton.addEventListener("click", saveCurrent);
exportCsvButton.addEventListener("click", exportRecordsToCsv);
clearButton.addEventListener("click", clearRecords);

evaluateCurrent();
renderRecords();

```

---
## FILE: biochar-quality-dashboard/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree SMS Biochar 품질검사 대시보드</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>SMS Biochar 품질검사 대시보드</h1>
      <p class="description">
        버섯 후배지 유래 SMS biochar의 로트번호, 탄화 조건, 수분, pH, EC, 회분,
        고정탄소, 입도, 냄새, 중금속 검사 여부를 기록하고 제품 사용 가능성을 판정합니다.
      </p>
    </section>

    <section class="card form-card">
      <h2>Biochar 품질검사 입력</h2>

      <div class="form-grid">
        <label>
          Biochar 로트번호
          <input id="biocharLotId" type="text" value="FT-BIO-20260429-001" />
        </label>

        <label>
          원료 후배지 제조번호
          <input id="sourceBatchId" type="text" value="FT-FERT-20260429-001" />
        </label>

        <label>
          검사일
          <input id="inspectionDate" type="date" />
        </label>

        <label>
          탄화 온도 ℃
          <input id="pyrolysisTemp" type="number" value="500" step="1" />
        </label>

        <label>
          탄화 시간 분
          <input id="pyrolysisMinutes" type="number" value="90" step="1" />
        </label>

        <label>
          탄화 수율 %
          <input id="charYield" type="number" value="35" step="0.1" />
        </label>

        <label>
          수분 %
          <input id="moisture" type="number" value="8" step="0.1" />
        </label>

        <label>
          pH
          <input id="ph" type="number" value="8.5" step="0.1" />
        </label>

        <label>
          EC
          <input id="ec" type="number" value="2.5" step="0.1" />
        </label>

        <label>
          회분 %
          <input id="ash" type="number" value="18" step="0.1" />
        </label>

        <label>
          고정탄소 %
          <input id="fixedCarbon" type="number" value="55" step="0.1" />
        </label>

        <label>
          입도 mm
          <input id="particleSize" type="number" value="3" step="0.1" />
        </label>

        <label>
          냄새 상태
          <select id="odor">
            <option value="normal">정상 / 탄화취</option>
            <option value="smoke">강한 연기취</option>
            <option value="rot">부패취</option>
            <option value="chemical">화학취</option>
          </select>
        </label>

        <label>
          이물질
          <select id="foreignMatter">
            <option value="none">없음</option>
            <option value="minor">소량</option>
            <option value="major">많음</option>
          </select>
        </label>

        <label>
          중금속 외부검사
          <select id="heavyMetalTest">
            <option value="done_pass">검사 완료 / 적합</option>
            <option value="done_fail">검사 완료 / 부적합</option>
            <option value="not_done">미검사</option>
          </select>
        </label>

        <label>
          사용 목적
          <select id="useCase">
            <option value="blend">후배지 펠릿비료 혼합</option>
            <option value="soil">토양개량재 단독 사용</option>
            <option value="trial">시험포 실증용</option>
            <option value="hold">보류 / 연구용</option>
          </select>
        </label>
      </div>

      <div class="button-row">
        <button id="evaluateButton">품질 판정</button>
        <button id="saveButton">기록 저장</button>
        <button id="exportCsvButton">CSV 내보내기</button>
        <button id="clearButton" class="danger">전체 기록 삭제</button>
      </div>
    </section>

    <section class="grid">
      <section class="card result-card">
        <h2>최종 판정</h2>
        <div id="finalStatus" class="status neutral">
          <span class="status-badge">– 대기 중</span>
          <p class="status-detail">검사값을 입력하고 품질 판정을 누르세요.</p>
        </div>
        <div id="reasonList" class="reason-list"></div>
      </section>

      <section class="card">
        <h2>내부 기준</h2>

        <table class="small-table">
          <tbody>
            <tr>
              <th>탄화 온도</th>
              <td>450~550℃ 권장</td>
            </tr>
            <tr>
              <th>수분</th>
              <td>10% 이하 보관성 양호, 15% 초과 재건조</td>
            </tr>
            <tr>
              <th>pH</th>
              <td>6~10 사용 가능, 과도한 알칼리성 주의</td>
            </tr>
            <tr>
              <th>EC</th>
              <td>4.0 초과 시 민감작물 주의, 5.0 초과 사용 제한</td>
            </tr>
            <tr>
              <th>고정탄소</th>
              <td>높을수록 탄소저장형 제품에 유리</td>
            </tr>
            <tr>
              <th>중금속</th>
              <td>공식 판매 전 외부검사 필요</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>

    <section class="card">
      <h2>Biochar 품질검사 기록</h2>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>검사일</th>
              <th>로트번호</th>
              <th>원료 제조번호</th>
              <th>탄화온도</th>
              <th>수분</th>
              <th>pH</th>
              <th>EC</th>
              <th>고정탄소</th>
              <th>중금속</th>
              <th>판정</th>
            </tr>
          </thead>
          <tbody id="recordsTable"></tbody>
        </table>
      </div>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: biochar-quality-dashboard/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1220px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.description {
  max-width: 920px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4c5748;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 24px;
}

h2 {
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 800;
  color: #1f2a1f;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

input,
select {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 10px;
  padding: 10px 13px;
  font-size: 14px;
  background: #fbfcfa;
  color: #1f2a1f;
}

input:focus,
select:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #5f7f45;
  color: white;
  letter-spacing: 0.01em;
}

button:hover {
  opacity: 0.9;
}

button.danger {
  background: #8a3d31;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

/* ── 최종 판정 박스 ── */
.status {
  padding: 16px 18px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
  padding: 4px 12px;
  border-radius: 999px;
  width: fit-content;
}

.status-title {
  font-size: 17px;
  font-weight: 800;
  line-height: 1.4;
  margin: 0;
}

.status-detail {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.65;
  margin: 0;
  opacity: 0.85;
}

.status.good {
  background: #eaf5e2;
  color: #2a5420;
}
.status.good .status-badge {
  background: rgba(47, 94, 32, 0.14);
  color: #2a5420;
}

.status.warn {
  background: #fff8e1;
  color: #6a4e00;
}
.status.warn .status-badge {
  background: rgba(115, 84, 0, 0.14);
  color: #6a4e00;
}

.status.danger {
  background: #ffeae4;
  color: #7b2b1d;
}
.status.danger .status-badge {
  background: rgba(123, 43, 29, 0.14);
  color: #7b2b1d;
}

.status.neutral {
  background: #edf0f3;
  color: #3f4a54;
}
.status.neutral .status-badge {
  background: rgba(63, 74, 84, 0.12);
  color: #3f4a54;
}

/* ── 이유 목록 ── */
.reason-list {
  margin-top: 16px;
  display: grid;
  gap: 8px;
}

.reason,
.reason-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 13px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.6;
  font-weight: 600;
}

.reason::before,
.reason-item::before {
  content: '';
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 6px;
}

.reason.good,
.reason-item.good {
  background: #eef7e7;
  color: #355928;
}
.reason.good::before,
.reason-item.good::before {
  background: #4e8c35;
}

.reason.warn,
.reason-item.warn {
  background: #fffbec;
  color: #6a4e00;
}
.reason.warn::before,
.reason-item.warn::before {
  background: #c49000;
}

.reason.danger,
.reason-item.danger {
  background: #fff0ed;
  color: #7b2b1d;
}
.reason.danger::before,
.reason-item.danger::before {
  background: #c04030;
}

.small-table,
table {
  width: 100%;
  border-collapse: collapse;
}

.small-table th,
.small-table td,
th,
td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #edf0e8;
  vertical-align: top;
  font-size: 14px;
}

.small-table th,
thead th {
  background: #edf4e5;
  color: #2f4428;
  font-weight: 900;
}

.table-wrap {
  overflow-x: auto;
}

.table-wrap table {
  min-width: 980px;
}

.badge {
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.badge.good {
  background: #e4f3da;
  color: #2f5e20;
}

.badge.warn {
  background: #fff3cf;
  color: #735400;
}

.badge.danger {
  background: #ffe0d8;
  color: #7b2b1d;
}

@media (max-width: 940px) {
  .form-grid,
  .grid {
    grid-template-columns: 1fr;
  }
}

```

---
## FILE: calculator/app.js
```
const inputs = {
	bags: document.getElementById("bags"),
	rawCost: document.getElementById("rawCost"),
	saltCost: document.getElementById("saltCost"),
	cnCost: document.getElementById("cnCost"),
	microbeCost: document.getElementById("microbeCost"),
	compostCost: document.getElementById("compostCost"),
	pelletCost: document.getElementById("pelletCost"),
	packagingCost: document.getElementById("packagingCost"),
	qcCost: document.getElementById("qcCost"),
	laborCost: document.getElementById("laborCost"),
	salePrice: document.getElementById("salePrice"),
	subsidy: document.getElementById("subsidy"),
};

const outputs = {
	unitCost: document.getElementById("unitCost"),
	totalCost: document.getElementById("totalCost"),
	totalRevenue: document.getElementById("totalRevenue"),
	farmerPrice: document.getElementById("farmerPrice"),
	profit: document.getElementById("profit"),
	marginRate: document.getElementById("marginRate"),
	breakEvenPrice: document.getElementById("breakEvenPrice"),
	businessMessage: document.getElementById("businessMessage"),
};

function toNumber(input) {
	const value = Number(input.value);
	return Number.isFinite(value) ? value : 0;
}

function formatWon(value) {
	return Math.round(value).toLocaleString("ko-KR") + "원";
}

function calculate() {
	const bags = Math.max(toNumber(inputs.bags), 0);

	const unitCost =
		toNumber(inputs.rawCost) +
		toNumber(inputs.saltCost) +
		toNumber(inputs.cnCost) +
		toNumber(inputs.microbeCost) +
		toNumber(inputs.compostCost) +
		toNumber(inputs.pelletCost) +
		toNumber(inputs.packagingCost) +
		toNumber(inputs.qcCost) +
		toNumber(inputs.laborCost);

	const salePrice = toNumber(inputs.salePrice);
	const subsidy = toNumber(inputs.subsidy);

	const totalCost = unitCost * bags;
	const totalRevenue = salePrice * bags;
	const profit = totalRevenue - totalCost;
	const marginRate = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
	const farmerPrice = Math.max(salePrice - subsidy, 0);
	const breakEvenPrice = unitCost;

	outputs.unitCost.textContent = formatWon(unitCost);
	outputs.totalCost.textContent = formatWon(totalCost);
	outputs.totalRevenue.textContent = formatWon(totalRevenue);
	outputs.farmerPrice.textContent = formatWon(farmerPrice);
	outputs.profit.textContent = formatWon(profit);
	outputs.marginRate.textContent = marginRate.toFixed(1) + "%";
	outputs.breakEvenPrice.textContent = formatWon(breakEvenPrice);

	outputs.businessMessage.textContent = getBusinessMessage({
		unitCost,
		salePrice,
		subsidy,
		farmerPrice,
		profit,
		marginRate,
	});
}

function getBusinessMessage({
	unitCost,
	salePrice,
	subsidy,
	farmerPrice,
	profit,
	marginRate,
}) {
	if (profit < 0) {
		return `현재 조건은 적자 구조입니다. 포대당 제조원가가 ${formatWon(unitCost)}인데 판매가가 ${formatWon(salePrice)}이므로 판매가 인상, 첨가물비 절감, 펠릿화비 절감이 필요합니다.`;
	}

	if (marginRate < 20) {
		return `마진율이 ${marginRate.toFixed(1)}%로 낮습니다. 보조금 ${formatWon(subsidy)} 적용 후 농가 체감가는 ${formatWon(farmerPrice)}입니다. 최소 25~30% 마진을 목표로 판매가 또는 원가를 조정해야 합니다.`;
	}

	if (marginRate < 35) {
		return `현실적인 사업 가능 구간입니다. 보조금 적용 후 농가 체감가 ${formatWon(farmerPrice)}, 마진율 ${marginRate.toFixed(1)}%입니다. 초기 농가 공급용 가격으로 검토할 수 있습니다.`;
	}

	return `양호한 수익 구조입니다. 보조금 적용 후 농가 체감가 ${formatWon(farmerPrice)}, 마진율 ${marginRate.toFixed(1)}%입니다. 기능성 펠릿비료로 브랜딩하면 사업성이 있습니다.`;
}

Object.values(inputs).forEach((input) => {
	input.addEventListener("input", calculate);
});

calculate();

```

---
## FILE: calculator/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 후배지 펠릿비료 수익성 계산기</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>후배지 펠릿비료 수익성 계산기</h1>
      <p class="description">
        후배지 원료관리, 염류관리, C/N 보정, 고온부숙, 후숙, 기능성 미생물,
        펠릿화, 품질검사 비용을 반영하여 20kg 포대 기준 원가와 수익성을 계산합니다.
      </p>
    </section>

    <section class="grid">
      <div class="card input-card">
        <h2>입력값</h2>

        <label>
          생산량 / 20kg 포대
          <input id="bags" type="number" value="1000" min="1" />
        </label>

        <label>
          후배지 원료·운송비 / 포대
          <input id="rawCost" type="number" value="1000" min="0" />
        </label>

        <label>
          염류관리·수분조정비 / 포대
          <input id="saltCost" type="number" value="500" min="0" />
        </label>

        <label>
          C/N 보정 첨가물비 / 포대
          <input id="cnCost" type="number" value="2000" min="0" />
        </label>

        <label>
          기능성 미생물비 / 포대
          <input id="microbeCost" type="number" value="1000" min="0" />
        </label>

        <label>
          고온부숙·후숙 관리비 / 포대
          <input id="compostCost" type="number" value="1200" min="0" />
        </label>

        <label>
          건조·펠릿화비 / 포대
          <input id="pelletCost" type="number" value="2000" min="0" />
        </label>

        <label>
          포장비 / 포대
          <input id="packagingCost" type="number" value="600" min="0" />
        </label>

        <label>
          품질검사·불량률 비용 / 포대
          <input id="qcCost" type="number" value="600" min="0" />
        </label>

        <label>
          인건비·장비감가상각 / 포대
          <input id="laborCost" type="number" value="1000" min="0" />
        </label>

        <label>
          판매가 / 포대
          <input id="salePrice" type="number" value="15000" min="0" />
        </label>

        <label>
          보조금 / 포대
          <input id="subsidy" type="number" value="1600" min="0" />
        </label>
      </div>

      <div class="card result-card">
        <h2>계산 결과</h2>

        <div class="result-row">
          <span>포대당 제조원가</span>
          <strong id="unitCost">0원</strong>
        </div>

        <div class="result-row">
          <span>총 생산비</span>
          <strong id="totalCost">0원</strong>
        </div>

        <div class="result-row">
          <span>총 예상 매출</span>
          <strong id="totalRevenue">0원</strong>
        </div>

        <div class="result-row">
          <span>농가 체감가</span>
          <strong id="farmerPrice">0원</strong>
        </div>

        <div class="highlight">
          <span>예상 순이익</span>
          <strong id="profit">0원</strong>
        </div>

        <div class="highlight secondary">
          <span>마진율</span>
          <strong id="marginRate">0%</strong>
        </div>

        <div class="result-row">
          <span>손익분기 판매가</span>
          <strong id="breakEvenPrice">0원</strong>
        </div>

        <div class="message" id="businessMessage">
          계산 결과가 여기에 표시됩니다.
        </div>
      </div>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: calculator/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f3f5ef;
  color: #1f2a1f;
}

.container {
  width: min(1180px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 32px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5b6f43;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.description {
  max-width: 820px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4a5548;
}

.grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: start;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
}

.card h2 {
  margin: 0 0 22px;
  font-size: 24px;
}

.input-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.input-card h2 {
  grid-column: 1 / -1;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #344231;
}

input {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
}

input:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

.result-card {
  position: sticky;
  top: 24px;
}

.result-row,
.highlight {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #edf0e8;
}

.result-row span,
.highlight span {
  color: #566252;
  font-weight: 600;
}

.result-row strong {
  font-size: 20px;
}

.highlight {
  margin-top: 16px;
  padding: 20px;
  border-radius: 16px;
  border: none;
  background: #e8f1dd;
}

.highlight strong {
  font-size: 28px;
  color: #213b18;
}

.highlight.secondary {
  background: #eef3f8;
}

.message {
  margin-top: 24px;
  padding: 18px;
  border-radius: 14px;
  background: #faf8ed;
  color: #574d2f;
  line-height: 1.6;
  font-weight: 600;
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .input-card {
    grid-template-columns: 1fr;
  }

  .result-card {
    position: static;
  }
}

```

---
## FILE: carbon-report/app.js
```
const inputs = {
  period: document.getElementById("period"),
  recycledSms: document.getElementById("recycledSms"),
  biocharProduced: document.getElementById("biocharProduced"),
  soilApplied: document.getElementById("soilApplied"),
  carbonStored: document.getElementById("carbonStored"),
  fertReduction: document.getElementById("fertReduction"),
  region: document.getElementById("region"),
  crop: document.getElementById("crop"),
};

const outputs = {
  outRecycled: document.getElementById("outRecycled"),
  outBiochar: document.getElementById("outBiochar"),
  outSoilApplied: document.getElementById("outSoilApplied"),
  outCarbonStored: document.getElementById("outCarbonStored"),
  outFertReduction: document.getElementById("outFertReduction"),
  esgText: document.getElementById("esgText"),
  publicText: document.getElementById("publicText"),
};

const generateBtn = document.getElementById("generateBtn");
const copyEsgBtn = document.getElementById("copyEsgBtn");
const copyPublicBtn = document.getElementById("copyPublicBtn");

function n(el) {
  const v = Number(el.value);
  return Number.isFinite(v) ? v : 0;
}

function fmtKg(v) {
  return `${Math.round(v).toLocaleString("ko-KR")}kg`;
}

function generate() {
  const period = inputs.period.value.trim() || "기준 기간";
  const recycledSms = n(inputs.recycledSms);
  const biocharProduced = n(inputs.biocharProduced);
  const soilApplied = n(inputs.soilApplied);
  const carbonStored = n(inputs.carbonStored);
  const fertReduction = n(inputs.fertReduction);
  const region = inputs.region.value.trim() || "적용 권역";
  const crop = inputs.crop.value.trim() || "적용 작물";

  outputs.outRecycled.textContent = fmtKg(recycledSms);
  outputs.outBiochar.textContent = fmtKg(biocharProduced);
  outputs.outSoilApplied.textContent = fmtKg(soilApplied);
  outputs.outCarbonStored.textContent = `${Math.round(carbonStored).toLocaleString("ko-KR")}kgCO2e`;
  outputs.outFertReduction.textContent = `${fertReduction.toFixed(1)}%`;

  outputs.esgText.value =
    `${period} 기준 Farmerstree는 버섯 후배지 ${fmtKg(recycledSms)}을(를) 재자원화하여 ` +
    `SMS biochar ${fmtKg(biocharProduced)}을(를) 생산하였고, 이 중 ${fmtKg(soilApplied)}을(를) 토양에 적용했습니다. ` +
    `그 결과 탄소저장 효과는 약 ${Math.round(carbonStored).toLocaleString("ko-KR")}kgCO2e로 추정되며, ` +
    `화학비료 사용량은 평균 ${fertReduction.toFixed(1)}% 절감되었습니다. ` +
    `당사는 후배지 자원순환-토양복원-탄소저감이 결합된 순환농업 모델을 통해 환경성과와 농업 생산성 개선을 동시에 달성하고 있습니다.`;

  outputs.publicText.value =
    `${region}을 대상으로 ${crop} 재배지에 SMS biochar 기반 탄소형 복합비료를 적용하는 실증·확산 사업을 제안합니다. ` +
    `본 모델은 후배지 ${fmtKg(recycledSms)} 재자원화, biochar ${fmtKg(biocharProduced)} 생산, ` +
    `토양 투입 ${fmtKg(soilApplied)}을 통해 약 ${Math.round(carbonStored).toLocaleString("ko-KR")}kgCO2e의 탄소저장 잠재력을 제시합니다. ` +
    `또한 화학비료 사용량을 ${fertReduction.toFixed(1)}% 절감하여 농가 경영비 부담을 낮추고, 토양 유기탄소 증진·수분보유력 개선·염류 스트레스 완화 등 ` +
    `지역 단위 지속가능 농업 전환 성과를 창출할 수 있습니다.`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    window.alert("클립보드에 복사했습니다.");
  } catch {
    window.alert("브라우저 권한으로 복사에 실패했습니다. 텍스트를 직접 복사해 주세요.");
  }
}

generateBtn.addEventListener("click", generate);
copyEsgBtn.addEventListener("click", () => copyText(outputs.esgText.value));
copyPublicBtn.addEventListener("click", () => copyText(outputs.publicText.value));

generate();

```

---
## FILE: carbon-report/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 탄소형 성과 리포트 생성기</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>탄소형 제품 성과 리포트</h1>
      <p class="description">
        후배지 재자원화량, biochar 생산량, 토양 투입량, 탄소저장 추정량을 기반으로
        ESG 보고서 문장과 공공사업 제안 문장을 생성합니다.
      </p>
    </section>

    <section class="grid">
      <section class="card">
        <h2>입력값</h2>
        <div class="form-grid">
          <label>보고 기준 기간<input id="period" type="text" value="2026년 2분기" /></label>
          <label>후배지 재자원화량 kg<input id="recycledSms" type="number" value="12000" step="1" /></label>
          <label>Biochar 생산량 kg<input id="biocharProduced" type="number" value="1800" step="1" /></label>
          <label>토양 투입량 kg<input id="soilApplied" type="number" value="1500" step="1" /></label>
          <label>탄소저장 추정량 kgCO2e<input id="carbonStored" type="number" value="4125" step="1" /></label>
          <label>화학비료 절감률 %<input id="fertReduction" type="number" value="18" step="0.1" /></label>
          <label>사업 대상 지역<input id="region" type="text" value="충남 스마트팜 권역" /></label>
          <label>적용 작물/재배군<input id="crop" type="text" value="시설채소 및 과수" /></label>
        </div>

        <div class="button-row">
          <button id="generateBtn">문장 생성</button>
          <button id="copyEsgBtn">ESG 문장 복사</button>
          <button id="copyPublicBtn">제안서 문장 복사</button>
        </div>
      </section>

      <section class="card summary-card">
        <h2>핵심 수치 요약</h2>
        <div class="summary-row"><span>후배지 재자원화량</span><strong id="outRecycled">0kg</strong></div>
        <div class="summary-row"><span>Biochar 생산량</span><strong id="outBiochar">0kg</strong></div>
        <div class="summary-row"><span>토양 투입량</span><strong id="outSoilApplied">0kg</strong></div>
        <div class="summary-row"><span>탄소저장 추정량</span><strong id="outCarbonStored">0kgCO2e</strong></div>
        <div class="summary-row"><span>화학비료 절감률</span><strong id="outFertReduction">0%</strong></div>
      </section>
    </section>

    <section class="card">
      <h2>ESG 보고서용 문장</h2>
      <textarea id="esgText" rows="6" readonly></textarea>
    </section>

    <section class="card">
      <h2>공공사업 제안서용 문장</h2>
      <textarea id="publicText" rows="7" readonly></textarea>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: carbon-report/style.css
```
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f6f0; color: #1f2a1f; }
.container { width: min(1200px, 92vw); margin: 0 auto; padding: 48px 0; }
.hero { margin-bottom: 24px; }
.eyebrow { margin: 0 0 8px; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #5d7145; font-weight: 800; }
h1 { margin: 0; font-size: 36px; }
.description { margin-top: 14px; max-width: 920px; line-height: 1.7; color: #4c5748; }
.grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; align-items: start; }
.card { background: #fff; border-radius: 20px; padding: 24px; margin-bottom: 20px; box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08); border: 1px solid rgba(80, 100, 70, 0.12); }
h2 { margin: 0 0 18px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
label { display: flex; flex-direction: column; gap: 7px; font-size: 14px; font-weight: 700; }
input { border: 1px solid #cbd5c4; border-radius: 12px; padding: 10px 12px; font-size: 15px; background: #fbfcfa; }
.button-row { display: flex; gap: 10px; margin-top: 16px; }
button { border: none; border-radius: 12px; padding: 11px 16px; font-size: 15px; font-weight: 800; cursor: pointer; color: #fff; background: #5f7f45; }
.summary-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf0e8; padding: 12px 0; }
.summary-row span { color: #566252; font-weight: 700; }
.summary-row strong { font-size: 20px; }
textarea { width: 100%; border: 1px solid #d5dfcc; border-radius: 14px; padding: 14px; font-size: 15px; line-height: 1.65; background: #fbfcfa; resize: vertical; }
@media (max-width: 920px) {
  .grid, .form-grid { grid-template-columns: 1fr; }
}

```

---
## FILE: dashboard/app.js
```
const inputs = {
  batchId: document.getElementById("batchId"),
  day: document.getElementById("day"),
  morningTemp: document.getElementById("morningTemp"),
  afternoonTemp: document.getElementById("afternoonTemp"),
  odor: document.getElementById("odor"),
  moisture: document.getElementById("moisture"),
  action: document.getElementById("action"),
};

const outputs = {
  recordCount: document.getElementById("recordCount"),
  avgTemp: document.getElementById("avgTemp"),
  maxTemp: document.getElementById("maxTemp"),
  hotDays: document.getElementById("hotDays"),
  mainMessage: document.getElementById("mainMessage"),
  recordsTable: document.getElementById("recordsTable"),
};

const aiReportSummary = document.getElementById("aiReportSummary");
const aiReportDetails = document.getElementById("aiReportDetails");

const addRecordButton = document.getElementById("addRecord");
const clearRecordsButton = document.getElementById("clearRecords");
const exportCsvButton = document.getElementById("exportCsv");

const STORAGE_KEY = "farmerstree-fermentation-records";

let records = loadRecords();

function toNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function loadRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getOdorLabel(value) {
  const labels = {
    normal: "정상",
    ammonia: "암모니아취",
    rot: "부패취",
  };

  return labels[value] || value;
}

function getMoistureLabel(value) {
  const labels = {
    normal: "적정",
    wet: "과습",
    dry: "건조",
  };

  return labels[value] || value;
}

function judgeRecord(record) {
  const avg = record.avgTemp;
  const peak = Math.max(record.morningTemp, record.afternoonTemp);
  const problems = [];
  let level = "good";
  let title = "적정 고온부숙";

  if (peak > 70) {
    level = "danger";
    title = "품질 저하 위험";
    problems.push("70℃ 초과: 즉시 뒤집기, 수분 보정 필요");
  } else if (peak >= 65) {
    level = "warn";
    title = "과열 주의";
    problems.push("65~70℃: 뒤집기 또는 송풍 필요");
  } else if (avg >= 55 && avg <= 65) {
    level = "good";
    title = "적정 고온부숙";
    problems.push("55~65℃: 적정 고온부숙 구간, 유지");
  } else if (avg >= 45 && avg < 55) {
    level = "neutral";
    title = "발효 진행";
    problems.push("45~55℃: 발효 진행 구간, 관찰 유지");
  } else if (avg < 40) {
    level = "warn";
    title = "발효 부족";
    problems.push("40℃ 미만: 수분, 질소원, 통기 조건 재점검 필요");
  } else {
    level = "warn";
    title = "발효 부족";
    problems.push("40~45℃: 저온 구간으로 발효 조건 재점검 권장");
  }

  if (record.odor === "rot") {
    level = "danger";
    problems.push("부패취: 산소 부족 또는 과습 가능성");
  }

  if (record.odor === "ammonia") {
    if (level !== "danger") level = "warn";
    problems.push("암모니아취: 질소 과다 또는 pH 과상승 가능성");
  }

  if (record.moisture === "wet") {
    if (level !== "danger") level = "warn";
    problems.push("과습: 왕겨·바이오차 보강 또는 뒤집기 필요");
  }

  if (record.moisture === "dry") {
    if (level !== "danger") level = "warn";
    problems.push("건조: 수분 보정 필요");
  }

  return {
    level,
    title,
    message: problems.join(" / "),
  };
}

function addRecord() {
  const morningTemp = toNumber(inputs.morningTemp);
  const afternoonTemp = toNumber(inputs.afternoonTemp);
  const avgTemp = (morningTemp + afternoonTemp) / 2;

  const record = {
    id: Date.now(),
    batchId: inputs.batchId.value.trim() || "미지정",
    day: toNumber(inputs.day),
    morningTemp,
    afternoonTemp,
    avgTemp,
    odor: inputs.odor.value,
    moisture: inputs.moisture.value,
    action: inputs.action.value.trim(),
  };

  const judgement = judgeRecord(record);
  record.judgement = judgement;

  records.push(record);
  saveRecords();
  render();

  inputs.day.value = Number(inputs.day.value) + 1;
  inputs.action.value = "";
}

function clearRecords() {
  const ok = window.confirm("전체 발효 온도 기록을 삭제할까요?");
  if (!ok) return;

  records = [];
  saveRecords();
  render();
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportRecordsToCsv() {
  if (records.length === 0) {
    window.alert("내보낼 발효 온도 기록이 없습니다.");
    return;
  }

  const headers = [
    "제조번호",
    "일차",
    "오전온도",
    "오후온도",
    "평균온도",
    "냄새",
    "수분상태",
    "판정",
    "판정내용",
    "조치"
  ];

  const rows = records
    .slice()
    .sort((a, b) => a.day - b.day)
    .map((record) => [
      record.batchId,
      record.day,
      record.morningTemp,
      record.afternoonTemp,
      record.avgTemp.toFixed(1),
      getOdorLabel(record.odor),
      getMoistureLabel(record.moisture),
      record.judgement.title,
      record.judgement.message,
      record.action || ""
    ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `farmerstree-fermentation-records-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function render() {
  renderSummary();
  renderTable();
}

function renderSummary() {
  const count = records.length;

  if (count === 0) {
    outputs.recordCount.textContent = "0건";
    outputs.avgTemp.textContent = "0℃";
    outputs.maxTemp.textContent = "0℃";
    outputs.hotDays.textContent = "0회";
    outputs.mainMessage.textContent = "기록을 추가하면 발효 상태가 표시됩니다.";
    return;
  }

  const allTemps = records.flatMap((record) => [
    record.morningTemp,
    record.afternoonTemp,
  ]);

  const avgTemp = allTemps.reduce((sum, temp) => sum + temp, 0) / allTemps.length;
  const maxTemp = Math.max(...allTemps);
  const hotDays = records.filter((record) => record.avgTemp >= 55).length;

  outputs.recordCount.textContent = `${count}건`;
  outputs.avgTemp.textContent = `${avgTemp.toFixed(1)}℃`;
  outputs.maxTemp.textContent = `${maxTemp.toFixed(1)}℃`;
  outputs.hotDays.textContent = `${hotDays}회`;

  const dangerCount = records.filter((record) => record.judgement.level === "danger").length;
  const warnCount = records.filter((record) => record.judgement.level === "warn").length;

  if (dangerCount > 0) {
    outputs.mainMessage.textContent =
      `위험 기록이 ${dangerCount}건 있습니다. 과열, 부패취, 과습 상태를 우선 확인하고 뒤집기·송풍·수분조정을 수행해야 합니다.`;
  } else if (warnCount > 0) {
    outputs.mainMessage.textContent =
      `주의 기록이 ${warnCount}건 있습니다. 발효 부족, 암모니아취, 수분 불균형 여부를 확인하세요.`;
  } else {
    outputs.mainMessage.textContent =
      "현재 기록상 고온부숙 상태가 양호합니다. 55~65℃ 구간 유지 여부를 계속 기록하세요.";
  }
}

function renderTable() {
  outputs.recordsTable.innerHTML = "";

  records
    .slice()
    .sort((a, b) => a.day - b.day)
    .forEach((record) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${record.batchId}</td>
        <td>${record.day}일차</td>
        <td>${record.morningTemp.toFixed(1)}℃</td>
        <td>${record.afternoonTemp.toFixed(1)}℃</td>
        <td>${record.avgTemp.toFixed(1)}℃</td>
        <td>${getOdorLabel(record.odor)}</td>
        <td>${getMoistureLabel(record.moisture)}</td>
        <td>
          <span class="badge ${record.judgement.level}">
            ${record.judgement.title}
          </span>
          <br />
          ${record.judgement.message}
        </td>
        <td>${record.action || "-"}</td>
      `;

      outputs.recordsTable.appendChild(row);
    });
}

addRecordButton.addEventListener("click", addRecord);
clearRecordsButton.addEventListener("click", clearRecords);
exportCsvButton.addEventListener("click", exportRecordsToCsv);

render();

// Load AI test report (JSON + markdown) from repository root with simple polling
let lastJsonText = null;
let lastMdText = null;
let lastETagJson = null;
let lastModifiedJson = null;
let lastETagMd = null;
let lastModifiedMd = null;

function renderAiJson(data) {
  if (!aiReportSummary) return;
  aiReportSummary.innerHTML = `<strong>${data.report_date}</strong> · SOP ${data.sop_version} · 상태: ${data.status}`;
  const list = document.createElement("ul");
  data.test_results.forEach((r) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${r.category}</strong>: ${r.status} — ${r.description}`;
    list.appendChild(li);
  });
  aiReportSummary.appendChild(list);
}

function renderAiMarkdown(md) {
  if (!aiReportDetails) return;
  if (window.marked) {
    aiReportDetails.innerHTML = marked.parse(md);
  } else {
    aiReportDetails.textContent = md;
  }
}

async function loadAiTestReport() {
  // JSON (conditional request)
  try {
    const headers = {};
    if (lastETagJson) headers['If-None-Match'] = lastETagJson;
    if (lastModifiedJson) headers['If-Modified-Since'] = lastModifiedJson;

    const res = await fetch("../ai-test-report.json", { cache: "no-store", headers });
    if (res.status === 304) {
      // not modified
    } else if (res.ok) {
      const text = await res.text();
      // update caching hints
      const etag = res.headers.get('etag');
      const lastmod = res.headers.get('last-modified');
      if (etag) lastETagJson = etag;
      if (lastmod) lastModifiedJson = lastmod;

      if (text !== lastJsonText) {
        lastJsonText = text;
        try {
          const data = JSON.parse(text);
          renderAiJson(data);
        } catch (e) {
          aiReportSummary.textContent = "AI 리포트(JSON) 파싱 오류.";
        }
      }
    } else {
      aiReportSummary.textContent = "AI 리포트 로드 실패 (JSON).";
    }
  } catch (err) {
    aiReportSummary.textContent = "AI 리포트 로드 실패.";
  }

  // Markdown (conditional request)
  try {
    const headersMd = {};
    if (lastETagMd) headersMd['If-None-Match'] = lastETagMd;
    if (lastModifiedMd) headersMd['If-Modified-Since'] = lastModifiedMd;

    const mdRes = await fetch("../ai-test-report.md", { cache: "no-store", headers: headersMd });
    if (mdRes.status === 304) {
      // not modified
    } else if (mdRes.ok) {
      const md = await mdRes.text();
      const etagMd = mdRes.headers.get('etag');
      const lastmodMd = mdRes.headers.get('last-modified');
      if (etagMd) lastETagMd = etagMd;
      if (lastmodMd) lastModifiedMd = lastmodMd;

      if (md !== lastMdText) {
        lastMdText = md;
        renderAiMarkdown(md);
      }
    } else {
      aiReportDetails.textContent = "AI 리포트(마크다운) 없음.";
    }
  } catch (err) {
    aiReportDetails.textContent = "AI 리포트(마크다운) 로드 실패.";
  }
}

// initial load
loadAiTestReport();

// poll every 15 seconds for updates
setInterval(loadAiTestReport, 15000);

// manual refresh button
const refreshBtn = document.getElementById('refreshAiReport');
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    // clear etags to force full reload on manual refresh
    lastETagJson = null;
    lastModifiedJson = null;
    lastETagMd = null;
    lastModifiedMd = null;
    loadAiTestReport();
  });
}

```

---
## FILE: dashboard/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 발효 온도 기록 대시보드</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>발효 온도 기록 대시보드</h1>
      <p class="description">
        후배지 펠릿비료의 고온부숙 과정에서 오전·오후 온도, 냄새, 수분 상태, 조치 내용을 기록하고
        발효 상태를 자동 판정합니다.
      </p>
    </section>

    <section class="card form-card">
      <h2>오늘 기록 입력</h2>

      <div class="form-grid">
        <label>
          제조번호
          <input id="batchId" type="text" value="FT-FERT-20260429-001" />
        </label>

        <label>
          일차
          <input id="day" type="number" value="1" min="1" />
        </label>

        <label>
          오전 온도 ℃
          <input id="morningTemp" type="number" value="58" />
        </label>

        <label>
          오후 온도 ℃
          <input id="afternoonTemp" type="number" value="62" />
        </label>

        <label>
          냄새 상태
          <select id="odor">
            <option value="normal">정상</option>
            <option value="ammonia">암모니아취</option>
            <option value="rot">부패취</option>
          </select>
        </label>

        <label>
          수분 상태
          <select id="moisture">
            <option value="normal">적정</option>
            <option value="wet">과습</option>
            <option value="dry">건조</option>
          </select>
        </label>

        <label class="wide">
          조치 내용
          <input id="action" type="text" placeholder="예: 뒤집기, 송풍, 수분 보정, 왕겨 추가 등" />
        </label>
      </div>

      <div class="button-row">
        <button id="addRecord">기록 추가</button>
        <button id="exportCsv">CSV 내보내기</button>
        <button id="clearRecords" class="danger">전체 기록 삭제</button>
      </div>
    </section>

    <section class="grid">
      <div class="card">
        <h2>발효 상태 요약</h2>

        <div class="summary-grid">
          <div class="summary-box">
            <span>총 기록 수</span>
            <strong id="recordCount">0건</strong>
          </div>

          <div class="summary-box">
            <span>평균 온도</span>
            <strong id="avgTemp">0℃</strong>
          </div>

          <div class="summary-box">
            <span>최고 온도</span>
            <strong id="maxTemp">0℃</strong>
          </div>

          <div class="summary-box">
            <span>55℃ 이상 유지</span>
            <strong id="hotDays">0회</strong>
          </div>
        </div>

        <div id="mainMessage" class="message">
          기록을 추가하면 발효 상태가 표시됩니다.
        </div>
      </div>

      <div class="card">
        <h2>판정 기준</h2>

        <ul class="rule-list">
          <li><strong>40℃ 미만</strong> 발효 부족. 수분, 질소원, 통기 조건 재점검</li>
          <li><strong>45~55℃</strong> 발효 진행. 관찰 유지</li>
          <li><strong>55~65℃</strong> 적정 고온부숙. 유지</li>
          <li><strong>65~70℃</strong> 과열 주의. 뒤집기 또는 송풍</li>
          <li><strong>70℃ 초과</strong> 품질 저하 위험. 즉시 뒤집기, 수분 보정</li>
          <li><strong>부패취</strong> 산소 부족, 과습, 혐기화 가능성</li>
          <li><strong>암모니아취</strong> 질소 과다, pH 과상승, 통기 부족 가능성</li>
        </ul>
      </div>
    </section>

    <section class="card">
      <h2>온도 기록표</h2>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>제조번호</th>
              <th>일차</th>
              <th>오전</th>
              <th>오후</th>
              <th>평균</th>
              <th>냄새</th>
              <th>수분</th>
              <th>판정</th>
              <th>조치</th>
            </tr>
          </thead>
          <tbody id="recordsTable"></tbody>
        </table>
      </div>
    </section>

    <section class="card" id="aiTestReportCard">
      <h2>AI 테스트 리포트</h2>

      <div style="display:flex;align-items:center;gap:12px;">
        <div id="aiReportSummary">로딩 중...</div>
        <div class="ai-actions">
          <button id="refreshAiReport">새로고침</button>
        </div>
      </div>

      <div id="aiReportDetails" class="markdown-body" style="max-height:320px;overflow:auto;border:1px solid #eee;padding:12px;margin-top:8px;background:#fafafa;">로드 중...</div>
    </section>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: dashboard/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1220px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.description {
  max-width: 900px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4c5748;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 24px;
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

label.wide {
  grid-column: 1 / -1;
}

input,
select {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
}

input:focus,
select:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  background: #5f7f45;
  color: white;
}

button:hover {
  opacity: 0.9;
}

button.danger {
  background: #8a3d31;
}

.grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.summary-box {
  padding: 18px;
  border-radius: 16px;
  background: #eef4e7;
}

.summary-box span {
  display: block;
  font-size: 13px;
  color: #5a6654;
  font-weight: 800;
  margin-bottom: 8px;
}

.summary-box strong {
  font-size: 24px;
}

.message {
  margin-top: 22px;
  padding: 18px;
  border-radius: 14px;
  background: #faf8ed;
  color: #574d2f;
  line-height: 1.65;
  font-weight: 800;
}

.rule-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.9;
  color: #354033;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

th,
td {
  padding: 13px 12px;
  text-align: left;
  border-bottom: 1px solid #edf0e8;
  vertical-align: top;
  font-size: 14px;
}

th {
  background: #edf4e5;
  color: #2f4428;
}

.badge {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.good {
  background: #e4f3da;
  color: #2f5e20;
}

.warn {
  background: #fff3cf;
  color: #735400;
}

.danger {
  background: #ffe0d8;
  color: #7b2b1d;
}

.neutral {
  background: #edf0f3;
  color: #3f4a54;
}

@media (max-width: 940px) {
  .form-grid,
  .grid,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

```

---
## FILE: docs/checks/PLATFORM_CHECK_20260429.md
```
# Farmerstree Fertilizer Platform 전체 점검 기록

## 점검일

2026-04-29

## 점검 대상

- 메인 홈 화면
- 수익성 계산기
- 배합 계산기
- 발효 온도 기록 대시보드
- 품질검사 입력 대시보드
- 제조 배치 기록 자동 생성기
- 품질검사 체크리스트
- 운영 규칙 문서

---

## 1. 파일 구조 점검

| 항목 | 결과 | 메모 |
|---|---|---|
| index.html | 확인 필요 |  |
| calculator | 확인 필요 |  |
| recipe-calculator | 확인 필요 |  |
| dashboard | 확인 필요 |  |
| quality-dashboard | 확인 필요 |  |
| batch-generator | 확인 필요 |  |
| qc 문서 | 확인 필요 |  |
| docs 문서 | 확인 필요 |  |

---

## 2. 기능 점검

| 기능 | 결과 | 메모 |
|---|---|---|
| 홈 화면 열림 | 확인 필요 |  |
| 카드 링크 이동 | 확인 필요 |  |
| 수익성 계산 | 확인 필요 |  |
| 배합 자동 계산 | 확인 필요 |  |
| 발효 온도 기록 추가 | 확인 필요 |  |
| 발효 CSV 내보내기 | 확인 필요 |  |
| 품질검사 판정 | 확인 필요 |  |
| 품질검사 CSV 내보내기 | 확인 필요 |  |
| 배치 기록 Markdown 생성 | 확인 필요 |  |
| Markdown 다운로드 | 확인 필요 |  |

---

## 3. 오류 기록

```text

```

```

---
## FILE: docs/checks/PLATFORM_CHECK_20260430.md
```
# Farmerstree Fertilizer Platform 전체 점검 기록

## 점검일

2026-04-30

## 점검 대상

- 메인 홈 화면
- 수익성 계산기
- 배합 계산기
- 발효 온도 기록 대시보드
- 품질검사 입력 대시보드
- 제조 배치 기록 자동 생성기
- 제조번호별 통합 리포트 생성기
- PDF 품질 리포트 출력 화면
- SMS Biochar 전환·혼합 계산기
- SMS Biochar 품질검사 대시보드
- Biochar 로트 기록 자동 생성기
- 토양·탄소 리포트 계산기
- 운영 규칙 문서
- Git 백업 규칙 문서

---

## 1. 파일 구조 점검

| 항목 | 결과 | 메모 |
|---|---|---|
| index.html | 확인 필요 |  |
| calculator | 확인 필요 |  |
| recipe-calculator | 확인 필요 |  |
| dashboard | 확인 필요 |  |
| quality-dashboard | 확인 필요 |  |
| batch-generator | 확인 필요 |  |
| report-generator | 확인 필요 |  |
| print-report | 확인 필요 |  |
| biochar-calculator | 확인 필요 |  |
| biochar-quality-dashboard | 확인 필요 |  |
| biochar-lot-generator | 확인 필요 |  |
| soil-carbon-calculator | 확인 필요 |  |
| qc 문서 | 확인 필요 |  |
| docs 문서 | 확인 필요 |  |

---

## 2. 기능 점검

| 기능 | 결과 | 메모 |
|---|---|---|
| 홈 화면 열림 | 확인 필요 |  |
| 카드 링크 이동 | 확인 필요 |  |
| 수익성 계산 | 확인 필요 |  |
| 배합 자동 계산 | 확인 필요 |  |
| 발효 온도 기록 추가 | 확인 필요 |  |
| 발효 CSV 내보내기 | 확인 필요 |  |
| 품질검사 판정 | 확인 필요 |  |
| 품질검사 CSV 내보내기 | 확인 필요 |  |
| 배치 기록 Markdown 생성 | 확인 필요 |  |
| 통합 리포트 Markdown 생성 | 확인 필요 |  |
| PDF 리포트 인쇄 | 확인 필요 |  |
| Biochar 계산 | 확인 필요 |  |
| Biochar 품질검사 판정 | 확인 필요 |  |
| Biochar 로트 기록 생성 | 확인 필요 |  |
| 토양·탄소 리포트 생성 | 확인 필요 |  |

---

## 3. 오류 기록

```text

```

```

---
## FILE: docs/GIT_BACKUP_RULES.md
```
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
```

---
## FILE: docs/MVP_SUMMARY_20260429.md
```
# Farmerstree Fertilizer Platform MVP 요약 (2026-04-29)

## 1. 프로젝트 한줄 정의

버섯 후배지를 기반으로 **저염 및 고기능성** 펠릿비료를 제조할 때, 현장 작업자가 브라우저에서 공정 기록, 품질 판정, 리포트 생성, 출력까지 수행하도록 만든 운영형 웹 MVP.

## 2. 이번 단계 완료 범위

이번 단계에서 아래 4가지를 MVP 기준으로 완료했다.

1. 현장 운영용 웹 모듈 구성
2. 운영/품질 기준 문서화
3. Git 기반 형상관리 시작(초기 커밋 완료)
4. 로컬 zip 백업 체계 구축

## 3. 기능 구성 (실사용 관점)

### 3-1. 계산/기록/판정

- 수익성 계산: 원가/수익 계산 보조
- 배합 계산: 레시피 비율 계산 보조
- 발효 대시보드: 배치별 온도 기록, 판정, CSV 내보내기
- 품질 대시보드: 품질항목 입력, 규칙 기반 판정, CSV 내보내기
- **입력 데이터 보호: 브라우저 로컬 스토리지(localStorage)를 활용한 임시 자동 저장 기능 (예기치 않은 브라우저 종료 시 유실 방지)**

### 3-2. 문서/리포트

- 배치 문서 생성기: 입력값 기반 배치 기록 마크다운 생성
- 통합 리포트 생성기: 발효 CSV + 품질 CSV를 제조번호 기준으로 통합
- 출력 리포트 화면: A4 인쇄 최적화 화면 생성, 브라우저 PDF 저장 지원

### 3-3. 운영 문서

- 운영 규칙 문서
- 품질 체크리스트 / 배치 템플릿
- Git/백업 운영 규칙 문서

## 4. 버전관리/복구 체계

### 4-1. Git 운영 상태

- 로컬 Git 저장소 초기화 완료
- 초기 커밋 완료
- 기본 브랜치 main 운영
- .gitignore 구성 완료

### 4-2. 시스템 백업 체계

- 스크립트: scripts/backup_project.sh
- 방식: 프로젝트 전체 zip 백업
- 제외: .git, node_modules, .DS_Store
- 경로: /Volumes/AI_DATA_CENTRE/AI_WORKSPACE/_BACKUPS/farmerstree-fertilizer-platform

### 4-3. 현장 실무 데이터 백업 체계 (신설)

- **대상: 현장에서 생성 및 내보내기 된 원본 CSV 데이터 및 PDF 성적서 산출물**
- **주기: 주 1회 정기 백업 및 중요 공정 완료 직후**
- **방식: 진안 현장의 외부 스토리지(NAS/외장하드) 복사 또는 클라우드 자동 동기화**

## 5. GitHub 업로드 정책 (핵심)

업로드 대상:

- 소스 코드(HTML/CSS/JS)
- 운영 문서(MD)
- 템플릿/샘플 데이터(JSON, 템플릿 MD)

업로드 제외 대상:

- 원본 CSV 데이터
- PDF 성적서 산출물
- 개인정보 포함 파일
- 환경변수 파일(.env, .env.local)
- 임시 파일/로컬 백업

## 6. 최종 운영 루틴 (현장 적용본)

1. 새 기능 전 git status
2. 작업
3. Live Server 확인
4. 이상 없으면 git add .
5. **git commit -m "feat/fix/docs: 작업 내용" (직관적인 커밋 메시지 컨벤션 적용)**
6. git push
7. 중요한 날 ./scripts/backup_project.sh **및 현장 데이터 백업 실행**

## 7. 현재 보완 포인트

1. 릴리스 태그 규칙(v0.1.0 등) **및 커밋 메시지 컨벤션** 도입 권장
2. 데이터 샘플/실데이터 분리 폴더 정책 권장
3. 월 1회 복구 리허설(백업 zip **및 실데이터 복원** 테스트) 권장

## 8. 외부 설명용 결론

Farmerstree Fertilizer Platform은 현재 "현장 기록-품질 판정-리포트 생성-출력"까지 이어지는 MVP로 동작 가능하다. 또한 Git 버전관리와 백업/복구 운영 규칙을 함께 갖추어, 개발 지속성과 운영 안정성의 최소 조건을 충족한 상태다. 현재는 GitHub 원격 저장소 연동과 main 푸시까지 완료되었고, 다음 단계는 정기 복구 점검 체계화다.
```

---
## FILE: docs/OPERATION_RULES.md
```
# Farmerstree 운영 규칙

본 문서는 후배지 기반 기능성 펠릿비료 제조관리 플랫폼의 현장 운영 기준을 정리한다.

## 1. 기본 원칙

1. 모든 배치는 제조번호(예: FT-FERT-YYYYMMDD-001)로 관리한다.
2. 주요 측정값은 임의 추정이 아닌 실제 측정값을 입력한다.
3. 품질 판정 결과가 경고 또는 위험일 경우, 즉시 조치 기록을 남긴다.
4. 출하 전에는 품질검사 대시보드 판정과 QC 문서 판정을 함께 확인한다.

## 2. 공정별 운영 기준

1. 후배지 원료관리
- 이물질(비닐, 금속, 돌) 혼입 금지
- 강한 부패취 원료는 별도 분리

2. 염류관리
- pH, EC, 수분을 초기 점검
- 고염류 원료는 흡착재 및 저염 원료로 희석

3. C/N 보정
- 목표 C/N 범위: 15~25 (공정 단계에 따라 조정)
- 배합 변경 시 사유를 배치 기록서에 기재

4. 고온부숙
- 목표 온도: 55~65℃
- 온도 과열/저하 시 즉시 뒤집기 또는 통기 조치

5. 후숙
- 후숙 기간: 20~40일
- 후숙 온도: 25~45℃
- 후숙 수분: 40~50%
- 뒤집기 주기: 5~7일 간격
- 암모니아취가 없어야 함
- 부패취가 없어야 함
- 색상은 갈색~암갈색 유지
- 촉감은 부슬부슬하고 끈적임이 적어야 함
- 더미 온도는 외기온 대비 과도하게 높지 않아야 함
- 발아지수(GI) 최소 70 이상, 권장 80 이상
- 기준 미달 시 추가 후숙 또는 재부숙 후 재검사

6. 기능성 미생물 접종
- 접종 시 원료 온도 40℃ 이하 권장
- 접종 후 안정화 기간을 확보

7. 펠릿화
- 최종 수분, 파손율, 분진 발생 상태 확인
- 과다 파손 시 성형 조건 재조정

8. 품질검사
- 수분, pH, EC, C/N, 발아지수, 냄새, 파손율을 기준으로 판정
- 위험 항목 발생 시 출하 보류

## 3. 품질 판정 기준(요약)

- 수분: 15~20% 권장, 25% 초과 시 재건조
- pH: 6.5~8.0 권장
- EC: 4.0 초과 시 주의, 5.0 초과 시 사용 제한 검토
- C/N: 15~25 권장
- 발아지수(GI): 70 이상 최소, 80 이상 권장
- 냄새: 암모니아취/부패취 발생 시 추가 후숙 또는 재부숙
- 펠릿 파손율: 10% 이하 권장, 20% 초과 시 조건 재조정

## 4. 기록 관리 기준

1. 대시보드 입력 기록(localStorage)은 주기적으로 문서에 백업한다.
2. 배치 완료 후 `qc/batches/`에 배치 문서를 보관한다.
3. 판정이 `출하 불가`, `사용 제한`인 배치는 조치 완료 전 출하하지 않는다.

## 5. 책임자 확인

- 생산 담당: 공정 데이터 입력 및 일지 기록
- 품질 담당: 최종 검사값 확인 및 출하 판정
- 운영 책임자: 경고/위험 배치 조치 승인

```

---
## FILE: docs/OPERATION_VERIFICATION_CHECKLIST.md
```
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
```

---
## FILE: farmer-roi-calculator/app.js
```
// ─────────────────────────────────────────────
//  Farmerstree — 농가 ROI 시뮬레이터  app.js
// ─────────────────────────────────────────────

// 작물별 기본값 (기비/추비/토양개량/인건비/수확량/단가/수확증가율%)
const CROP_PRESETS = {
  rice:       { name:'벼 (논)',       base:30000, top:15000, soil:10000, labor:15000, yield:500,  price:1800, yieldUp:5  },
  pepper:     { name:'고추',          base:40000, top:25000, soil:18000, labor:25000, yield:180,  price:8000, yieldUp:8  },
  garlic:     { name:'마늘',          base:50000, top:20000, soil:20000, labor:30000, yield:800,  price:3500, yieldUp:7  },
  onion:      { name:'양파',          base:35000, top:18000, soil:15000, labor:20000, yield:4000, price:500,  yieldUp:6  },
  cabbage:    { name:'배추',          base:30000, top:15000, soil:12000, labor:18000, yield:5000, price:300,  yieldUp:6  },
  strawberry: { name:'딸기 (시설)',   base:60000, top:40000, soil:30000, labor:40000, yield:2000, price:6000, yieldUp:10 },
  tomato:     { name:'토마토 (시설)', base:55000, top:35000, soil:25000, labor:35000, yield:8000, price:1500, yieldUp:9  },
  apple:      { name:'사과',          base:45000, top:30000, soil:20000, labor:35000, yield:2000, price:3000, yieldUp:7  },
};

// 제품별 기본 설정
const PRODUCT_PRESETS = {
  A: { price:18000, usage:2.0, chemReplace:50, soilReplace:60, yieldUp:4  },
  B: { price:23000, usage:2.0, chemReplace:55, soilReplace:70, yieldUp:6  },
  C: { price:28000, usage:2.5, chemReplace:60, soilReplace:80, yieldUp:8  },
};

// ─── 초기화 ───────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  renderRefTable();
  onCropChange();
  calcROI();
});

function onCropChange() {
  const key = document.getElementById('cropType').value;
  const p = CROP_PRESETS[key];
  if (!p) return;
  document.getElementById('chemBase').value   = p.base;
  document.getElementById('chemTop').value    = p.top;
  document.getElementById('chemSoil').value   = p.soil;
  document.getElementById('chemLabor').value  = p.labor;
  document.getElementById('chemYield').value  = p.yield;
  document.getElementById('cropPrice').value  = p.price;
  document.getElementById('ftYieldUp').value  = p.yieldUp;
  calcROI();
}

function onProductChange() {
  const key = document.getElementById('ftProductType').value;
  const p = PRODUCT_PRESETS[key];
  if (!p) return;
  document.getElementById('ftPrice').value       = p.price;
  document.getElementById('ftUsage').value       = p.usage;
  document.getElementById('ftChemReplace').value = p.chemReplace;
  document.getElementById('ftSoilReplace').value = p.soilReplace;
  document.getElementById('ftYieldUp').value     = p.yieldUp;
  calcROI();
}

function onAreaUnitChange() {
  const val = document.getElementById('areaUnit').value;
  const grp = document.getElementById('customAreaGroup');
  grp.style.display = (val === 'custom') ? 'block' : 'none';
  calcROI();
}

// ─── 핵심 계산 ────────────────────────────────
function calcROI() {
  const areaUnitVal = document.getElementById('areaUnit').value;
  const unitSize = areaUnitVal === 'custom'
    ? (parseFloat(document.getElementById('customArea').value) || 1000)
    : parseFloat(areaUnitVal);
  const areaCount = parseFloat(document.getElementById('areaCount').value) || 1;
  const totalArea = unitSize * areaCount;

  // 단위 환산 비율 (입력은 1,000㎡ 기준 → 실제 면적 적용)
  const scale = totalArea / 1000;

  // 화학비료 현황
  const chemBase  = parseFloat(document.getElementById('chemBase').value)  || 0;
  const chemTop   = parseFloat(document.getElementById('chemTop').value)   || 0;
  const chemSoil  = parseFloat(document.getElementById('chemSoil').value)  || 0;
  const chemLabor = parseFloat(document.getElementById('chemLabor').value) || 0;
  const chemYield = parseFloat(document.getElementById('chemYield').value) || 0;
  const cropPrice = parseFloat(document.getElementById('cropPrice').value) || 0;

  const chemTotalPer1k = chemBase + chemTop + chemSoil + chemLabor;
  const chemTotalAll   = chemTotalPer1k * scale;
  const chemRevenue    = chemYield * cropPrice * scale;

  // Farmerstree 설정
  const ftPrice      = parseFloat(document.getElementById('ftPrice').value)      || 0;
  const ftUsage      = parseFloat(document.getElementById('ftUsage').value)      || 0;
  const ftChemRepl   = parseFloat(document.getElementById('ftChemReplace').value)/ 100 || 0;
  const ftSoilRepl   = parseFloat(document.getElementById('ftSoilReplace').value)/ 100 || 0;
  const ftYieldUp    = parseFloat(document.getElementById('ftYieldUp').value)    / 100 || 0;
  const subsidyRate  = parseFloat(document.getElementById('subsidyRate').value)  / 100 || 0;

  // 비료비 절감
  const fertSavingPer1k = (chemBase + chemTop) * ftChemRepl + chemSoil * ftSoilRepl;
  const fertSavingAll   = fertSavingPer1k * scale;

  // Farmerstree 비용
  const ftCostPer1k  = ftPrice * ftUsage;
  const ftCostAll    = ftCostPer1k * scale;

  // 보조금
  const subsidyAll   = ftCostAll * subsidyRate;
  const ftNetCostAll = ftCostAll - subsidyAll;

  // 수확량 증가 수익
  const yieldGainKg  = chemYield * ftYieldUp * scale;
  const yieldGainWon = yieldGainKg * cropPrice;

  // 순 절감·수익
  const netSaving = fertSavingAll + yieldGainWon - ftNetCostAll;

  // ROI (투자 대비)
  const roi = ftNetCostAll > 0 ? (netSaving / ftNetCostAll) : 0;

  // 투자 회수 (연 단위)
  const bepYears = netSaving > 0 ? (ftNetCostAll / netSaving) : Infinity;

  // 탄소저장 추정 (C형만, 바이오차 20kg포대 × 30% biochar 함유 × 탄소함량 60%)
  const productType = document.getElementById('ftProductType').value;
  const biocharKg   = productType === 'C' ? (ftUsage * 20 * 0.3 * scale) : 0;
  const carbonSeqKg = biocharKg * 0.60;

  // ─── UI 업데이트 ───
  document.getElementById('totalAreaHint').textContent = `총 ${comma(totalArea)}㎡`;
  document.getElementById('resultAreaLabel').textContent = `적용 면적: ${comma(totalArea)}㎡ (1,000㎡ × ${areaCount}단위)`;

  document.getElementById('resNetSaving').textContent   = wonStr(netSaving);
  document.getElementById('resNetSavingSub').textContent = netSaving >= 0
    ? `화학비료 대비 연간 절감·수익 합산` : `비용 부담이 더 큽니다 — 면적·대체율 조정 권장`;
  document.getElementById('resNetSaving').className = 'result-value ' + (netSaving >= 0 ? 'green' : 'red');

  document.getElementById('resFertSaving').textContent   = wonStr(fertSavingAll);
  document.getElementById('resFertSavingSub').textContent = `(화학비료 대체 절감 ${wonStr(fertSavingPer1k)}/1,000㎡)`;

  document.getElementById('resYieldGain').textContent   = wonStr(yieldGainWon);
  document.getElementById('resYieldGainSub').textContent = `수확량 +${comma(Math.round(yieldGainKg))}kg × ${comma(cropPrice)}원/kg`;

  document.getElementById('resFTCost').textContent   = wonStr(ftNetCostAll);
  document.getElementById('resFTCostSub').textContent = `(보조금 ${wonStr(subsidyAll)} 차감 후 실비용)`;

  document.getElementById('resSubsidy').textContent = wonStr(subsidyAll);

  const roiText = roi >= 0 ? `${roi.toFixed(1)}배` : '–';
  document.getElementById('resROI').textContent = roiText;
  document.getElementById('resROI').className = 'result-value ' + (roi >= 1 ? 'green' : roi >= 0 ? '' : 'red');

  document.getElementById('resBEP').textContent = isFinite(bepYears)
    ? (bepYears < 1 ? `${Math.round(bepYears * 12)}개월 이내` : `${bepYears.toFixed(1)}년`)
    : '절감 효과 없음';

  document.getElementById('resYieldKg').textContent = `+${comma(Math.round(yieldGainKg))}kg (${(ftYieldUp*100).toFixed(0)}% 증가)`;

  document.getElementById('resCarbonSeq').textContent = productType === 'C'
    ? `약 ${carbonSeqKg.toFixed(1)}kg CO₂e 저장`
    : 'C형(바이오차 복합) 선택 시 적용';

  // 비교 바
  const maxBar = Math.max(chemTotalAll, ftCostAll + (chemTotalAll - fertSavingAll));
  const ftBarCost = ftCostAll + chemTotalAll - fertSavingAll - subsidyAll;
  document.getElementById('barChem').style.width   = maxBar > 0 ? `${Math.min(100, chemTotalAll / maxBar * 100)}%` : '0%';
  document.getElementById('barFT').style.width     = maxBar > 0 ? `${Math.min(100, Math.max(0, ftBarCost / maxBar * 100))}%` : '0%';
  document.getElementById('barChemVal').textContent = wonStr(chemTotalAll);
  document.getElementById('barFTVal').textContent   = wonStr(Math.max(0, ftBarCost));

  // 영업 요약 문구
  const cropName = CROP_PRESETS[document.getElementById('cropType').value]?.name || '작물';
  const productName = { A:'A형(고부숙)', B:'B형(기능성)', C:'C형(바이오차 복합)' }[productType] || '';
  const summaryText = netSaving >= 0
    ? `${cropName} ${comma(totalArea)}㎡에 Farmerstree ${productName} 비료를 적용할 경우, ` +
      `비료비 절감 ${wonStr(fertSavingAll)}과 수확량 증가 수익 ${wonStr(yieldGainWon)}을 합산해 ` +
      `연간 약 ${wonStr(netSaving)}의 순이익 개선 효과가 예상됩니다. ` +
      `(ROI ${roiText}, 보조금 ${wonStr(subsidyAll)} 포함)` +
      (productType === 'C' ? ` 바이오차 투입으로 탄소저장 ${carbonSeqKg.toFixed(1)}kg CO₂e 인정 가능.` : '')
    : `현재 입력 조건에서는 비용 대비 절감 효과가 크지 않습니다. 면적 확대 또는 화학비료 대체율을 높일 경우 효과가 개선됩니다.`;

  document.getElementById('summaryText').textContent = summaryText;
}

// ─── 유틸 ─────────────────────────────────────
function comma(n) {
  return Math.round(n).toLocaleString('ko-KR');
}
function wonStr(n) {
  const abs = Math.abs(n);
  if (abs >= 10000000) return `${(n/10000000).toFixed(1)}천만원`;
  if (abs >= 1000000)  return `${(n/1000000).toFixed(1)}백만원`;
  if (abs >= 10000)    return `${(n/10000).toFixed(0)}만원`;
  return `${comma(n)}원`;
}

function copySummary() {
  const text = document.getElementById('summaryText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.btn-copy');
    btn.textContent = '복사 완료!';
    setTimeout(() => btn.textContent = '문구 복사', 2000);
  });
}

function exportCSV() {
  const rows = [
    ['항목', '값'],
    ['작물', CROP_PRESETS[document.getElementById('cropType').value]?.name || ''],
    ['면적(㎡)', document.getElementById('totalAreaHint').textContent.replace('총 ','').replace('㎡','')],
    ['제품', document.getElementById('ftProductType').selectedOptions[0].text],
    ['비료비 절감(원)', document.getElementById('resFertSaving').textContent],
    ['수확량 증가 수익(원)', document.getElementById('resYieldGain').textContent],
    ['FT비료 순비용(원)', document.getElementById('resFTCost').textContent],
    ['보조금(원)', document.getElementById('resSubsidy').textContent],
    ['연간 순이익 개선(원)', document.getElementById('resNetSaving').textContent],
    ['ROI', document.getElementById('resROI').textContent],
    ['투자회수기간', document.getElementById('resBEP').textContent],
    ['탄소저장', document.getElementById('resCarbonSeq').textContent],
    ['생성일시', new Date().toLocaleString('ko-KR')],
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `farmerstree-roi-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function renderRefTable() {
  const tbody = document.getElementById('refTableBody');
  tbody.innerHTML = Object.entries(CROP_PRESETS).map(([, p]) => `
    <tr>
      <td>${p.name}</td>
      <td>${comma(p.base)}원</td>
      <td>${comma(p.top)}원</td>
      <td>${comma(p.soil)}원</td>
      <td>${comma(p.yield)}kg</td>
      <td>${comma(p.price)}원/kg</td>
      <td>+${p.yieldUp}%</td>
    </tr>
  `).join('');
}

```

---
## FILE: farmer-roi-calculator/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>농가 ROI 시뮬레이터 — Farmerstree</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <span class="logo">Farmerstree Fertilizer Platform</span>
    <nav class="header-nav">
      <a href="../calculator/">수익성 계산기</a>
      <a href="../quality-dashboard/">품질검사</a>
      <a href="../sales-manager/">재고·거래처</a>
      <a href="../farmer-roi-calculator/" class="active">농가 ROI</a>
    </nav>
  </div>
</header>

<main class="container">
  <h1 class="page-title">농가 ROI 시뮬레이터</h1>
  <p class="page-desc">Farmerstree 후배지 바이오차 복합 펠릿비료 사용 시, 화학비료 대비 비용 절감액과 수익 증가를 작물별로 계산합니다.</p>

  <div class="grid-2col">

    <!-- ── 왼쪽: 입력 패널 ── -->
    <div class="input-panel">

      <!-- ① 작물 및 면적 -->
      <section class="card">
        <h2 class="section-title">① 작물 및 면적 설정</h2>

        <div class="form-group">
          <label for="cropType">작물 종류</label>
          <select id="cropType" onchange="onCropChange()">
            <option value="rice">벼 (논)</option>
            <option value="pepper">고추</option>
            <option value="garlic">마늘</option>
            <option value="onion">양파</option>
            <option value="cabbage">배추</option>
            <option value="strawberry">딸기 (시설)</option>
            <option value="tomato">토마토 (시설)</option>
            <option value="apple">사과</option>
          </select>
        </div>

        <div class="form-group">
          <label for="areaUnit">면적 단위</label>
          <select id="areaUnit" onchange="onAreaUnitChange()">
            <option value="1000">1,000㎡ (약 300평)</option>
            <option value="3000">3,000㎡ (약 900평)</option>
            <option value="10000">10a (1반 = 10,000㎡)</option>
            <option value="custom">직접 입력 (㎡)</option>
          </select>
        </div>

        <div class="form-group" id="customAreaGroup" style="display:none;">
          <label for="customArea">직접 입력 면적 (㎡)</label>
          <input type="number" id="customArea" value="1000" min="1" oninput="calcROI()" />
        </div>

        <div class="form-group">
          <label for="areaCount">적용 면적 수</label>
          <div class="input-hint-row">
            <input type="number" id="areaCount" value="1" min="1" step="1" oninput="calcROI()" />
            <span class="hint" id="totalAreaHint">총 1,000㎡</span>
          </div>
        </div>
      </section>

      <!-- ② 화학비료 현황 -->
      <section class="card">
        <h2 class="section-title">② 현재 화학비료 사용 현황</h2>
        <p class="section-desc">현재 사용 중인 비료 비용을 입력하세요. 작물 선택 시 평균값이 자동 입력됩니다.</p>

        <div class="form-group">
          <label for="chemBase">기비(밑거름) 비용</label>
          <div class="input-unit-row">
            <input type="number" id="chemBase" value="30000" min="0" oninput="calcROI()" />
            <span class="unit">원 / 1,000㎡</span>
          </div>
        </div>
        <div class="form-group">
          <label for="chemTop">추비(웃거름) 비용</label>
          <div class="input-unit-row">
            <input type="number" id="chemTop" value="15000" min="0" oninput="calcROI()" />
            <span class="unit">원 / 1,000㎡</span>
          </div>
        </div>
        <div class="form-group">
          <label for="chemSoil">토양개량제 비용</label>
          <div class="input-unit-row">
            <input type="number" id="chemSoil" value="10000" min="0" oninput="calcROI()" />
            <span class="unit">원 / 1,000㎡</span>
          </div>
        </div>
        <div class="form-group">
          <label for="chemLabor">시비 인건비</label>
          <div class="input-unit-row">
            <input type="number" id="chemLabor" value="15000" min="0" oninput="calcROI()" />
            <span class="unit">원 / 1,000㎡</span>
          </div>
        </div>
        <div class="form-group">
          <label for="chemYield">현재 수확량</label>
          <div class="input-unit-row">
            <input type="number" id="chemYield" value="500" min="0" oninput="calcROI()" />
            <span class="unit">kg / 1,000㎡</span>
          </div>
        </div>
        <div class="form-group">
          <label for="cropPrice">농산물 판매단가</label>
          <div class="input-unit-row">
            <input type="number" id="cropPrice" value="1800" min="0" oninput="calcROI()" />
            <span class="unit">원 / kg</span>
          </div>
        </div>
      </section>

      <!-- ③ Farmerstree 비료 설정 -->
      <section class="card">
        <h2 class="section-title">③ Farmerstree 비료 적용 설정</h2>

        <div class="form-group">
          <label for="ftProductType">제품 선택</label>
          <select id="ftProductType" onchange="onProductChange()">
            <option value="A">A형 — 후배지 고부숙 펠릿 (기본)</option>
            <option value="B">B형 — 기능성 미생물 펠릿 (프리미엄)</option>
            <option value="C">C형 — 후배지 + SMS 바이오차 복합 (고부가)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="ftPrice">구매 단가</label>
          <div class="input-unit-row">
            <input type="number" id="ftPrice" value="18000" min="0" oninput="calcROI()" />
            <span class="unit">원 / 20kg포대</span>
          </div>
        </div>
        <div class="form-group">
          <label for="ftUsage">사용량</label>
          <div class="input-unit-row">
            <input type="number" id="ftUsage" value="2.0" min="0" step="0.1" oninput="calcROI()" />
            <span class="unit">포대 / 1,000㎡</span>
          </div>
        </div>
        <div class="form-group">
          <label for="ftChemReplace">화학비료 대체율</label>
          <div class="input-unit-row">
            <input type="number" id="ftChemReplace" value="50" min="0" max="100" oninput="calcROI()" />
            <span class="unit">% 기비+추비 중 절감 비율</span>
          </div>
        </div>
        <div class="form-group">
          <label for="ftSoilReplace">토양개량제 대체율</label>
          <div class="input-unit-row">
            <input type="number" id="ftSoilReplace" value="60" min="0" max="100" oninput="calcROI()" />
            <span class="unit">%</span>
          </div>
        </div>
        <div class="form-group">
          <label for="ftYieldUp">수확량 증가율</label>
          <div class="input-unit-row">
            <input type="number" id="ftYieldUp" value="4" min="0" max="50" step="0.5" oninput="calcROI()" />
            <span class="unit">% 바이오차 토양개량 효과 반영</span>
          </div>
        </div>
        <div class="form-group">
          <label for="subsidyRate">보조금·지원율</label>
          <div class="input-unit-row">
            <input type="number" id="subsidyRate" value="0" min="0" max="80" oninput="calcROI()" />
            <span class="unit">% 친환경농업직불금·지자체 지원 등</span>
          </div>
        </div>
      </section>

    </div><!-- /input-panel -->

    <!-- ── 오른쪽: 결과 패널 ── -->
    <div class="result-panel">

      <section class="card result-card">
        <h2 class="section-title">농가 ROI 분석 결과</h2>
        <p class="result-area-label" id="resultAreaLabel">적용 면적: –</p>

        <!-- 핵심 KPI -->
        <div class="kpi-primary">
          <div class="kpi-label">연간 순 절감·수익</div>
          <div class="result-value green" id="resNetSaving">0원</div>
          <div class="kpi-sub" id="resNetSavingSub">–</div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="kpi-label">비료비 절감</div>
            <div class="result-value" id="resFertSaving">0원</div>
            <div class="kpi-sub" id="resFertSavingSub">–</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-label">수확량 증가 수익</div>
            <div class="result-value" id="resYieldGain">0원</div>
            <div class="kpi-sub" id="resYieldGainSub">–</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-label">Farmerstree 비료 비용</div>
            <div class="result-value" id="resFTCost">0원</div>
            <div class="kpi-sub" id="resFTCostSub">–</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-label">보조금 수령 추정</div>
            <div class="result-value" id="resSubsidy">0원</div>
            <div class="kpi-sub">친환경 전환 지원 기준</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-label">ROI 배수</div>
            <div class="result-value" id="resROI">0.0배</div>
            <div class="kpi-sub">투자 대비 순이익 비율</div>
          </div>
        </div>

        <!-- 바 차트 비교 -->
        <div class="bar-section">
          <h3 class="bar-title">비용 구조 비교 (1,000㎡ 기준)</h3>
          <div class="bar-row">
            <span class="bar-label">화학비료 기준 총비용</span>
            <div class="bar-track">
              <div class="bar bar-chem" id="barChem"></div>
            </div>
            <span class="bar-val" id="barChemVal">0원</span>
          </div>
          <div class="bar-row">
            <span class="bar-label">Farmerstree 전환 후 총비용</span>
            <div class="bar-track">
              <div class="bar bar-ft" id="barFT"></div>
            </div>
            <span class="bar-val" id="barFTVal">0원</span>
          </div>
        </div>

        <!-- 보조 지표 -->
        <div class="sub-metrics">
          <div class="sub-metric-item">
            <span class="sub-label">투자 회수 기간</span>
            <span class="sub-val" id="resBEP">–</span>
          </div>
          <div class="sub-metric-item">
            <span class="sub-label">수확량 증가 예상</span>
            <span class="sub-val" id="resYieldKg">–</span>
          </div>
          <div class="sub-metric-item">
            <span class="sub-label">탄소저장 추정 (C형)</span>
            <span class="sub-val" id="resCarbonSeq">–</span>
          </div>
        </div>

        <!-- 영업 요약 문구 -->
        <div class="summary-box">
          <h3 class="summary-title">영업 설명용 요약 문구</h3>
          <p class="summary-text" id="summaryText">–</p>
          <div class="summary-actions">
            <button class="btn btn-copy" onclick="copySummary()">문구 복사</button>
            <button class="btn btn-csv" onclick="exportCSV()">CSV 내보내기</button>
            <button class="btn btn-print" onclick="window.print()">인쇄 / PDF 저장</button>
          </div>
        </div>

      </section>

      <!-- 참고 테이블 -->
      <section class="card">
        <h2 class="section-title">작물별 기본 설정값 참고</h2>
        <div class="table-wrap">
          <table class="ref-table">
            <thead>
              <tr>
                <th>작물</th>
                <th>기비</th>
                <th>추비</th>
                <th>토양개량</th>
                <th>수확량(kg)</th>
                <th>단가(원/kg)</th>
                <th>수확증가율</th>
              </tr>
            </thead>
            <tbody id="refTableBody"></tbody>
          </table>
        </div>
        <p class="table-note">※ 기준값은 농촌진흥청 농자재 투입 통계 및 Farmerstree 시험포 추정치입니다.</p>
      </section>

    </div><!-- /result-panel -->

  </div><!-- /grid-2col -->
</main>

<footer class="site-footer">
  <a href="../index.html">← Farmerstree Fertilizer Platform 메인으로</a>
</footer>

<script src="app.js"></script>
</body>
</html>

```

---
## FILE: farmer-roi-calculator/style.css
```
/* ─────────────────────────────────────────────
   Farmerstree — 농가 ROI 시뮬레이터  style.css
   기존 플랫폼 공통 스타일과 동일한 체계
───────────────────────────────────────────── */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green-50:  #f0faf4;
  --green-100: #d1f0dc;
  --green-400: #4db87a;
  --green-600: #2a8a52;
  --green-800: #14532d;
  --gray-50:   #f9f9f7;
  --gray-100:  #f0ede8;
  --gray-200:  #e0dbd2;
  --gray-400:  #9c9688;
  --gray-600:  #5a5650;
  --gray-800:  #2e2b26;
  --amber-400: #d97706;
  --red-100:   #fee2e2;
  --red-600:   #dc2626;
  --bg:        #fafaf8;
  --card:      #ffffff;
  --border:    rgba(0,0,0,0.08);
  --text:      #1e1c18;
  --text-sub:  #6b6560;
  --radius:    12px;
  --shadow:    0 1px 4px rgba(0,0,0,0.06);
}

body {
  font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  line-height: 1.65;
}

/* ── 헤더 ── */
.site-header {
  background: var(--green-800);
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 24px;
  height: 52px;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-wrap: wrap;
}
.header-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}
.site-logo, .logo {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}
.site-nav, .header-nav { display: flex; gap: 4px; flex-wrap: wrap; margin-left: auto; }
.site-nav a, .header-nav a {
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.site-nav a:hover,   .header-nav a:hover   { background: rgba(255,255,255,0.1); color: #fff; }
.site-nav a.active,  .header-nav a.active  { background: rgba(255,255,255,0.18); color: #fff; font-weight: 500; }

/* ── 컨테이너 ── */
.container { max-width: 1100px; margin: 0 auto; padding: 32px 20px 60px; }

/* ── 2컬럼 그리드 ── */
.grid-2col {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
  align-items: start;
}

/* ── 페이지 타이틀 ── */
.page-header { margin-bottom: 28px; }
.page-header h1,
.page-title { font-size: 22px; font-weight: 700; color: var(--green-800); margin-bottom: 6px; }
.page-desc { font-size: 14px; color: var(--text-sub); line-height: 1.7; margin-bottom: 28px; }

/* ── 카드 ── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--green-800);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--gray-100);
}
.section-desc,
.section-hint {
  font-size: 12px;
  color: var(--text-sub);
  margin-bottom: 14px;
  background: var(--green-50);
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid var(--green-400);
}

/* ── 폼 그리드 ── */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.form-group:last-child { margin-bottom: 0; }
.form-group label {
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-600);
}
.form-group input,
.form-group select {
  padding: 8px 10px;
  border: 1px solid var(--gray-200);
  border-radius: 7px;
  font-size: 14px;
  color: var(--text);
  background: var(--bg);
  font-family: inherit;
  transition: border-color 0.15s;
  width: 100%;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--green-400);
}

/* 단위 포함 입력행 */
.input-unit-row,
.input-hint-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.input-unit-row input,
.input-hint-row input {
  flex: 1;
  min-width: 0;
}
.unit, .hint {
  font-size: 11px;
  color: var(--text-sub);
  white-space: nowrap;
}

/* ── 결과 패널 ── */
.result-panel {
  position: sticky;
  top: 72px;
}
.result-card {
  border: 2px solid var(--green-400) !important;
  box-shadow: 0 2px 12px rgba(42,138,82,0.08) !important;
}
.result-area-label {
  font-size: 12px;
  color: var(--text-sub);
  margin-bottom: 16px;
}

/* ── KPI ── */
.kpi-primary {
  background: var(--green-50);
  border: 1px solid var(--green-100);
  border-radius: 10px;
  padding: 16px 20px;
  text-align: center;
  margin-bottom: 16px;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}
.kpi-item {
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
  border-radius: 10px;
  padding: 12px 14px;
}
.kpi-label { font-size: 11px; font-weight: 500; color: var(--text-sub); margin-bottom: 4px; }
.kpi-sub { font-size: 10px; color: var(--gray-400); margin-top: 3px; line-height: 1.4; }
.result-label { font-size: 11px; font-weight: 500; color: var(--text-sub); }
.result-value { font-size: 18px; font-weight: 700; color: var(--text); }
.result-value.green { color: var(--green-600); }
.result-value.red   { color: var(--red-600); }
.result-sub { font-size: 11px; color: var(--text-sub); line-height: 1.4; }

/* ── 비교 바 ── */
.bar-section,
.compare-section {
  background: var(--gray-50);
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 20px;
}
.bar-title,
.compare-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: 14px;
}
.bar-row,
.compare-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.bar-row:last-child,
.compare-row:last-child { margin-bottom: 0; }
.bar-label,
.compare-label {
  font-size: 12px;
  color: var(--text-sub);
  min-width: 140px;
  white-space: nowrap;
}
.bar-track,
.bar-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--gray-100);
  border-radius: 6px;
  height: 28px;
  padding: 4px;
  overflow: hidden;
}
.bar {
  height: 20px;
  border-radius: 4px;
  transition: width 0.4s ease;
  min-width: 4px;
}
.bar-chem { background: var(--gray-400); }
.bar-ft   { background: var(--green-400); }
.bar-val,
.bar-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  min-width: 70px;
}

/* ── 보조 지표 ── */
.sub-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.sub-metric-item {
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 160px;
}
.sub-label { font-size: 11px; color: var(--text-sub); }
.sub-val { font-size: 15px; font-weight: 600; color: var(--green-600); }

/* 구 BEP 호환 */
.bep-section { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.bep-item {
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 160px;
}
.bep-label { font-size: 11px; color: var(--text-sub); }
.bep-value { font-size: 15px; font-weight: 600; color: var(--green-600); }

/* ── 영업 요약 문구 ── */
.summary-box {
  background: var(--green-50);
  border: 1px solid var(--green-100);
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 20px;
}
.summary-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--green-600);
  margin-bottom: 8px;
}
.summary-text {
  font-size: 13px;
  color: var(--text);
  line-height: 1.75;
  margin-bottom: 12px;
}
.summary-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* ── 버튼 ── */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, opacity 0.15s;
}
.btn-copy {
  background: var(--green-600);
  color: #fff;
}
.btn-copy:hover { background: var(--green-800); }
.btn-csv {
  background: var(--card);
  color: var(--green-600);
  border: 1.5px solid var(--green-400);
}
.btn-csv:hover { background: var(--green-50); }
.btn-print {
  background: var(--gray-100);
  color: var(--gray-800);
}
.btn-print:hover { background: var(--gray-200); }

/* 구 액션 버튼 호환 */
.action-row { display: flex; gap: 10px; flex-wrap: wrap; }
.btn-primary {
  padding: 10px 20px;
  background: var(--green-600);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--green-800); }
.btn-secondary {
  padding: 10px 20px;
  background: var(--card);
  color: var(--green-600);
  border: 1.5px solid var(--green-400);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.btn-secondary:hover { background: var(--green-50); }

/* ── 참고표 ── */
.ref-card { margin-top: 8px; }
.table-wrap { overflow-x: auto; margin-bottom: 10px; }
.ref-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.ref-table th {
  background: var(--green-50);
  color: var(--green-800);
  font-weight: 600;
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--green-100);
  white-space: nowrap;
}
.ref-table td {
  padding: 7px 12px;
  border-bottom: 1px solid var(--gray-100);
  color: var(--text);
}
.ref-table tr:last-child td { border-bottom: none; }
.ref-note,
.table-note {
  font-size: 11px;
  color: var(--text-sub);
  line-height: 1.5;
  margin-top: 8px;
}

/* ── 푸터 ── */
.site-footer {
  background: var(--green-800);
  color: rgba(255,255,255,0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  font-size: 12px;
  margin-top: 40px;
}
.site-footer a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
}
.site-footer a:hover { color: #fff; }

/* ── 인쇄 ── */
@media print {
  .site-header, .site-footer, .action-row,
  .summary-actions, .btn-copy, .btn-csv, .btn-print { display: none; }
  .card, .result-card { box-shadow: none !important; border: 1px solid #ccc !important; }
  .result-panel { position: static; }
  .grid-2col { display: block; }
  body { font-size: 12px; }
}

/* ── 모바일 ── */
@media (max-width: 860px) {
  .grid-2col { grid-template-columns: 1fr; }
  .result-panel { position: static; }
}
@media (max-width: 600px) {
  .container { padding: 20px 14px 40px; }
  .form-grid { grid-template-columns: 1fr 1fr; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .compare-label, .bar-label { min-width: 90px; font-size: 11px; }
  .site-header { height: auto; padding: 10px 16px; gap: 8px; }
}

```

---
## FILE: index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree Fertilizer Platform</title>
  <link rel="stylesheet" href="./style.css?v=2" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>후배지 기반 기능성 펠릿비료 제조관리 시스템</h1>
      <p class="description">
        후배지 원료관리, 염류관리, C/N 보정, 고온부숙, 후숙, 기능성 미생물,
        펠릿화, 품질검사까지 관리하는 Farmerstree 비료 제조관리 플랫폼입니다.
      </p>

      <div class="hero-actions">
        <a class="primary-button" href="./calculator/index.html">수익성 계산 시작</a>
        <a class="secondary-button" href="./quality-dashboard/index.html">품질검사 판정</a>
      </div>
    </section>

    <section class="status-card">
      <h2>현장 운영 대시보드</h2>
      <p class="module-section-text">오늘 확인할 현장 운영 항목입니다.</p>
      <div class="ops-grid">
        <a class="ops-item" href="./batch-generator/index.html">
          <span class="ops-icon">📥</span>
          <div>
            <strong>원료 입고</strong>
            <p>후배지 수거량·입고일·이물 제거 여부 확인</p>
          </div>
        </a>
        <a class="ops-item" href="./dashboard/index.html">
          <span class="ops-icon">🌡</span>
          <div>
            <strong>발효 온도</strong>
            <p>오전·오후 온도, 냄새, 수분 상태 기록</p>
          </div>
        </a>
        <a class="ops-item" href="./quality-dashboard/index.html">
          <span class="ops-icon">✓</span>
          <div>
            <strong>품질검사</strong>
            <p>수분·pH·EC·C/N·발아지수·파손율 입력 및 판정</p>
          </div>
        </a>
        <a class="ops-item" href="./quality-dashboard/index.html#shipping-judgement">
          <span class="ops-icon">🚚</span>
          <div>
            <strong>출하 가능 여부(바로가기)</strong>
            <p>품질검사 판정 결과로 출하 적합성 확인</p>
          </div>
        </a>
        <a class="ops-item" href="./sales-manager/index.html">
          <span class="ops-icon">📦</span>
          <div>
            <strong>재고·출하</strong>
            <p>로트별 재고 입고·출하 등록·거래처 납품 이력</p>
          </div>
        </a>
        <a class="ops-item" href="./biochar-lot-generator/index.html">
          <span class="ops-icon">🔥</span>
          <div>
            <strong>Biochar 로트</strong>
            <p>탄화 조건·수율·품질검사 결과 로트 기록 생성</p>
          </div>
        </a>
        <a class="ops-item" href="./soil-carbon-dashboard/index.html">
          <span class="ops-icon">🌱</span>
          <div>
            <strong>토양 탄소 기록</strong>
            <p>토양 유기탄소·pH·EC·작물 수량·탄소저장량 관리</p>
          </div>
        </a>
      </div>
    </section>

    <section class="process-card">
      <h2>핵심 제조 공정 8단계</h2>

      <div class="process-grid">
        <div class="process-step">
          <span>01</span>
          <strong>후배지 원료관리</strong>
          <p>수거, 선별, 이물 제거, 파쇄, 균질화</p>
        </div>

        <div class="process-step">
          <span>02</span>
          <strong>염류관리</strong>
          <p>pH, EC, 수분 측정 및 염류 저감</p>
        </div>

        <div class="process-step">
          <span>03</span>
          <strong>C/N 보정</strong>
          <p>계분, 유박, 미강, 제올라이트, 바이오차 배합</p>
        </div>

        <div class="process-step">
          <span>04</span>
          <strong>고온부숙</strong>
          <p>55~65℃ 고온 호기성 발효 관리</p>
        </div>

        <div class="process-step">
          <span>05</span>
          <strong>후숙</strong>
          <p>암모니아취, 유기산, 식물 독성 안정화</p>
        </div>

        <div class="process-step">
          <span>06</span>
          <strong>기능성 미생물</strong>
          <p>Bacillus, Lactobacillus, 효모 후접종</p>
        </div>

        <div class="process-step">
          <span>07</span>
          <strong>펠릿화</strong>
          <p>건조, 분쇄, 성형, 냉각, 재건조</p>
        </div>

        <div class="process-step">
          <span>08</span>
          <strong>품질검사</strong>
          <p>수분, pH, EC, C/N, 발아지수, 냄새, 파손율 판정</p>
        </div>
      </div>
    </section>

    <section class="module-section">
      <h2 class="module-section-title">기본 운영 모듈</h2>
      <p class="module-section-text">생산성·배합·발효 관리의 기본 실행 모듈입니다.</p>
      <div class="module-grid">
        <a class="module-card" href="./calculator/index.html">
          <div class="module-icon">₩</div>
          <h3>수익성 계산기</h3>
          <p>
            생산량, 원료비, 첨가물비, 펠릿화비, 품질검사비, 판매가, 보조금을 입력해
            포대당 원가와 순이익을 계산합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./recipe-calculator/index.html">
          <div class="module-icon">㎏</div>
          <h3>배합 계산기</h3>
          <p>
            후배지 투입량을 입력하면 일반형, 프리미엄형, 저염형 배합의 첨가물 투입량을 자동 계산합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./dashboard/index.html">
          <div class="module-icon">℃</div>
          <h3>발효 온도 대시보드</h3>
          <p>
            오전·오후 온도, 냄새, 수분 상태를 기록하고 고온부숙 적정 여부와 조치 필요성을 자동 판정합니다.
          </p>
          <span>열기 →</span>
        </a>
      </div>
    </section>

    <section class="module-section">
      <h2 class="module-section-title">품질·문서·리포트 모듈</h2>
      <p class="module-section-text">품질 판정, 기록 관리, 리포트 생성에 사용하는 모듈입니다.</p>
      <div class="module-grid">
        <a class="module-card" href="./quality-dashboard/index.html">
          <div class="module-icon">✓</div>
          <h3>품질검사 대시보드</h3>
          <p>
            수분, pH, EC, C/N, 발아지수, 파손율, 냄새 상태를 입력해 출하 가능 여부를 판정합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./qc/qc_checklist.md">
          <div class="module-icon">QC</div>
          <h3>품질검사 체크리스트</h3>
          <p>
            원료관리부터 최종 출하 판정까지 현장에서 확인할 품질관리 항목을 정리한 문서입니다.
          </p>
          <span>문서 열기 →</span>
        </a>

        <a class="module-card" href="./qc/batch_record_template.md">
          <div class="module-icon">LOT</div>
          <h3>제조 배치 기록서</h3>
          <p>
            제조번호별로 원료 입고, 배합, 부숙, 후숙, 미생물 접종, 펠릿화, 품질검사를 기록하는 양식입니다.
          </p>
          <span>문서 열기 →</span>
        </a>

        <a class="module-card" href="./report-generator/index.html">
          <div class="module-icon">REP</div>
          <h3>통합 리포트 생성기</h3>
          <p>
            발효 온도 CSV와 품질검사 CSV를 읽어 제조번호별 통합 품질 이력 리포트를 생성합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./print-report/index.html">
          <div class="module-icon">PDF</div>
          <h3>PDF 품질 리포트</h3>
          <p>
            제조번호별 품질검사 결과를 A4 출력용 리포트 화면으로 만들고 PDF로 저장합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./batch-generator/index.html">
          <div class="module-icon">BAT</div>
          <h3>제조 배치 기록 생성기</h3>
          <p>
            후배지 펠릿비료 제조번호, 원료 입고량, 제품 유형, 담당자 정보를 입력해
            제조 배치 기록서 Markdown 파일을 자동 생성합니다.
          </p>
          <span>열기 →</span>
        </a>
      </div>
    </section>

    <section class="module-section">
      <h2 class="module-section-title">영업·재고 관리 모듈</h2>
      <p class="module-section-text">농가 ROI 시뮬레이션, 재고·출하·거래처 통합 관리 모듈입니다.</p>
      <div class="module-grid">
        <a class="module-card" href="./farmer-roi-calculator/index.html">
          <div class="module-icon">ROI</div>
          <h3>농가 ROI 시뮬레이터</h3>
          <p>
            작물별 화학비료 비용과 Farmerstree 비료 적용 조건을 입력해 연간 절감액, 수익 증가,
            ROI 배수, 투자 회수 기간을 자동 계산하고 영업 문구를 생성합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./sales-manager/index.html">
          <div class="module-icon">INV</div>
          <h3>재고·출하·거래처 관리</h3>
          <p>
            로트별 재고 입고, 출하 등록, 거래처 납품 이력을 통합 관리합니다.
            월별 매출·재고 KPI, CSV 내보내기, JSON 백업을 지원합니다.
          </p>
          <span>열기 →</span>
        </a>
      </div>
    </section>

    <section class="module-section">
      <h2 class="module-section-title">Biochar·토양탄소 모듈</h2>
      <p class="module-section-text">SMS biochar 전환, 토양복원, 탄소저장 성과 관리 모듈입니다.</p>
      <div class="module-grid">
        <a class="module-card" href="./biochar-calculator/index.html">
          <div class="module-icon">BIO</div>
          <h3>SMS Biochar 계산기</h3>
          <p>
            후배지 일부를 biochar로 전환할 때 건조 중량, 탄화 수율, biochar 생산량,
            최종 혼합비와 포대당 추가 원가를 계산합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./biochar-quality-dashboard/index.html">
          <div class="module-icon">BQC</div>
          <h3>Biochar 품질검사</h3>
          <p>
            SMS biochar의 탄화 조건, 수분, pH, EC, 회분, 고정탄소, 중금속 검사 여부를
            기록하고 사용 가능성을 판정합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./biochar-lot-generator/index.html">
          <div class="module-icon">BLOT</div>
          <h3>Biochar 로트 생성기</h3>
          <p>
            SMS biochar 로트번호, 원료 후배지 제조번호, 탄화 조건, 품질검사 결과를 입력해
            로트 기록서를 자동 생성합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./soil-carbon-calculator/index.html">
          <div class="module-icon">CO₂</div>
          <h3>토양·탄소 리포트 계산기</h3>
          <p>
            SMS biochar 복합 펠릿비료의 투입량, 면적당 사용량, 추정 탄소저장량, CO₂e 환산량, 화학비료 절감량을 계산합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./biochar-dashboard/index.html">
          <div class="module-icon">PROC</div>
          <h3>Biochar 공정 대시보드</h3>
          <p>
            탄화 온도, 시간, 수분, 수율, pH, EC, 회분, 고정탄소, 냄새, 색상, 입도, 로트번호를
            기록하고 로트 품질 상태를 판정합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./soil-carbon-dashboard/index.html">
          <div class="module-icon">SOC</div>
          <h3>토양 탄소 대시보드</h3>
          <p>
            토양 유기탄소, pH, EC, 수분 보유력, 작물 수량, 화학비료 절감률, 탄소저장 추정량 변화를
            시험구 단위로 관리합니다.
          </p>
          <span>열기 →</span>
        </a>

        <a class="module-card" href="./carbon-report/index.html">
          <div class="module-icon">ESG</div>
          <h3>탄소 성과 리포트</h3>
          <p>
            후배지 재자원화량, biochar 생산량, 토양 투입량, 탄소저장 추정량을 기반으로 ESG 보고서용
            문장과 공공사업 제안서용 문장을 생성합니다.
          </p>
          <span>열기 →</span>
        </a>
      </div>
    </section>

    <section class="status-card">
      <h2>현재 플랫폼 구성</h2>

      <div class="status-list">
        <div>
          <strong>1단계</strong>
          <span>수익성 계산기 완료</span>
        </div>
        <div>
          <strong>2단계</strong>
          <span>배합 계산기 완료</span>
        </div>
        <div>
          <strong>3단계</strong>
          <span>품질검사·제조기록 문서 완료</span>
        </div>
        <div>
          <strong>4단계</strong>
          <span>발효 온도 대시보드 완료</span>
        </div>
        <div>
          <strong>5단계</strong>
          <span>품질검사 입력 대시보드 완료</span>
        </div>
        <div>
          <strong>6단계</strong>
          <span>메인 홈 화면 완료</span>
        </div>
        <div>
          <strong>7단계</strong>
          <span>SMS Biochar 계산기 완료</span>
        </div>
        <div>
          <strong>8단계</strong>
          <span>Biochar 공정 대시보드 완료</span>
        </div>
        <div>
          <strong>9단계</strong>
          <span>토양 탄소 대시보드 완료</span>
        </div>
        <div>
          <strong>10단계</strong>
          <span>탄소 성과 리포트 완료</span>
        </div>
        <div>
          <strong>11단계</strong>
          <span>Biochar 로트 기록 자동 생성기 완료</span>
        </div>
        <div>
          <strong>12단계</strong>
          <span>토양·탄소 리포트 계산기 완료</span>
        </div>
        <div>
          <strong>13단계</strong>
          <span>농가 ROI 시뮬레이터 완료</span>
        </div>
        <div>
          <strong>14단계</strong>
          <span>재고·출하·거래처 관리 완료</span>
        </div>
        <div>
          <strong>15단계</strong>
          <span>Biochar 품질검사 대시보드 완료</span>
        </div>
        <div>
          <strong>16단계</strong>
          <span>제조 배치 기록 자동 생성기 완료</span>
        </div>
      </div>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: print-report/app.js
```
const ids = [
  "batchId", "productName", "inspectionDate", "moisture", "ph", "ec", "cn", "gi", "breakage", "finalStatus", "reviewComment", "approver"
];

const inputs = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

const outputs = {
  batchId: document.getElementById("outBatchId"),
  productName: document.getElementById("outProductName"),
  inspectionDate: document.getElementById("outInspectionDate"),
  moisture: document.getElementById("outMoisture"),
  ph: document.getElementById("outPh"),
  ec: document.getElementById("outEc"),
  cn: document.getElementById("outCn"),
  gi: document.getElementById("outGi"),
  breakage: document.getElementById("outBreakage"),
  finalStatus: document.getElementById("outFinalStatus"),
  reviewComment: document.getElementById("outReviewComment"),
  approver: document.getElementById("outApprover"),
};

const generateBtn = document.getElementById("generateBtn");
const printBtn = document.getElementById("printBtn");

function today() {
  return new Date().toISOString().slice(0, 10);
}

inputs.inspectionDate.value = today();

function generateReport() {
  outputs.batchId.textContent = inputs.batchId.value.trim();
  outputs.productName.textContent = inputs.productName.value.trim();
  outputs.inspectionDate.textContent = inputs.inspectionDate.value;
  outputs.moisture.textContent = `${inputs.moisture.value}%`;
  outputs.ph.textContent = inputs.ph.value;
  outputs.ec.textContent = inputs.ec.value;
  outputs.cn.textContent = inputs.cn.value;
  outputs.gi.textContent = inputs.gi.value;
  outputs.breakage.textContent = `${inputs.breakage.value}%`;
  outputs.finalStatus.textContent = inputs.finalStatus.value;
  outputs.reviewComment.textContent = inputs.reviewComment.value.trim();
  outputs.approver.textContent = inputs.approver.value.trim();
}

generateBtn.addEventListener("click", generateReport);
printBtn.addEventListener("click", () => {
  generateReport();
  window.print();
});

generateReport();

```

---
## FILE: print-report/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 성적서 출력</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="card no-print">
      <h1>성적서 PDF 출력</h1>
      <p class="desc">아래 항목을 입력한 후 성적서 생성 버튼을 누르면 출력용 화면이 만들어집니다.</p>

      <div class="form-grid">
        <label>제조번호<input id="batchId" type="text" value="FT-FERT-20260429-001" /></label>
        <label>제품명<input id="productName" type="text" value="후배지 고부숙 펠릿비료" /></label>
        <label>검사일<input id="inspectionDate" type="date" /></label>
        <label>수분(%)<input id="moisture" type="number" step="0.1" value="18" /></label>
        <label>pH<input id="ph" type="number" step="0.1" value="7.2" /></label>
        <label>EC<input id="ec" type="number" step="0.1" value="2.5" /></label>
        <label>C/N<input id="cn" type="number" step="0.1" value="20" /></label>
        <label>발아지수<input id="gi" type="number" step="1" value="85" /></label>
        <label>펠릿 파손율(%)<input id="breakage" type="number" step="0.1" value="5" /></label>
        <label>최종 판정
          <select id="finalStatus">
            <option>출하 가능</option>
            <option>조건부 출하</option>
            <option>추가 후숙 필요</option>
            <option>재건조 필요</option>
            <option>출하 불가</option>
          </select>
        </label>
        <label class="wide">검토 의견<textarea id="reviewComment" rows="3">기준 범위 내 품질로 출하 가능</textarea></label>
        <label>승인자<input id="approver" type="text" value="품질관리책임자" /></label>
      </div>

      <div class="actions">
        <button id="generateBtn">출력용 화면 생성</button>
        <button id="printBtn">브라우저 인쇄</button>
      </div>
    </section>

    <section id="reportSheet" class="sheet">
      <header class="sheet-header">
        <h2>Farmerstree 품질 성적서</h2>
        <p>FARMERSTREE FERTILIZER PLATFORM</p>
      </header>

      <table>
        <tbody>
          <tr><th>제조번호</th><td id="outBatchId"></td><th>제품명</th><td id="outProductName"></td></tr>
          <tr><th>검사일</th><td id="outInspectionDate"></td><th>승인자</th><td id="outApprover"></td></tr>
          <tr><th>수분</th><td id="outMoisture"></td><th>pH</th><td id="outPh"></td></tr>
          <tr><th>EC</th><td id="outEc"></td><th>C/N</th><td id="outCn"></td></tr>
          <tr><th>발아지수</th><td id="outGi"></td><th>펠릿 파손율</th><td id="outBreakage"></td></tr>
          <tr><th>최종 판정</th><td colspan="3" id="outFinalStatus" class="status"></td></tr>
          <tr><th>검토 의견</th><td colspan="3" id="outReviewComment"></td></tr>
        </tbody>
      </table>

      <footer class="sheet-footer">
        <p>본 성적서는 입력된 검사값을 기준으로 자동 작성되었습니다.</p>
      </footer>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: print-report/style.css
```
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
  background: #eef1e8;
  color: #1d281f;
}
.container {
  width: min(1080px, 92vw);
  margin: 0 auto;
  padding: 28px 0 56px;
}
.card {
  background: #fff;
  border: 1px solid #d4dfcf;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}
h1 { margin: 0 0 8px; font-size: 30px; }
.desc { margin: 0 0 16px; color: #4e5d50; }
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
}
label.wide { grid-column: 1 / -1; }
input, select, textarea {
  border: 1px solid #bfcab9;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 15px;
  background: #fbfcfa;
}
.actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}
button {
  border: none;
  border-radius: 10px;
  padding: 11px 15px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  background: #4f7541;
  color: #fff;
}
.sheet {
  background: #fff;
  border: 2px solid #2f4c34;
  border-radius: 10px;
  padding: 24px;
}
.sheet-header {
  border-bottom: 2px solid #cfd9ca;
  margin-bottom: 14px;
  padding-bottom: 10px;
}
.sheet-header h2 {
  margin: 0;
  font-size: 28px;
}
.sheet-header p {
  margin: 4px 0 0;
  color: #466049;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #c6d3c1;
  padding: 10px;
  text-align: left;
  vertical-align: top;
}
th {
  width: 18%;
  background: #eef5ea;
}
.status {
  font-weight: 900;
  font-size: 18px;
}
.sheet-footer {
  margin-top: 14px;
  font-size: 12px;
  color: #576a59;
}
@media print {
  body { background: #fff; }
  .no-print { display: none; }
  .container { width: 100%; padding: 0; }
  .sheet { border: none; border-radius: 0; padding: 0; }
}
@media (max-width: 800px) {
  .form-grid { grid-template-columns: 1fr; }
}

```

---
## FILE: qc/batch_record_template.md
```
# Farmerstree 후배지 펠릿비료 제조 배치 기록서

## 1. 배치 기본 정보

| 항목 | 내용 |
|---|---|
| 제조번호 | FT-FERT-YYYYMMDD-001 |
| 제조일자 |  |
| 제조장소 |  |
| 담당자 |  |
| 제품 유형 | 일반형 / 프리미엄형 / 저염형 |
| 목표 제품명 | 후배지 고부숙 펠릿비료 |
| 포장 단위 | 20kg |
| 목표 생산량 | 포 |
| 실제 생산량 | 포 |
| 출하 예정일 |  |

---

## 2. 원료 입고 기록

| 항목 | 내용 |
|---|---|
| 후배지 공급처 |  |
| 버섯 종류 | 느타리 / 새송이 / 표고 / 양송이 / 혼합 |
| 입고일시 |  |
| 입고량 | kg |
| 수거 후 경과시간 | 시간 |
| 입고 시 냄새 | 정상 / 약한 발효취 / 암모니아취 / 부패취 |
| 입고 시 색상 | 갈색 / 암갈색 / 검은색 / 기타 |
| 입고 시 수분 | % |
| 입고 시 pH |  |
| 입고 시 EC |  |
| 이물질 여부 | 없음 / 있음 |
| 이물질 내용 |  |
| 원료 사용 판정 | 사용 / 조건부 사용 / 보류 / 폐기 |

---

## 3. 선별·파쇄 기록

| 항목 | 내용 |
|---|---|
| 선별일시 |  |
| 제거한 이물질 | 비닐 / 끈 / 플라스틱 / 금속 / 돌 / 병든 잔사 / 기타 |
| 제거량 | kg |
| 파쇄 장비 |  |
| 파쇄 목표 크기 | 20~50mm |
| 파쇄 후 상태 | 균일 / 일부 덩어리 있음 / 재파쇄 필요 |
| 담당자 |  |

---

## 4. 염류관리 기록

| 항목 | 내용 |
|---|---|
| 측정일시 |  |
| 측정 방식 | 1:5 추출 / 1:10 추출 / 기타 |
| 후배지 pH |  |
| 후배지 EC |  |
| 후배지 수분 | % |
| 염류 판정 | 낮음 / 중간 / 높음 / 매우 높음 |
| 수행 조치 | 조치 없음 / 흡착재 투입 / 저염 원료 희석 / 세척·탈수 / 혼합비 제한 |
| 투입 흡착재 | 제올라이트 / 바이오차 / 왕겨숯 / 기타 |
| 투입량 | kg |
| 재측정 pH |  |
| 재측정 EC |  |
| 재측정 수분 | % |

---

## 5. 배합 기록

| 원료 | 계획 투입량 | 실제 투입량 | 비고 |
|---|---:|---:|---|
| 버섯 후배지 | kg | kg |  |
| 발효계분 또는 계분퇴비 | kg | kg |  |
| 유박 또는 깻묵 | kg | kg |  |
| 미강 | kg | kg |  |
| 제올라이트 | kg | kg |  |
| 바이오차 또는 왕겨숯 | kg | kg |  |
| 석고 | kg | kg |  |
| 당밀 | kg | kg |  |
| 기능성 미생물제 | kg | kg | 후접종 |
| 기타 | kg | kg |  |

## 배합 후 측정값

| 항목 | 목표 | 실제 | 판정 |
|---|---:|---:|---|
| 수분 | 55~60% |  | 적합 / 부적합 |
| pH | 6.5~7.5 |  | 적합 / 부적합 |
| C/N | 25~30 |  | 적합 / 부적합 |
| 냄새 | 부패취 없음 |  | 적합 / 부적합 |
| 통기성 | 양호 |  | 적합 / 부적합 |

---

## 6. 고온부숙 기록

| 항목 | 내용 |
|---|---|
| 부숙 시작일 |  |
| 부숙 종료일 |  |
| 더미 높이 | m |
| 더미 폭 | m |
| 통기 방식 | 자연통기 / 뒤집기 / 강제송풍 |
| 목표 온도 | 55~65℃ |
| 고온 유지 목표 | 7~14일 |
| 실제 고온 유지 기간 | 일 |
| 뒤집기 횟수 | 회 |
| 문제 발생 | 없음 / 과열 / 발열 부족 / 부패취 / 암모니아취 / 과습 / 건조 |

## 고온부숙 일별 온도 기록

| 일차 | 오전 온도 | 오후 온도 | 냄새 | 수분 상태 | 조치 |
|---:|---:|---:|---|---|---|
| 1 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 2 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 3 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 4 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 5 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 6 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 7 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 8 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 9 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 10 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 11 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 12 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 13 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 14 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |

---

## 7. 후숙 기록

| 항목 | 내용 |
|---|---|
| 후숙 시작일 |  |
| 후숙 종료일 |  |
| 후숙 기간 | 일 |
| 평균 온도 | ℃ |
| 수분 상태 | 적정 / 과습 / 건조 |
| 뒤집기 횟수 | 회 |
| 암모니아취 | 없음 / 약함 / 강함 |
| 부패취 | 없음 / 약함 / 강함 |
| 색상 | 갈색 / 암갈색 / 기타 |
| 촉감 | 부슬부슬 / 끈적임 / 덩어리 많음 |
| 후숙 판정 | 완료 / 추가 후숙 필요 / 재부숙 필요 |

---

## 8. 기능성 미생물 접종 기록

| 항목 | 내용 |
|---|---|
| 접종일시 |  |
| 접종 전 원료 온도 | ℃ |
| 접종 전 수분 | % |
| 미생물제 종류 | Bacillus / Lactobacillus / 효모 / 복합 |
| 미생물제 제품명 또는 균주명 |  |
| 미생물제 투입량 | kg |
| 당밀 투입량 | kg |
| 희석수량 | L |
| 분무 방식 | 수동 / 분무기 / 혼합기 |
| 안정화 발효 기간 | 일 |
| 접종 후 냄새 | 정상 / 산취 / 암모니아취 / 부패취 |
| 접종 판정 | 적합 / 조건부 / 부적합 |

---

## 9. 건조·분쇄·펠릿화 기록

| 항목 | 내용 |
|---|---|
| 건조 시작일 |  |
| 건조 방식 | 자연건조 / 열풍건조 / 저온건조 |
| 건조 온도 | ℃ |
| 건조 후 수분 | % |
| 분쇄 입도 | mm |
| 펠릿 성형일 |  |
| 펠릿기 모델 |  |
| 펠릿 직경 | mm |
| 펠릿 길이 | mm |
| 펠릿 전 수분 | % |
| 펠릿 후 수분 | % |
| 냉각 수행 | 예 / 아니오 |
| 재건조 수행 | 예 / 아니오 |
| 파손율 | % |
| 분진 발생 | 낮음 / 중간 / 높음 |
| 펠릿화 판정 | 적합 / 조건부 / 부적합 |

---

## 10. 최종 품질검사 기록

| 검사 항목 | 목표 기준 | 측정값 | 판정 |
|---|---:|---:|---|
| 수분 | 15~20% 권장 |  | 적합 / 부적합 |
| pH | 6.5~8.0 |  | 적합 / 부적합 |
| EC | 작물별 기준에 맞게 관리 |  | 적합 / 주의 / 부적합 |
| 유기물 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 총질소 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 인산 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 칼리 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| C/N | 15~25 권장 |  | 적합 / 주의 / 부적합 |
| 부숙도 | 미숙취·발열 없음 |  | 적합 / 부적합 |
| 발아지수 | 70 이상, 가능하면 80 이상 |  | 적합 / 부적합 |
| 병원성 미생물 | 기준 이내 |  | 적합 / 부적합 |
| 중금속 | 기준 이내 |  | 적합 / 부적합 |
| 악취 | 암모니아취·부패취 없음 |  | 적합 / 부적합 |
| 이물질 | 육안상 없어야 함 |  | 적합 / 부적합 |
| 포장 후 곰팡이 재발 | 없어야 함 |  | 적합 / 부적합 |

---

## 11. 포장 및 출하 기록

| 항목 | 내용 |
|---|---|
| 포장일 |  |
| 포장 단위 | 20kg / 10kg / 5kg |
| 포장 수량 | 포 |
| 실제 총중량 | kg |
| 제품명 |  |
| 로트번호 표시 | 예 / 아니오 |
| 보관 장소 |  |
| 출하 가능 여부 | 가능 / 조건부 / 불가 |
| 출하일 |  |
| 납품처 |  |

---

## 12. 최종 판정

- [ ] 출하 가능
- [ ] 재건조 후 출하 가능
- [ ] 추가 후숙 후 재검사
- [ ] 재부숙 필요
- [ ] 원료 또는 제품 사용 제한
- [ ] 폐기 또는 별도 처리

```

---
## FILE: qc/batches/FT-FERT-20260429-001.md
```
# Farmerstree 후배지 펠릿비료 제조 배치 기록서

## 1. 배치 기본 정보

| 항목 | 내용 |
|---|---|
| 제조번호 | FT-FERT-YYYYMMDD-001 |
| 제조일자 |  |
| 제조장소 |  |
| 담당자 |  |
| 제품 유형 | 일반형 / 프리미엄형 / 저염형 |
| 목표 제품명 | 후배지 고부숙 펠릿비료 |
| 포장 단위 | 20kg |
| 목표 생산량 | 포 |
| 실제 생산량 | 포 |
| 출하 예정일 |  |

---

## 2. 원료 입고 기록

| 항목 | 내용 |
|---|---|
| 후배지 공급처 |  |
| 버섯 종류 | 느타리 / 새송이 / 표고 / 양송이 / 혼합 |
| 입고일시 |  |
| 입고량 | kg |
| 수거 후 경과시간 | 시간 |
| 입고 시 냄새 | 정상 / 약한 발효취 / 암모니아취 / 부패취 |
| 입고 시 색상 | 갈색 / 암갈색 / 검은색 / 기타 |
| 입고 시 수분 | % |
| 입고 시 pH |  |
| 입고 시 EC |  |
| 이물질 여부 | 없음 / 있음 |
| 이물질 내용 |  |
| 원료 사용 판정 | 사용 / 조건부 사용 / 보류 / 폐기 |

---

## 3. 선별·파쇄 기록

| 항목 | 내용 |
|---|---|
| 선별일시 |  |
| 제거한 이물질 | 비닐 / 끈 / 플라스틱 / 금속 / 돌 / 병든 잔사 / 기타 |
| 제거량 | kg |
| 파쇄 장비 |  |
| 파쇄 목표 크기 | 20~50mm |
| 파쇄 후 상태 | 균일 / 일부 덩어리 있음 / 재파쇄 필요 |
| 담당자 |  |

---

## 4. 염류관리 기록

| 항목 | 내용 |
|---|---|
| 측정일시 |  |
| 측정 방식 | 1:5 추출 / 1:10 추출 / 기타 |
| 후배지 pH |  |
| 후배지 EC |  |
| 후배지 수분 | % |
| 염류 판정 | 낮음 / 중간 / 높음 / 매우 높음 |
| 수행 조치 | 조치 없음 / 흡착재 투입 / 저염 원료 희석 / 세척·탈수 / 혼합비 제한 |
| 투입 흡착재 | 제올라이트 / 바이오차 / 왕겨숯 / 기타 |
| 투입량 | kg |
| 재측정 pH |  |
| 재측정 EC |  |
| 재측정 수분 | % |

---

## 5. 배합 기록

| 원료 | 계획 투입량 | 실제 투입량 | 비고 |
|---|---:|---:|---|
| 버섯 후배지 | kg | kg |  |
| 발효계분 또는 계분퇴비 | kg | kg |  |
| 유박 또는 깻묵 | kg | kg |  |
| 미강 | kg | kg |  |
| 제올라이트 | kg | kg |  |
| 바이오차 또는 왕겨숯 | kg | kg |  |
| 석고 | kg | kg |  |
| 당밀 | kg | kg |  |
| 기능성 미생물제 | kg | kg | 후접종 |
| 기타 | kg | kg |  |

## 배합 후 측정값

| 항목 | 목표 | 실제 | 판정 |
|---|---:|---:|---|
| 수분 | 55~60% |  | 적합 / 부적합 |
| pH | 6.5~7.5 |  | 적합 / 부적합 |
| C/N | 25~30 |  | 적합 / 부적합 |
| 냄새 | 부패취 없음 |  | 적합 / 부적합 |
| 통기성 | 양호 |  | 적합 / 부적합 |

---

## 6. 고온부숙 기록

| 항목 | 내용 |
|---|---|
| 부숙 시작일 |  |
| 부숙 종료일 |  |
| 더미 높이 | m |
| 더미 폭 | m |
| 통기 방식 | 자연통기 / 뒤집기 / 강제송풍 |
| 목표 온도 | 55~65℃ |
| 고온 유지 목표 | 7~14일 |
| 실제 고온 유지 기간 | 일 |
| 뒤집기 횟수 | 회 |
| 문제 발생 | 없음 / 과열 / 발열 부족 / 부패취 / 암모니아취 / 과습 / 건조 |

## 고온부숙 일별 온도 기록

| 일차 | 오전 온도 | 오후 온도 | 냄새 | 수분 상태 | 조치 |
|---:|---:|---:|---|---|---|
| 1 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 2 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 3 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 4 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 5 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 6 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 7 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 8 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 9 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 10 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 11 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 12 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 13 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |
| 14 | ℃ | ℃ | 정상 / 암모니아 / 부패취 | 적정 / 과습 / 건조 |  |

---

## 7. 후숙 기록

| 항목 | 내용 |
|---|---|
| 후숙 시작일 |  |
| 후숙 종료일 |  |
| 후숙 기간 | 일 |
| 평균 온도 | ℃ |
| 수분 상태 | 적정 / 과습 / 건조 |
| 뒤집기 횟수 | 회 |
| 암모니아취 | 없음 / 약함 / 강함 |
| 부패취 | 없음 / 약함 / 강함 |
| 색상 | 갈색 / 암갈색 / 기타 |
| 촉감 | 부슬부슬 / 끈적임 / 덩어리 많음 |
| 후숙 판정 | 완료 / 추가 후숙 필요 / 재부숙 필요 |

---

## 8. 기능성 미생물 접종 기록

| 항목 | 내용 |
|---|---|
| 접종일시 |  |
| 접종 전 원료 온도 | ℃ |
| 접종 전 수분 | % |
| 미생물제 종류 | Bacillus / Lactobacillus / 효모 / 복합 |
| 미생물제 제품명 또는 균주명 |  |
| 미생물제 투입량 | kg |
| 당밀 투입량 | kg |
| 희석수량 | L |
| 분무 방식 | 수동 / 분무기 / 혼합기 |
| 안정화 발효 기간 | 일 |
| 접종 후 냄새 | 정상 / 산취 / 암모니아취 / 부패취 |
| 접종 판정 | 적합 / 조건부 / 부적합 |

---

## 9. 건조·분쇄·펠릿화 기록

| 항목 | 내용 |
|---|---|
| 건조 시작일 |  |
| 건조 방식 | 자연건조 / 열풍건조 / 저온건조 |
| 건조 온도 | ℃ |
| 건조 후 수분 | % |
| 분쇄 입도 | mm |
| 펠릿 성형일 |  |
| 펠릿기 모델 |  |
| 펠릿 직경 | mm |
| 펠릿 길이 | mm |
| 펠릿 전 수분 | % |
| 펠릿 후 수분 | % |
| 냉각 수행 | 예 / 아니오 |
| 재건조 수행 | 예 / 아니오 |
| 파손율 | % |
| 분진 발생 | 낮음 / 중간 / 높음 |
| 펠릿화 판정 | 적합 / 조건부 / 부적합 |

---

## 10. 최종 품질검사 기록

| 검사 항목 | 목표 기준 | 측정값 | 판정 |
|---|---:|---:|---|
| 수분 | 15~20% 권장 |  | 적합 / 부적합 |
| pH | 6.5~8.0 |  | 적합 / 부적합 |
| EC | 작물별 기준에 맞게 관리 |  | 적합 / 주의 / 부적합 |
| 유기물 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 총질소 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 인산 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 칼리 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| C/N | 15~25 권장 |  | 적합 / 주의 / 부적합 |
| 부숙도 | 미숙취·발열 없음 |  | 적합 / 부적합 |
| 발아지수 | 70 이상, 가능하면 80 이상 |  | 적합 / 부적합 |
| 병원성 미생물 | 기준 이내 |  | 적합 / 부적합 |
| 중금속 | 기준 이내 |  | 적합 / 부적합 |
| 악취 | 암모니아취·부패취 없음 |  | 적합 / 부적합 |
| 이물질 | 육안상 없어야 함 |  | 적합 / 부적합 |
| 포장 후 곰팡이 재발 | 없어야 함 |  | 적합 / 부적합 |

---

## 11. 포장 및 출하 기록

| 항목 | 내용 |
|---|---|
| 포장일 |  |
| 포장 단위 | 20kg / 10kg / 5kg |
| 포장 수량 | 포 |
| 실제 총중량 | kg |
| 제품명 |  |
| 로트번호 표시 | 예 / 아니오 |
| 보관 장소 |  |
| 출하 가능 여부 | 가능 / 조건부 / 불가 |
| 출하일 |  |
| 납품처 |  |

---

## 12. 최종 판정

- [ ] 출하 가능
- [ ] 재건조 후 출하 가능
- [ ] 추가 후숙 후 재검사
- [ ] 재부숙 필요
- [ ] 원료 또는 제품 사용 제한
- [ ] 폐기 또는 별도 처리

```

---
## FILE: qc/qc_checklist.md
```
# Farmerstree 후배지 펠릿비료 품질검사 체크리스트

## 1. 문서 목적

본 체크리스트는 버섯 후배지를 이용한 기능성 펠릿비료 제조 과정에서 원료, 발효, 후숙, 미생물 접종, 펠릿화 및 출하 전 품질을 확인하기 위한 현장용 품질관리 문서이다.

본 공정은 다음 8단계를 기준으로 한다.

1. 후배지 원료관리
2. 염류관리
3. C/N 보정
4. 고온부숙
5. 후숙
6. 기능성 미생물 접종
7. 펠릿화
8. 품질검사

---

## 2. 제조번호 기본 정보

| 항목 | 기록 |
|---|---|
| 제조번호 | FT-FERT-YYYYMMDD-001 |
| 제조일자 |  |
| 담당자 |  |
| 원료 입고 장소 |  |
| 후배지 종류 | 느타리 / 새송이 / 표고 / 양송이 / 혼합 |
| 후배지 입고량 | kg |
| 목표 제품 | 일반형 / 프리미엄형 / 저염형 |
| 목표 포장 단위 | 20kg / 10kg / 5kg / 기타 |
| 예상 생산량 | 포 |

---

## 3. 후배지 원료관리 체크

| 점검 항목 | 기준 | 결과 | 판정 |
|---|---|---|---|
| 수거 시점 | 수확 종료 후 24~48시간 이내 |  | 적합 / 부적합 |
| 비닐·끈·플라스틱 혼입 | 없어야 함 |  | 적합 / 부적합 |
| 금속·돌 혼입 | 없어야 함 |  | 적합 / 부적합 |
| 부패취 | 강한 부패취 없어야 함 |  | 적합 / 부적합 |
| 암모니아취 | 강한 암모니아취 없어야 함 |  | 적합 / 부적합 |
| 해충 발생 | 다발생 없어야 함 |  | 적합 / 부적합 |
| 과습 덩어리 | 과도한 점액질 없어야 함 |  | 적합 / 부적합 |
| 파쇄 상태 | 20~50mm 이하 권장 |  | 적합 / 부적합 |

---

## 4. 염류관리 체크

| 점검 항목 | 목표 또는 기준 | 측정값 | 판정 |
|---|---:|---:|---|
| 후배지 수분 | 55~70% 범위 확인 |  | 적합 / 주의 / 부적합 |
| 후배지 pH | 5.5~8.0 범위 확인 |  | 적합 / 주의 / 부적합 |
| 후배지 EC | 작물 사용 목적에 따라 관리 |  | 적합 / 주의 / 부적합 |
| 염류 저감 조치 | 필요 시 수행 |  | 수행 / 미수행 |
| 흡착재 투입 | 제올라이트·바이오차 등 |  | 수행 / 미수행 |
| 저염 원료 희석 | 왕겨·톱밥·코코피트 등 |  | 수행 / 미수행 |

---

## 5. C/N 보정 및 배합 체크

| 원료 | 계획 투입량 | 실제 투입량 | 확인 |
|---|---:|---:|---|
| 버섯 후배지 | kg | kg | □ |
| 발효계분 또는 계분퇴비 | kg | kg | □ |
| 유박 또는 깻묵 | kg | kg | □ |
| 미강 | kg | kg | □ |
| 제올라이트 | kg | kg | □ |
| 바이오차 또는 왕겨숯 | kg | kg | □ |
| 석고 | kg | kg | □ |
| 당밀 | kg | kg | □ |
| 기능성 미생물제 | kg | kg | □ |
| 기타 | kg | kg | □ |

## 배합 목표값

| 항목 | 목표 | 실제 | 판정 |
|---|---:|---:|---|
| 초기 수분 | 55~60% |  | 적합 / 부적합 |
| 초기 pH | 6.5~7.5 |  | 적합 / 부적합 |
| 초기 C/N | 25~30 |  | 적합 / 부적합 |
| 통기성 | 손으로 쥐면 뭉치되 물이 흐르지 않음 |  | 적합 / 부적합 |
| 냄새 | 부패취 없음 |  | 적합 / 부적합 |

---

## 6. 고온부숙 체크

| 점검 항목 | 기준 | 결과 | 판정 |
|---|---|---|---|
| 고온 도달 | 배합 후 1~3일 내 55℃ 근접 |  | 적합 / 주의 / 부적합 |
| 핵심 온도 | 55~65℃ |  | 적합 / 주의 / 부적합 |
| 고온 유지 기간 | 7~14일 |  | 적합 / 부적합 |
| 65℃ 초과 시 조치 | 뒤집기 또는 강제송풍 |  | 수행 / 미수행 |
| 45℃ 미만 지속 시 조치 | 수분·질소·통기 재조정 |  | 수행 / 미수행 |
| 부패취 발생 | 없어야 함 |  | 적합 / 부적합 |
| 암모니아취 발생 | 강하지 않아야 함 |  | 적합 / 주의 / 부적합 |

## 고온부숙 온도 기록

| 일자 | 오전 온도 | 오후 온도 | 조치 | 담당자 |
|---|---:|---:|---|---|
| 1일차 | ℃ | ℃ |  |  |
| 2일차 | ℃ | ℃ |  |  |
| 3일차 | ℃ | ℃ |  |  |
| 4일차 | ℃ | ℃ |  |  |
| 5일차 | ℃ | ℃ |  |  |
| 6일차 | ℃ | ℃ |  |  |
| 7일차 | ℃ | ℃ |  |  |
| 8일차 | ℃ | ℃ |  |  |
| 9일차 | ℃ | ℃ |  |  |
| 10일차 | ℃ | ℃ |  |  |
| 11일차 | ℃ | ℃ |  |  |
| 12일차 | ℃ | ℃ |  |  |
| 13일차 | ℃ | ℃ |  |  |
| 14일차 | ℃ | ℃ |  |  |

---

## 7. 후숙 체크

| 점검 항목 | 기준 | 결과 | 판정 |
|---|---|---|---|
| 후숙 기간 | 20~40일 |  | 적합 / 부적합 |
| 후숙 온도 | 25~45℃ |  | 적합 / 주의 / 부적합 |
| 후숙 수분 | 40~50% |  | 적합 / 주의 / 부적합 |
| 뒤집기 주기 | 5~7일 간격 |  | 적합 / 부적합 |
| 암모니아취 | 없어야 함 |  | 적합 / 부적합 |
| 부패취 | 없어야 함 |  | 적합 / 부적합 |
| 색상 | 갈색~암갈색 |  | 적합 / 부적합 |
| 촉감 | 부슬부슬하고 끈적임 적음 |  | 적합 / 부적합 |

---

## 8. 기능성 미생물 접종 체크

| 점검 항목 | 기준 | 결과 | 판정 |
|---|---|---|---|
| 접종 시 온도 | 40℃ 이하 |  | 적합 / 부적합 |
| 접종 시 수분 | 35~45% |  | 적합 / 주의 / 부적합 |
| 암모니아취 | 없어야 함 |  | 적합 / 부적합 |
| 미생물제 종류 | Bacillus / Lactobacillus / 효모 / 복합 |  | 확인 |
| 미생물제 투입량 | 계획량 준수 |  | 적합 / 부적합 |
| 당밀 희석액 | 필요 시 사용 |  | 사용 / 미사용 |
| 접종 후 안정화 기간 | 5~10일 |  | 적합 / 부적합 |

---

## 9. 펠릿화 체크

| 점검 항목 | 기준 | 결과 | 판정 |
|---|---|---|---|
| 펠릿 전 수분 | 18~25% |  | 적합 / 부적합 |
| 분쇄 입도 | 2~5mm |  | 적합 / 부적합 |
| 펠릿 직경 | 3~6mm |  | 적합 / 부적합 |
| 펠릿 길이 | 5~20mm |  | 적합 / 부적합 |
| 성형 상태 | 과도한 분진·파손 없음 |  | 적합 / 부적합 |
| 냉각 | 수행 |  | 수행 / 미수행 |
| 재건조 | 필요 시 수행 |  | 수행 / 미수행 |
| 최종 수분 | 15~20% 권장 |  | 적합 / 부적합 |

---

## 10. 최종 품질검사

| 검사 항목 | 목표 기준 | 측정값 | 판정 |
|---|---:|---:|---|
| 수분 | 펠릿 15~20% 권장 |  | 적합 / 부적합 |
| pH | 6.5~8.0 |  | 적합 / 부적합 |
| EC | 작물별 기준에 맞게 관리 |  | 적합 / 주의 / 부적합 |
| 유기물 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 총질소 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 인산 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| 칼리 | 제품 기준 설정 필요 |  | 적합 / 부적합 |
| C/N | 15~25 권장 |  | 적합 / 주의 / 부적합 |
| 부숙도 | 미숙취·발열 없음 |  | 적합 / 부적합 |
| 발아지수 | 70 이상, 가능하면 80 이상 |  | 적합 / 부적합 |
| 병원성 미생물 | 기준 이내 |  | 적합 / 부적합 |
| 중금속 | 기준 이내 |  | 적합 / 부적합 |
| 악취 | 암모니아취·부패취 없음 |  | 적합 / 부적합 |
| 이물질 | 육안상 없어야 함 |  | 적합 / 부적합 |
| 펠릿 파손율 | 낮을수록 좋음 |  | 적합 / 주의 / 부적합 |
| 포장 후 곰팡이 재발 | 없어야 함 |  | 적합 / 부적합 |

---

## 11. 출하 판정

| 항목 | 판정 |
|---|---|
| 원료관리 | 적합 / 조건부 / 부적합 |
| 염류관리 | 적합 / 조건부 / 부적합 |
| C/N 보정 | 적합 / 조건부 / 부적합 |
| 고온부숙 | 적합 / 조건부 / 부적합 |
| 후숙 | 적합 / 조건부 / 부적합 |
| 미생물 접종 | 적합 / 조건부 / 부적합 |
| 펠릿화 | 적합 / 조건부 / 부적합 |
| 최종 품질검사 | 적합 / 조건부 / 부적합 |

## 최종 판정

- [ ] 출하 가능
- [ ] 재건조 필요
- [ ] 추가 후숙 필요
- [ ] 재부숙 필요
- [ ] 사용 제한
- [ ] 폐기 또는 별도 처리

```

---
## FILE: quality-dashboard/app.js
```
const inputs = {
  batchId: document.getElementById("batchId"),
  productType: document.getElementById("productType"),
  inspectionDate: document.getElementById("inspectionDate"),
  moisture: document.getElementById("moisture"),
  ph: document.getElementById("ph"),
  ec: document.getElementById("ec"),
  organicMatter: document.getElementById("organicMatter"),
  totalNitrogen: document.getElementById("totalNitrogen"),
  phosphate: document.getElementById("phosphate"),
  potassium: document.getElementById("potassium"),
  cn: document.getElementById("cn"),
  gi: document.getElementById("gi"),
  breakage: document.getElementById("breakage"),
  odor: document.getElementById("odor"),
  mold: document.getElementById("mold"),
  foreignMatter: document.getElementById("foreignMatter"),
  maturity: document.getElementById("maturity"),
  pathogen: document.getElementById("pathogen"),
  heavyMetals: document.getElementById("heavyMetals"),
  ripeningDays: document.getElementById("ripeningDays"),
  ripeningTemp: document.getElementById("ripeningTemp"),
  ripeningMoisture: document.getElementById("ripeningMoisture"),
  turningInterval: document.getElementById("turningInterval"),
  colorState: document.getElementById("colorState"),
  textureState: document.getElementById("textureState"),
  pileDelta: document.getElementById("pileDelta"),
  inoculationTemp: document.getElementById("inoculationTemp"),
  inoculationMoisture: document.getElementById("inoculationMoisture"),
  inoculationAmmonia: document.getElementById("inoculationAmmonia"),
  inoculationTiming: document.getElementById("inoculationTiming"),
  stabilizationDays: document.getElementById("stabilizationDays"),
  strainMix: document.getElementById("strainMix"),
};

const outputs = {
  finalStatus: document.getElementById("finalStatus"),
  reasonList: document.getElementById("reasonList"),
  patentOverall: document.getElementById("patentOverall"),
  patentMetricList: document.getElementById("patentMetricList"),
  trendMetric: document.getElementById("trendMetric"),
  trendCanvas: document.getElementById("trendCanvas"),
  trendSummary: document.getElementById("trendSummary"),
  recordsTable: document.getElementById("recordsTable"),
};

const evaluateButton = document.getElementById("evaluateButton");
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");
const exportCsvButton = document.getElementById("exportCsvButton");

const STORAGE_KEY = "farmerstree-quality-records";

const PATENT_TARGETS = {
  ph: {
    key: "ph",
    label: "pH",
    passMin: 6.8,
    passMax: 7.6,
    warningMin: 6.4,
    warningMax: 8.0,
    unit: "",
  },
  totalNitrogen: {
    key: "totalNitrogen",
    label: "질소",
    passMin: 1.2,
    passMax: 2.2,
    warningMin: 0.8,
    warningMax: 2.8,
    unit: "%",
  },
  phosphate: {
    key: "phosphate",
    label: "인",
    passMin: 0.8,
    passMax: 2.0,
    warningMin: 0.4,
    warningMax: 2.5,
    unit: "%",
  },
  potassium: {
    key: "potassium",
    label: "칼륨",
    passMin: 0.8,
    passMax: 2.0,
    warningMin: 0.4,
    warningMax: 2.5,
    unit: "%",
  },
  cn: {
    key: "cn",
    label: "C/N",
    passMin: 15,
    passMax: 25,
    warningMin: 12,
    warningMax: 30,
    unit: "",
  },
};

const TREND_METRICS = {
  moisture: { label: "수분", unit: "%", decimals: 1 },
  ph: { label: "pH", unit: "", decimals: 2 },
  ec: { label: "EC", unit: "", decimals: 2 },
  totalNitrogen: { label: "총질소", unit: "%", decimals: 2 },
  phosphate: { label: "인산", unit: "%", decimals: 2 },
  potassium: { label: "칼리", unit: "%", decimals: 2 },
  cn: { label: "C/N", unit: "", decimals: 1 },
  gi: { label: "발아지수", unit: "", decimals: 1 },
  breakage: { label: "파손율", unit: "%", decimals: 1 },
};

let currentEvaluation = null;
let records = loadRecords();

function todayString() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

inputs.inspectionDate.value = todayString();

function toNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function productTypeLabel(value) {
  const labels = {
    standard: "일반형",
    premium: "프리미엄형",
    lowSalt: "저염형",
  };

  return labels[value] || value;
}

function loadRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveRecordsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getInputData() {
  return {
    id: Date.now(),
    batchId: inputs.batchId.value.trim() || "미지정",
    productType: inputs.productType.value,
    inspectionDate: inputs.inspectionDate.value || todayString(),
    moisture: toNumber(inputs.moisture),
    ph: toNumber(inputs.ph),
    ec: toNumber(inputs.ec),
    organicMatter: toNumber(inputs.organicMatter),
    totalNitrogen: toNumber(inputs.totalNitrogen),
    phosphate: toNumber(inputs.phosphate),
    potassium: toNumber(inputs.potassium),
    cn: toNumber(inputs.cn),
    gi: toNumber(inputs.gi),
    breakage: toNumber(inputs.breakage),
    odor: inputs.odor.value,
    mold: inputs.mold.value,
    foreignMatter: inputs.foreignMatter.value,
    maturity: inputs.maturity.value,
    pathogen: inputs.pathogen.value,
    heavyMetals: inputs.heavyMetals.value,
    ripeningDays: toNumber(inputs.ripeningDays),
    ripeningTemp: toNumber(inputs.ripeningTemp),
    ripeningMoisture: toNumber(inputs.ripeningMoisture),
    turningInterval: toNumber(inputs.turningInterval),
    colorState: inputs.colorState.value,
    textureState: inputs.textureState.value,
    pileDelta: toNumber(inputs.pileDelta),
    inoculationTemp: toNumber(inputs.inoculationTemp),
    inoculationMoisture: toNumber(inputs.inoculationMoisture),
    inoculationAmmonia: inputs.inoculationAmmonia.value,
    inoculationTiming: inputs.inoculationTiming.value,
    stabilizationDays: toNumber(inputs.stabilizationDays),
    strainMix: inputs.strainMix.value.trim(),
  };
}

function evaluateQuality(data) {
  const reasons = [];
  let dangerCount = 0;
  let warnCount = 0;

  function add(level, text) {
    reasons.push({ level, text });
    if (level === "danger") dangerCount += 1;
    if (level === "warn") warnCount += 1;
  }

  if (data.moisture > 25) {
    add("danger", `수분 ${data.moisture}%: 25% 초과로 포장 후 곰팡이·부패 위험이 큽니다. 재건조가 필요합니다.`);
  } else if (data.moisture > 20) {
    add("warn", `수분 ${data.moisture}%: 권장 범위보다 높습니다. 재건조 또는 추가 안정화가 필요할 수 있습니다.`);
  } else if (data.moisture < 12) {
    add("warn", `수분 ${data.moisture}%: 너무 낮으면 펠릿 파손과 분진이 증가할 수 있습니다.`);
  } else {
    add("good", `수분 ${data.moisture}%: 펠릿 제품 기준으로 양호합니다.`);
  }

  if (data.ph < 6.5 || data.ph > 8.0) {
    add("warn", `pH ${data.ph}: 권장 범위 6.5~8.0을 벗어났습니다. 작물별 사용 제한 검토가 필요합니다.`);
  } else {
    add("good", `pH ${data.ph}: 권장 범위입니다.`);
  }

  if (data.ec > 5.0) {
    add("danger", `EC ${data.ec}: 염류장해 위험이 큽니다. 저염 원료와 희석하거나 사용 작물을 제한해야 합니다.`);
  } else if (data.ec > 4.0) {
    add("warn", `EC ${data.ec}: 염류가 높은 편입니다. 민감작물·육묘용 사용은 피하는 것이 좋습니다.`);
  } else if (data.ec > 3.0 && data.productType === "lowSalt") {
    add("warn", `EC ${data.ec}: 저염형 제품으로는 높은 편입니다. 저염형 출하 기준을 재검토하세요.`);
  } else {
    add("good", `EC ${data.ec}: 현재 기준상 사용 가능합니다.`);
  }

  if (data.organicMatter > 0) {
    add("good", `유기물 ${data.organicMatter}%: 입력되었습니다. 제품 기준과 비교 확인이 필요합니다.`);
  } else {
    add("warn", "유기물 값이 입력되지 않았습니다. 품질기준 비교를 위해 측정값 입력이 필요합니다.");
  }

  if (data.totalNitrogen > 0) {
    add("good", `총질소 ${data.totalNitrogen}%: 입력되었습니다. 제품 기준과 비교 확인이 필요합니다.`);
  } else {
    add("warn", "총질소 값이 입력되지 않았습니다. 품질기준 비교를 위해 측정값 입력이 필요합니다.");
  }

  if (data.phosphate > 0) {
    add("good", `인산 ${data.phosphate}%: 입력되었습니다. 제품 기준과 비교 확인이 필요합니다.`);
  } else {
    add("warn", "인산 값이 입력되지 않았습니다. 품질기준 비교를 위해 측정값 입력이 필요합니다.");
  }

  if (data.potassium > 0) {
    add("good", `칼리 ${data.potassium}%: 입력되었습니다. 제품 기준과 비교 확인이 필요합니다.`);
  } else {
    add("warn", "칼리 값이 입력되지 않았습니다. 품질기준 비교를 위해 측정값 입력이 필요합니다.");
  }

  if (data.cn < 12) {
    add("warn", `C/N ${data.cn}: 낮은 편입니다. 질소 휘산·암모니아취 여부를 확인하세요.`);
  } else if (data.cn > 30) {
    add("warn", `C/N ${data.cn}: 높은 편입니다. 질소기아 가능성이 있어 추가 후숙 또는 질소 보정 검토가 필요합니다.`);
  } else if (data.cn > 25) {
    add("warn", `C/N ${data.cn}: 권장 상한에 가깝습니다. 후숙 안정성을 확인하세요.`);
  } else {
    add("good", `C/N ${data.cn}: 권장 범위입니다.`);
  }

  if (data.gi < 50) {
    add("danger", `발아지수 ${data.gi}: 식물 독성 가능성이 큽니다. 출하하지 말고 재부숙해야 합니다.`);
  } else if (data.gi < 70) {
    add("danger", `발아지수 ${data.gi}: 최소 기준 미달입니다. 추가 후숙 또는 재부숙이 필요합니다.`);
  } else if (data.gi < 80) {
    add("warn", `발아지수 ${data.gi}: 출하 가능성은 있으나 프리미엄 제품 기준으로는 부족합니다.`);
  } else {
    add("good", `발아지수 ${data.gi}: 양호합니다.`);
  }

  if (data.breakage > 20) {
    add("danger", `펠릿 파손율 ${data.breakage}%: 제품성이 낮습니다. 수분·결착·성형 조건을 재조정해야 합니다.`);
  } else if (data.breakage > 10) {
    add("warn", `펠릿 파손율 ${data.breakage}%: 다소 높습니다. 포장·운송 클레임 가능성이 있습니다.`);
  } else {
    add("good", `펠릿 파손율 ${data.breakage}%: 양호합니다.`);
  }

  if (data.odor === "rot") {
    add("danger", "부패취 확인: 혐기성 부패 가능성이 있습니다. 출하 금지, 재부숙 필요.");
  } else if (data.odor === "ammonia") {
    add("danger", "암모니아취 확인: 미숙 또는 질소 과다 가능성이 있습니다. 추가 후숙 또는 재부숙 필요.");
  } else if (data.odor === "sour") {
    add("warn", "강한 산취 확인: 유기산 잔류 가능성이 있습니다. 추가 후숙 후 재검사하세요.");
  } else {
    add("good", "냄새 상태: 흙냄새 또는 정상 범위입니다.");
  }

  if (data.mold === "high") {
    add("danger", "포장 후 곰팡이 재발 많음: 수분 과다 또는 후숙 부족입니다. 재건조·추가 후숙 필요.");
  } else if (data.mold === "low") {
    add("warn", "포장 후 곰팡이 소량 확인: 보관성 리스크가 있습니다. 재건조 또는 포장 전 안정화 필요.");
  } else {
    add("good", "포장 후 곰팡이 재발 없음.");
  }

  if (data.foreignMatter === "major") {
    add("danger", "이물질 많음: 선별 불량입니다. 재선별 전 출하 금지.");
  } else if (data.foreignMatter === "minor") {
    add("warn", "이물질 소량: 재선별 권장.");
  } else {
    add("good", "이물질 없음.");
  }

  if (data.maturity === "unstable") {
    add("danger", "부숙도 미흡: 미숙취 또는 발열이 남아 있어 추가 후숙/재부숙이 필요합니다.");
  } else {
    add("good", "부숙도 양호: 미숙취·발열 없음.");
  }

  if (data.pathogen === "exceed") {
    add("danger", "병원성 미생물 기준 초과: 출하 불가, 재처리 및 재검사 필요.");
  } else {
    add("good", "병원성 미생물: 기준 이내.");
  }

  if (data.heavyMetals === "exceed") {
    add("danger", "중금속 기준 초과: 출하 불가, 사용 제한 및 별도 처리 필요.");
  } else {
    add("good", "중금속: 기준 이내.");
  }

  if (data.ripeningDays < 20) {
    add("danger", `후숙 기간 ${data.ripeningDays}일: 최소 권장 20일 미만입니다. 추가 후숙이 필요합니다.`);
  } else if (data.ripeningDays > 40) {
    add("warn", `후숙 기간 ${data.ripeningDays}일: 권장 상한(40일)을 초과했습니다. 원인 점검이 필요합니다.`);
  } else {
    add("good", `후숙 기간 ${data.ripeningDays}일: 권장 범위입니다.`);
  }

  if (data.ripeningTemp < 25) {
    add("warn", `후숙 온도 ${data.ripeningTemp}℃: 권장 하한(25℃) 미만입니다.`);
  } else if (data.ripeningTemp > 45) {
    add("danger", `후숙 온도 ${data.ripeningTemp}℃: 권장 상한(45℃) 초과입니다. 과열 상태를 점검하세요.`);
  } else {
    add("good", `후숙 온도 ${data.ripeningTemp}℃: 권장 범위입니다.`);
  }

  if (data.ripeningMoisture < 40 || data.ripeningMoisture > 50) {
    add("warn", `후숙 수분 ${data.ripeningMoisture}%: 권장 범위 40~50%를 벗어났습니다.`);
  } else {
    add("good", `후숙 수분 ${data.ripeningMoisture}%: 권장 범위입니다.`);
  }

  if (data.turningInterval < 5 || data.turningInterval > 7) {
    add("warn", `뒤집기 간격 ${data.turningInterval}일: 권장 5~7일 간격을 벗어났습니다.`);
  } else {
    add("good", `뒤집기 간격 ${data.turningInterval}일: 권장 범위입니다.`);
  }

  if (data.colorState === "brown" || data.colorState === "darkBrown") {
    add("good", "후숙 색상: 갈색~암갈색으로 양호합니다.");
  } else {
    add("warn", "후숙 색상: 갈색~암갈색 기준에서 벗어났습니다. 후숙 상태를 재점검하세요.");
  }

  if (data.textureState === "friable") {
    add("good", "후숙 촉감: 부슬부슬하고 끈적임이 적어 양호합니다.");
  } else if (data.textureState === "sticky") {
    add("warn", "후숙 촉감: 끈적임이 있습니다. 수분/통기 상태를 점검하세요.");
  } else {
    add("warn", "후숙 촉감: 덩어리가 많습니다. 뒤집기 및 수분 균일화가 필요합니다.");
  }

  if (data.pileDelta > 15) {
    add("danger", `더미-외기 온도차 ${data.pileDelta}℃: 과도한 온도차입니다. 과열 여부를 점검하세요.`);
  } else if (data.pileDelta > 10) {
    add("warn", `더미-외기 온도차 ${data.pileDelta}℃: 높은 편입니다. 뒤집기/통기 점검이 필요합니다.`);
  } else {
    add("good", `더미-외기 온도차 ${data.pileDelta}℃: 과도하지 않습니다.`);
  }

  if (data.inoculationTemp > 40) {
    add("danger", `접종 온도 ${data.inoculationTemp}℃: 40℃ 초과입니다. 기능성 미생물 사멸 위험이 커 접종하면 안 됩니다.`);
  } else {
    add("good", `접종 온도 ${data.inoculationTemp}℃: 40℃ 이하로 접종 조건에 적합합니다.`);
  }

  if (data.inoculationAmmonia === "present") {
    add("danger", "접종 전 암모니아취가 남아 있습니다. 미생물 접종 금지, 추가 후숙이 필요합니다.");
  } else {
    add("good", "접종 전 암모니아취 없음: 접종 가능 조건입니다.");
  }

  if (data.inoculationMoisture < 35 || data.inoculationMoisture > 45) {
    add("warn", `접종 수분 ${data.inoculationMoisture}%: 권장 범위 35~45%를 벗어났습니다.`);
  } else {
    add("good", `접종 수분 ${data.inoculationMoisture}%: 권장 범위입니다.`);
  }

  if (data.inoculationTiming === "beforeHotCompost") {
    add("danger", "고온부숙 전 조기접종 선택: 고온에서 미생물 사멸 가능성이 큽니다. 후숙 후접종으로 전환하세요.");
  } else {
    add("good", "후숙 후접종 원칙을 준수했습니다.");
  }

  if (data.stabilizationDays < 5) {
    add("danger", `접종 후 안정화 ${data.stabilizationDays}일: 최소 권장 5일 미만입니다.`);
  } else if (data.stabilizationDays > 10) {
    add("warn", `접종 후 안정화 ${data.stabilizationDays}일: 권장 5~10일을 초과했습니다.`);
  } else {
    add("good", `접종 후 안정화 ${data.stabilizationDays}일: 권장 범위입니다.`);
  }

  const requiredStrains = [
    "bacillus subtilis",
    "bacillus amyloliquefaciens",
    "bacillus licheniformis",
    "lactobacillus plantarum",
    "saccharomyces cerevisiae",
  ];

  const strainText = data.strainMix.toLowerCase();
  const includedCount = requiredStrains.filter((strain) => strainText.includes(strain)).length;

  if (includedCount === requiredStrains.length) {
    add("good", "권장 5종 미생물 균주 구성이 모두 포함되어 있습니다.");
  } else if (includedCount >= 3) {
    add("warn", `미생물 균주 구성: 권장 5종 중 ${includedCount}종 확인되었습니다. 목적 작물에 맞게 균주 구성을 보완하세요.`);
  } else {
    add("warn", `미생물 균주 구성: 권장 5종 중 ${includedCount}종만 확인되었습니다. 균주 구성을 재검토하세요.`);
  }

  let status = {
    level: "good",
    title: "즉시출하",
    detail: "현재 입력값 기준으로 바로 시판 가능한 품질입니다.",
  };

  if (dangerCount > 0) {
    status = {
      level: "danger",
      title: "출하보류",
      detail: "위험 항목이 있습니다. 재건조, 추가 후숙, 재부숙 또는 재선별 후 재검사하세요.",
    };
  } else if (warnCount > 0) {
    status = {
      level: "warn",
      title: "조건부출하",
      detail: "주의 항목이 있습니다. 사용처 제한 또는 추가 확인 후 출하하세요.",
    };
  }

  if (data.moisture > 25 && dangerCount > 0) {
    status.title = "출하보류";
    status.detail = "수분이 높아 보관 중 곰팡이·부패 위험이 있습니다.";
  }

  if (data.gi < 70 || data.odor === "ammonia" || data.odor === "rot") {
    status.title = "출하보류";
    status.detail = "식물 독성, 암모니아취, 부패취 가능성이 있어 바로 출하하면 안 됩니다.";
  }

  if (data.ripeningDays < 20 || data.ripeningTemp > 45 || data.pileDelta > 15) {
    status.title = "출하보류";
    status.detail = "후숙 운영 기준 미달 항목이 있어 즉시 출하하면 안 됩니다.";
  }

  if (
    data.inoculationTemp > 40 ||
    data.inoculationAmmonia === "present" ||
    data.inoculationTiming === "beforeHotCompost" ||
    data.stabilizationDays < 5
  ) {
    status.title = "출하보류";
    status.detail = "접종 핵심 조건(온도/암모니아취/후접종/안정화 기간) 중 미달 항목이 있어 재조정이 필요합니다.";
    status.level = "danger";
  }

  if (data.ec > 5.0) {
    status.title = "조건부출하";
    status.detail = "염류장해 위험이 높아 민감작물용 출하를 제한해야 합니다.";
  }

  if (data.pathogen === "exceed" || data.heavyMetals === "exceed" || data.maturity === "unstable") {
    status.title = "출하보류";
    status.detail = "법적/위생/부숙도 기준 미달 항목이 있어 출하할 수 없습니다.";
    status.level = "danger";
  }

  const patentCheck = evaluatePatentCriteria(data);

  return {
    ...data,
    status,
    patentCheck,
    reasons,
  };
}

function evaluatePatentMetric(value, metric) {
  if (!Number.isFinite(value)) {
    return "fail";
  }

  if (value >= metric.passMin && value <= metric.passMax) {
    return "pass";
  }

  if (value >= metric.warningMin && value <= metric.warningMax) {
    return "warning";
  }

  return "fail";
}

function evaluatePatentCriteria(data) {
  const metrics = Object.values(PATENT_TARGETS).map((metric) => {
    const measured = Number(data[metric.key]);
    const level = evaluatePatentMetric(measured, metric);

    return {
      label: metric.label,
      measured,
      passMin: metric.passMin,
      passMax: metric.passMax,
      unit: metric.unit,
      level,
    };
  });

  const hasFail = metrics.some((metric) => metric.level === "fail");
  const hasWarning = metrics.some((metric) => metric.level === "warning");

  let level = "pass";
  let title = "즉시출하";

  if (hasFail) {
    level = "fail";
    title = "출하보류";
  } else if (hasWarning) {
    level = "warning";
    title = "조건부출하";
  }

  return {
    level,
    title,
    metrics,
  };
}

function formatPatentValue(value, unit) {
  if (!Number.isFinite(value)) {
    return "입력값 없음";
  }

  return `${value}${unit}`;
}

function renderEvaluation(evaluation) {
  outputs.finalStatus.className = `status ${evaluation.status.level}`;
  outputs.finalStatus.innerHTML = `
    ${evaluation.status.title}
    <br />
    <small>${evaluation.status.detail}</small>
  `;

  outputs.reasonList.innerHTML = "";

  evaluation.reasons.forEach((reason) => {
    const item = document.createElement("div");
    item.className = `reason ${reason.level}`;
    item.textContent = reason.text;
    outputs.reasonList.appendChild(item);
  });

  outputs.patentOverall.className = `patent-overall ${evaluation.patentCheck.level}`;
  outputs.patentOverall.textContent = evaluation.patentCheck.title;

  outputs.patentMetricList.innerHTML = "";

  evaluation.patentCheck.metrics.forEach((metric) => {
    const row = document.createElement("div");
    row.className = "patent-metric";
    row.innerHTML = `
      <span class="patent-metric-label">${metric.label} (최적 ${metric.passMin}~${metric.passMax}${metric.unit})</span>
      <span class="patent-metric-value">측정 ${formatPatentValue(metric.measured, metric.unit)}</span>
      <span class="patent-badge ${metric.level}">${metric.level === "pass" ? "즉시출하" : metric.level === "warning" ? "조건부출하" : "출하보류"}</span>
    `;
    outputs.patentMetricList.appendChild(row);
  });
}

function buildMonthlySeries(metricKey) {
  const bucket = new Map();

  records.forEach((record) => {
    const value = Number(record[metricKey]);
    if (!Number.isFinite(value)) {
      return;
    }

    const month = String(record.inspectionDate || "").slice(0, 7);
    if (!month) {
      return;
    }

    const previous = bucket.get(month) || { sum: 0, count: 0 };
    bucket.set(month, {
      sum: previous.sum + value,
      count: previous.count + 1,
    });
  });

  return Array.from(bucket.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, value]) => ({
      month,
      average: value.sum / value.count,
      count: value.count,
    }));
}

function drawTrendChart() {
  const canvas = outputs.trendCanvas;
  if (!canvas) {
    return;
  }

  const metricKey = outputs.trendMetric.value;
  const metric = TREND_METRICS[metricKey];
  const series = buildMonthlySeries(metricKey);
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.max(320, Math.floor(canvas.clientWidth || 900));
  const displayHeight = 280;

  canvas.width = Math.floor(displayWidth * dpr);
  canvas.height = Math.floor(displayHeight * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, displayWidth, displayHeight);

  if (series.length === 0) {
    ctx.fillStyle = "#5a6656";
    ctx.font = "15px sans-serif";
    ctx.fillText("저장된 데이터가 없어 추세를 표시할 수 없습니다.", 24, 48);
    outputs.trendSummary.textContent = "기록을 저장하면 월별 평균 추세가 자동으로 생성됩니다.";
    return;
  }

  const chart = {
    left: 50,
    right: displayWidth - 20,
    top: 20,
    bottom: displayHeight - 42,
  };
  const chartWidth = chart.right - chart.left;
  const chartHeight = chart.bottom - chart.top;

  const values = series.map((item) => item.average);
  let min = Math.min(...values);
  let max = Math.max(...values);

  if (min === max) {
    min -= 1;
    max += 1;
  }

  const padding = (max - min) * 0.15;
  min -= padding;
  max += padding;

  ctx.strokeStyle = "#e0e7d7";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = chart.top + (chartHeight * i) / 4;
    ctx.beginPath();
    ctx.moveTo(chart.left, y);
    ctx.lineTo(chart.right, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#8ea77a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(chart.left, chart.top);
  ctx.lineTo(chart.left, chart.bottom);
  ctx.lineTo(chart.right, chart.bottom);
  ctx.stroke();

  const toX = (index) => {
    if (series.length === 1) {
      return chart.left + chartWidth / 2;
    }

    return chart.left + (chartWidth * index) / (series.length - 1);
  };
  const toY = (value) => chart.bottom - ((value - min) / (max - min)) * chartHeight;

  ctx.strokeStyle = "#4f7a39";
  ctx.lineWidth = 3;
  ctx.beginPath();
  series.forEach((item, index) => {
    const x = toX(index);
    const y = toY(item.average);
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  ctx.fillStyle = "#2f5e20";
  series.forEach((item, index) => {
    const x = toX(index);
    const y = toY(item.average);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#566252";
  ctx.font = "12px sans-serif";
  series.forEach((item, index) => {
    const x = toX(index);
    ctx.fillText(item.month.slice(2), x - 16, chart.bottom + 20);
  });

  const latest = series[series.length - 1];
  const first = series[0];
  const delta = latest.average - first.average;
  const direction = delta > 0 ? "상승" : delta < 0 ? "하락" : "유지";
  outputs.trendSummary.textContent =
    `${metric.label} 월평균: 최신 ${latest.month} ${latest.average.toFixed(metric.decimals)}${metric.unit}, ` +
    `초기 ${first.month} 대비 ${Math.abs(delta).toFixed(metric.decimals)}${metric.unit} ${direction}.`;
}

function renderTrendChart() {
  drawTrendChart();
}

function evaluateCurrent() {
  const data = getInputData();
  currentEvaluation = evaluateQuality(data);
  renderEvaluation(currentEvaluation);
}

function saveCurrent() {
  if (!currentEvaluation) {
    evaluateCurrent();
  }

  records.push(currentEvaluation);
  saveRecordsToStorage();
  renderRecords();
}

function clearRecords() {
  const ok = window.confirm("전체 품질검사 기록을 삭제할까요?");
  if (!ok) return;

  records = [];
  saveRecordsToStorage();
  renderRecords();
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportRecordsToCsv() {
  if (records.length === 0) {
    window.alert("내보낼 품질검사 기록이 없습니다.");
    return;
  }

  const headers = [
    "검사일",
    "제조번호",
    "제품유형",
    "수분",
    "pH",
    "EC",
    "유기물",
    "총질소",
    "인산",
    "칼리",
    "C/N",
    "발아지수",
    "펠릿파손율",
    "냄새",
    "곰팡이",
    "이물질",
    "부숙도",
    "병원성미생물",
    "중금속",
    "후숙기간(일)",
    "후숙온도(℃)",
    "후숙수분(%)",
    "뒤집기간격(일)",
    "후숙색상",
    "후숙촉감",
    "더미-외기온도차(℃)",
    "접종온도(℃)",
    "접종수분(%)",
    "접종전암모니아취",
    "접종시점",
    "안정화발효(일)",
    "균주구성",
    "최종판정",
    "판정상세",
    "최적기준종합"
  ];

  const rows = records
    .slice()
    .sort((a, b) => String(b.inspectionDate).localeCompare(String(a.inspectionDate)))
    .map((record) => [
      record.inspectionDate,
      record.batchId,
      productTypeLabel(record.productType),
      record.moisture,
      record.ph,
      record.ec,
      record.organicMatter,
      record.totalNitrogen,
      record.phosphate,
      record.potassium,
      record.cn,
      record.gi,
      record.breakage,
      record.odor,
      record.mold,
      record.foreignMatter,
      record.maturity,
      record.pathogen,
      record.heavyMetals,
      record.ripeningDays,
      record.ripeningTemp,
      record.ripeningMoisture,
      record.turningInterval,
      record.colorState,
      record.textureState,
      record.pileDelta,
      record.inoculationTemp,
      record.inoculationMoisture,
      record.inoculationAmmonia,
      record.inoculationTiming,
      record.stabilizationDays,
      record.strainMix,
      record.status.title,
      record.status.detail,
      (record.patentCheck || evaluatePatentCriteria(record)).title
    ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `farmerstree-quality-records-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderRecords() {
  outputs.recordsTable.innerHTML = "";

  records
    .slice()
    .sort((a, b) => String(b.inspectionDate).localeCompare(String(a.inspectionDate)))
    .forEach((record) => {
      const qualityGate = record.patentCheck || evaluatePatentCriteria(record);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${record.inspectionDate}</td>
        <td>${record.batchId}</td>
        <td>${productTypeLabel(record.productType)}</td>
        <td>${record.moisture}%</td>
        <td>${record.ph}</td>
        <td>${record.ec}</td>
        <td>${record.cn}</td>
        <td>${record.gi}</td>
        <td>${record.breakage}%</td>
        <td>${record.ripeningDays}일</td>
        <td>${record.ripeningTemp}℃</td>
        <td>${record.ripeningMoisture}%</td>
        <td>
          <span class="metric-badge ${record.inoculationTemp <= 40 ? "safe" : "risk"}">
            ${record.inoculationTemp}℃
          </span>
        </td>
        <td>
          <span class="metric-badge ${record.inoculationMoisture >= 35 && record.inoculationMoisture <= 45 ? "safe" : (record.inoculationMoisture < 30 || record.inoculationMoisture > 50 ? "risk" : "warn")}">
            ${record.inoculationMoisture}%
          </span>
        </td>
        <td>
          <span class="inoc-badge ${record.inoculationTiming === "postRipening" ? "safe" : "risk"}">
            ${record.inoculationTiming === "postRipening" ? "후숙 후접종" : "고온부숙 전 조기접종"}
          </span>
        </td>
        <td>
          <span class="badge ${record.status.level}">
            ${record.status.title}
          </span>
        </td>
        <td>
          <span class="patent-badge ${qualityGate.level}">
            ${qualityGate.title}
          </span>
        </td>
      `;

      outputs.recordsTable.appendChild(row);
    });

  renderTrendChart();
}

evaluateButton.addEventListener("click", evaluateCurrent);
saveButton.addEventListener("click", saveCurrent);
clearButton.addEventListener("click", clearRecords);
exportCsvButton.addEventListener("click", exportRecordsToCsv);
outputs.trendMetric.addEventListener("change", renderTrendChart);
window.addEventListener("resize", renderTrendChart);

evaluateCurrent();
renderRecords();

```

---
## FILE: quality-dashboard/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 품질검사 입력 대시보드</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <header class="site-header">
    <div class="header-inner">
      <span class="logo">Farmerstree Fertilizer Platform</span>
      <nav class="header-nav">
        <a href="../calculator/">수익성 계산기</a>
        <a href="../quality-dashboard/" class="active">품질검사</a>
        <a href="../sales-manager/">재고·거래처</a>
        <a href="../farmer-roi-calculator/">농가 ROI</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>품질검사 입력 대시보드</h1>
      <p class="description">
        후배지 펠릿비료의 최종 품질검사 값을 입력하면 출하 가능 여부를 자동 판정합니다.
        수분, pH, EC, C/N, 발아지수, 냄새, 펠릿 파손율과 후숙 운영 기준을 함께 점검해
        재건조·추가 후숙·재부숙 필요 여부를 판단합니다.
      </p>
    </section>

    <section class="card form-card">
      <h2>품질검사 입력</h2>

      <div class="form-grid">
        <label>
          제조번호
          <input id="batchId" type="text" value="FT-FERT-20260429-001" />
        </label>

        <label>
          제품 유형
          <select id="productType">
            <option value="standard">일반형 고부숙 펠릿</option>
            <option value="premium">프리미엄 기능성 펠릿</option>
            <option value="lowSalt">저염 민감작물용</option>
          </select>
        </label>

        <label>
          검사일
          <input id="inspectionDate" type="date" />
        </label>

        <label>
          최종 수분 %
          <input id="moisture" type="number" value="18" step="0.1" />
        </label>

        <label>
          pH
          <input id="ph" type="number" value="7.2" step="0.1" />
        </label>

        <label>
          EC
          <input id="ec" type="number" value="2.5" step="0.1" />
        </label>

        <label>
          유기물(%)
          <input id="organicMatter" type="number" value="30" step="0.1" />
        </label>

        <label>
          총질소(%)
          <input id="totalNitrogen" type="number" value="1.5" step="0.1" />
        </label>

        <label>
          인산(%)
          <input id="phosphate" type="number" value="1.0" step="0.1" />
        </label>

        <label>
          칼리(%)
          <input id="potassium" type="number" value="1.0" step="0.1" />
        </label>

        <label>
          C/N
          <input id="cn" type="number" value="20" step="0.1" />
        </label>

        <label>
          발아지수 GI
          <input id="gi" type="number" value="85" step="1" />
        </label>

        <label>
          펠릿 파손율 %
          <input id="breakage" type="number" value="5" step="0.1" />
        </label>

        <label>
          냄새 상태
          <select id="odor">
            <option value="normal">정상 / 흙냄새</option>
            <option value="ammonia">암모니아취</option>
            <option value="rot">부패취</option>
            <option value="sour">강한 산취</option>
          </select>
        </label>

        <label>
          포장 후 곰팡이 재발
          <select id="mold">
            <option value="none">없음</option>
            <option value="low">약간 있음</option>
            <option value="high">많음</option>
          </select>
        </label>

        <label>
          이물질
          <select id="foreignMatter">
            <option value="none">없음</option>
            <option value="minor">소량</option>
            <option value="major">많음</option>
          </select>
        </label>

        <label>
          부숙도
          <select id="maturity">
            <option value="stable">양호(미숙취·발열 없음)</option>
            <option value="unstable">미흡(미숙취·발열 있음)</option>
          </select>
        </label>

        <label>
          병원성 미생물
          <select id="pathogen">
            <option value="within">기준 이내</option>
            <option value="exceed">기준 초과</option>
          </select>
        </label>

        <label>
          중금속
          <select id="heavyMetals">
            <option value="within">기준 이내</option>
            <option value="exceed">기준 초과</option>
          </select>
        </label>

        <label>
          후숙 기간(일)
          <input id="ripeningDays" type="number" value="30" step="1" min="0" />
        </label>

        <label>
          후숙 평균 온도(℃)
          <input id="ripeningTemp" type="number" value="35" step="0.1" />
        </label>

        <label>
          후숙 수분(%)
          <input id="ripeningMoisture" type="number" value="45" step="0.1" />
        </label>

        <label>
          뒤집기 간격(일)
          <input id="turningInterval" type="number" value="6" step="1" min="1" />
        </label>

        <label>
          후숙 색상
          <select id="colorState">
            <option value="brown">갈색</option>
            <option value="darkBrown">암갈색</option>
            <option value="light">옅은색</option>
            <option value="black">검은색</option>
          </select>
        </label>

        <label>
          후숙 촉감
          <select id="textureState">
            <option value="friable">부슬부슬, 끈적임 적음</option>
            <option value="sticky">끈적임 있음</option>
            <option value="lumpy">덩어리 많음</option>
          </select>
        </label>

        <label>
          더미-외기 온도차(℃)
          <input id="pileDelta" type="number" value="6" step="0.1" />
        </label>

        <label>
          접종 시 원료 온도(℃)
          <input id="inoculationTemp" type="number" value="35" step="0.1" />
        </label>

        <label>
          접종 시 수분(%)
          <input id="inoculationMoisture" type="number" value="40" step="0.1" />
        </label>

        <label>
          접종 전 암모니아취
          <select id="inoculationAmmonia">
            <option value="none">없음</option>
            <option value="present">남아 있음</option>
          </select>
        </label>

        <label>
          접종 시점
          <select id="inoculationTiming">
            <option value="postRipening">후숙 후접종</option>
            <option value="beforeHotCompost">고온부숙 전 조기접종</option>
          </select>
        </label>

        <label>
          접종 후 안정화 발효(일)
          <input id="stabilizationDays" type="number" value="7" step="1" min="0" />
        </label>

        <label class="wide">
          기능성 미생물 균주 구성
          <input
            id="strainMix"
            type="text"
            value="Bacillus subtilis, Bacillus amyloliquefaciens, Bacillus licheniformis, Lactobacillus plantarum, Saccharomyces cerevisiae"
          />
        </label>
      </div>

      <div class="button-row">
        <button id="evaluateButton">품질 판정</button>
        <button id="saveButton">기록 저장</button>
        <button id="exportCsvButton">CSV 내보내기</button>
        <button id="clearButton" class="danger">전체 기록 삭제</button>
      </div>
    </section>

    <section class="grid" id="shipping-judgement">
      <div class="card result-card">
        <h2>최종 판정</h2>

        <div id="finalStatus" class="status neutral">
          검사값을 입력하고 품질 판정을 누르세요.
        </div>

        <div class="patent-panel" id="patentPanel">
          <div class="patent-title-row">
            <h3>출하 최적 기준 자동 판정</h3>
            <span class="patent-overall neutral" id="patentOverall">대기</span>
          </div>
          <p class="patent-description">
            기준값: pH 6.8~7.6, 질소 1.2~2.2%, 인 0.8~2.0%, 칼륨 0.8~2.0%, C/N 15~25
          </p>
          <div class="patent-metric-list" id="patentMetricList"></div>
        </div>

        <div id="reasonList" class="reason-list"></div>
      </div>

      <div class="card">
        <h2>기준값</h2>

        <table class="small-table">
          <tbody>
            <tr>
              <th>수분</th>
              <td>펠릿 기준 15~20% 권장, 25% 초과 시 재건조</td>
            </tr>
            <tr>
              <th>pH</th>
              <td>6.5~8.0 권장</td>
            </tr>
            <tr>
              <th>EC</th>
              <td>낮을수록 민감작물에 유리, 4.0 초과 시 주의</td>
            </tr>
            <tr>
              <th>유기물</th>
              <td>제품 기준 설정 필요</td>
            </tr>
            <tr>
              <th>총질소</th>
              <td>제품 기준 설정 필요</td>
            </tr>
            <tr>
              <th>인산</th>
              <td>제품 기준 설정 필요</td>
            </tr>
            <tr>
              <th>칼리</th>
              <td>제품 기준 설정 필요</td>
            </tr>
            <tr>
              <th>C/N</th>
              <td>15~25 권장</td>
            </tr>
            <tr>
              <th>부숙도</th>
              <td>미숙취·발열 없어야 함</td>
            </tr>
            <tr>
              <th>발아지수</th>
              <td>70 이상 최소, 80 이상 권장</td>
            </tr>
            <tr>
              <th>병원성 미생물</th>
              <td>기준 이내</td>
            </tr>
            <tr>
              <th>중금속</th>
              <td>기준 이내</td>
            </tr>
            <tr>
              <th>냄새</th>
              <td>암모니아취·부패취 없어야 함</td>
            </tr>
            <tr>
              <th>펠릿 파손율</th>
              <td>10% 이하 권장, 20% 초과 시 제품성 낮음</td>
            </tr>
            <tr>
              <th>후숙 기간</th>
              <td>20~40일 권장</td>
            </tr>
            <tr>
              <th>후숙 온도</th>
              <td>25~45℃ 권장, 외기 대비 과열 금지</td>
            </tr>
            <tr>
              <th>후숙 수분</th>
              <td>40~50% 권장</td>
            </tr>
            <tr>
              <th>뒤집기 주기</th>
              <td>5~7일 간격 권장</td>
            </tr>
            <tr>
              <th>색상/촉감</th>
              <td>갈색~암갈색, 부슬부슬·저점착 권장</td>
            </tr>
            <tr>
              <th>접종 온도</th>
              <td>후숙물 40℃ 이하에서 접종</td>
            </tr>
            <tr>
              <th>접종 전 상태</th>
              <td>암모니아취가 남아 있으면 접종 금지</td>
            </tr>
            <tr>
              <th>접종 수분</th>
              <td>35~45% 권장</td>
            </tr>
            <tr>
              <th>접종 원칙</th>
              <td>고온부숙 전 과다 투입 금지, 후숙 후접종 기본, 접종 후 5~10일 안정화 발효</td>
            </tr>
            <tr>
              <th>권장 균주</th>
              <td>Bacillus subtilis, Bacillus amyloliquefaciens, Bacillus licheniformis, Lactobacillus plantarum, Saccharomyces cerevisiae</td>
            </tr>
          </tbody>
        </table>

        <div class="rule-alerts">
          <h3>즉시 조치가 필요한 위험 조건</h3>
          <ol>
            <li>강한 암모니아취가 있음</li>
            <li>부패취가 있음</li>
            <li>발아지수 70 미만</li>
            <li>수분 25% 초과</li>
            <li>EC 과도 고농도(사용 작물 제한 필요 상태)</li>
            <li>이물질 다량 혼입</li>
            <li>포장 후 곰팡이 재발 많음</li>
            <li>펠릿 파손율 과다</li>
          </ol>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>품질검사 기록</h2>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>검사일</th>
              <th>제조번호</th>
              <th>제품 유형</th>
              <th>수분</th>
              <th>pH</th>
              <th>EC</th>
              <th>C/N</th>
              <th>GI</th>
              <th>파손율</th>
              <th>후숙기간</th>
              <th>후숙온도</th>
              <th>후숙수분</th>
              <th>접종온도</th>
              <th>접종수분</th>
              <th>접종시점</th>
              <th>판정</th>
              <th>최적기준</th>
            </tr>
          </thead>
          <tbody id="recordsTable"></tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <h2>월별 품질 추세</h2>

      <div class="trend-controls">
        <label>
          추세 지표
          <select id="trendMetric">
            <option value="moisture">수분(%)</option>
            <option value="ph">pH</option>
            <option value="ec">EC</option>
            <option value="totalNitrogen">총질소(%)</option>
            <option value="phosphate">인산(%)</option>
            <option value="potassium">칼리(%)</option>
            <option value="cn">C/N</option>
            <option value="gi">발아지수(GI)</option>
            <option value="breakage">파손율(%)</option>
          </select>
        </label>
      </div>

      <div class="trend-canvas-wrap">
        <canvas id="trendCanvas" height="280"></canvas>
      </div>

      <p class="trend-summary" id="trendSummary">기록을 저장하면 월별 추세가 표시됩니다.</p>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: quality-dashboard/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1220px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.description {
  max-width: 920px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4c5748;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 24px;
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

input,
select {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
}

textarea {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  background: #5f7f45;
  color: white;
}

button:hover {
  opacity: 0.9;
}

button.danger {
  background: #8a3d31;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.status {
  padding: 24px;
  border-radius: 18px;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.35;
}

.status.good {
  background: #e4f3da;
  color: #2f5e20;
}

.status.warn {
  background: #fff3cf;
  color: #735400;
}

.status.danger {
  background: #ffe0d8;
  color: #7b2b1d;
}

.status.neutral {
  background: #edf0f3;
  color: #3f4a54;
}

.reason-list {
  margin-top: 20px;
  display: grid;
  gap: 10px;
}

.patent-panel {
  margin-top: 18px;
  padding: 16px;
  border-radius: 14px;
  background: #f6f8f2;
  border: 1px solid #d9e2cf;
}

.patent-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.patent-title-row h3 {
  margin: 0;
  font-size: 16px;
}

.patent-description {
  margin: 8px 0 12px;
  font-size: 13px;
  color: #4c5748;
}

.patent-overall {
  display: inline-block;
  border-radius: 999px;
  padding: 6px 11px;
  font-size: 12px;
  font-weight: 900;
}

.patent-overall.pass {
  background: #e4f3da;
  color: #2f5e20;
}

.patent-overall.warning {
  background: #fff3cf;
  color: #735400;
}

.patent-overall.fail {
  background: #ffe0d8;
  color: #7b2b1d;
}

.patent-overall.neutral {
  background: #edf0f3;
  color: #3f4a54;
}

.patent-metric-list {
  display: grid;
  gap: 8px;
}

.patent-metric {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e3e9db;
  font-size: 13px;
}

.patent-metric-label {
  font-weight: 800;
}

.patent-metric-value {
  color: #3d4839;
  font-weight: 700;
}

.patent-badge {
  display: inline-block;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 900;
}

.patent-badge.pass {
  background: #e4f3da;
  color: #2f5e20;
}

.patent-badge.warning {
  background: #fff3cf;
  color: #735400;
}

.patent-badge.fail {
  background: #ffe0d8;
  color: #7b2b1d;
}

.reason {
  padding: 14px 16px;
  border-radius: 12px;
  background: #f7f8f5;
  border-left: 5px solid #cbd5c4;
  line-height: 1.6;
  font-weight: 700;
}

.reason.good {
  border-left-color: #76a85b;
}

.reason.warn {
  border-left-color: #d4a72c;
}

.reason.danger {
  border-left-color: #b55545;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1420px;
}

.small-table {
  min-width: auto;
}

.rule-alerts {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #fff6ef;
  border: 1px solid #f3d7c8;
}

.rule-alerts h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #7b2b1d;
}

.rule-alerts ol {
  margin: 0;
  padding-left: 18px;
  line-height: 1.6;
  color: #7b2b1d;
  font-weight: 700;
}

.trend-controls {
  max-width: 320px;
  margin-bottom: 12px;
}

.trend-canvas-wrap {
  width: 100%;
  border: 1px solid #dfe7d5;
  border-radius: 14px;
  background: #fbfcfa;
  padding: 10px;
}

#trendCanvas {
  width: 100%;
  display: block;
}

.trend-summary {
  margin: 12px 0 0;
  color: #4c5748;
  font-weight: 700;
  line-height: 1.6;
}

th,
td {
  padding: 13px 12px;
  text-align: left;
  border-bottom: 1px solid #edf0e8;
  vertical-align: top;
  font-size: 14px;
}

th {
  background: #edf4e5;
  color: #2f4428;
}

.badge {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.badge.good {
  background: #e4f3da;
  color: #2f5e20;
}

.badge.warn {
  background: #fff3cf;
  color: #735400;
}

.badge.danger {
  background: #ffe0d8;
  color: #7b2b1d;
}

.inoc-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.inoc-badge.safe {
  background: #e4f3da;
  color: #2f5e20;
}

.inoc-badge.risk {
  background: #ffe0d8;
  color: #7b2b1d;
}

.metric-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.metric-badge.safe {
  background: #e4f3da;
  color: #2f5e20;
}

.metric-badge.warn {
  background: #fff3cf;
  color: #735400;
}

.metric-badge.risk {
  background: #ffe0d8;
  color: #7b2b1d;
}

@media (max-width: 940px) {
  .form-grid,
  .grid {
    grid-template-columns: 1fr;
  }
}

.site-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.header-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.logo {
  font-weight: 700;
  color: #14532d;
}

.header-nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.header-nav a {
  text-decoration: none;
  color: #374151;
  padding: 6px 10px;
  border-radius: 8px;
}

.header-nav a.active {
  background: #dcfce7;
  color: #14532d;
  font-weight: 600;
}

```

---
## FILE: README.md
```
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

```

---
## FILE: recipe-calculator/app.js
```
const recipes = {
  standard: {
    name: "A안: 일반 농가용 고부숙 펠릿",
    description:
      "일반 농가 공급용 기본 배합입니다. 원가와 품질의 균형을 맞춘 구조로 고추, 마늘, 양파, 과수, 노지작물에 적합합니다.",
    items: [
      { name: "버섯 후배지", kg: 1000, role: "주원료, 유기물 공급" },
      { name: "발효계분 또는 계분퇴비", kg: 100, role: "질소·인산 보정" },
      { name: "미강", kg: 40, role: "발효 촉진, 미생물 먹이" },
      { name: "제올라이트", kg: 30, role: "암모니아·냄새 흡착" },
      { name: "바이오차 또는 왕겨숯", kg: 20, role: "통기성, 보수성, 토양개량" },
      { name: "석고", kg: 10, role: "칼슘·황 공급, pH 완충" },
      { name: "당밀", kg: 3, role: "미생물 활성 보조" },
      { name: "Bacillus 미생물제", kg: 1, role: "후숙 후 기능성 미생물 접종" },
    ],
  },

  premium: {
    name: "B안: 프리미엄 기능성 펠릿",
    description:
      "브랜드형 고급 제품 배합입니다. 유박, 바이오차, 제올라이트, 기능성 미생물 비중을 높여 시설원예, 과수, 온라인 소포장에 적합합니다.",
    items: [
      { name: "버섯 후배지", kg: 1000, role: "주원료, 유기물 공급" },
      { name: "발효계분 또는 계분퇴비", kg: 80, role: "질소·인산 보정" },
      { name: "유박 또는 깻묵", kg: 60, role: "질소·유기물 보강" },
      { name: "미강", kg: 50, role: "발효 촉진, 결착 보조" },
      { name: "제올라이트", kg: 40, role: "암모니아·냄새 흡착" },
      { name: "바이오차 또는 왕겨숯", kg: 40, role: "통기성, 토양개량, 탄소 안정화" },
      { name: "석고", kg: 15, role: "칼슘·황 공급, pH 완충" },
      { name: "해조분 또는 아미노산 부산물", kg: 15, role: "미량요소·기능성 보강" },
      { name: "당밀", kg: 5, role: "미생물 활성 보조" },
      { name: "복합 Bacillus + 효모", kg: 2, role: "후숙 후 기능성 미생물 접종" },
    ],
  },

  lowSalt: {
    name: "C안: 저염 민감작물용",
    description:
      "염류장해에 민감한 작물용 배합입니다. 계분과 유박을 줄이고 코코피트, 왕겨, 바이오차, 제올라이트를 늘려 저염·토양개량 성격을 강화합니다.",
    items: [
      { name: "저염 버섯 후배지", kg: 1000, role: "주원료, 유기물 공급" },
      { name: "코코피트 또는 왕겨", kg: 100, role: "염류 희석, 통기성 보강" },
      { name: "미강", kg: 30, role: "발효 촉진" },
      { name: "바이오차 또는 왕겨숯", kg: 40, role: "염류·냄새 흡착, 토양개량" },
      { name: "제올라이트", kg: 40, role: "암모니아·양이온 흡착" },
      { name: "발효계분 또는 계분퇴비", kg: 50, role: "질소 보정, 저투입" },
      { name: "유박 또는 깻묵", kg: 30, role: "질소·유기물 보강, 저투입" },
      { name: "석고", kg: 10, role: "칼슘·황 공급, pH 완충" },
      { name: "당밀", kg: 2, role: "미생물 활성 보조" },
      { name: "Bacillus 미생물제", kg: 1, role: "후숙 후 기능성 미생물 접종" },
    ],
  },
};

const substrateInput = document.getElementById("substrateKg");
const recipeTypeSelect = document.getElementById("recipeType");
const recipeTable = document.getElementById("recipeTable");
const recipeMessage = document.getElementById("recipeMessage");
const patentRecipeTable = document.getElementById("patentRecipeTable");
const patentRecipeMessage = document.getElementById("patentRecipeMessage");

const patentLockedRatios = [
  { name: "건초", part: 45, min: 40, max: 50 },
  { name: "밀짚", part: 30, min: 25, max: 35 },
  { name: "가금류 분뇨", part: 10, min: 5, max: 15 },
  { name: "미생물제", part: 0.1, min: 0.05, max: 0.2 },
];

function toNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function formatKg(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}톤`;
  }

  if (value < 1) {
    return `${value.toFixed(2)}kg`;
  }

  return `${Math.round(value).toLocaleString("ko-KR")}kg`;
}

function calculateRecipe() {
  const substrateKg = Math.max(toNumber(substrateInput), 0);
  const recipe = recipes[recipeTypeSelect.value];
  const scale = substrateKg / 1000;

  recipeTable.innerHTML = "";

  recipe.items.forEach((item) => {
    const calculatedKg = item.kg * scale;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${formatKg(item.kg)}</td>
      <td><strong>${formatKg(calculatedKg)}</strong></td>
      <td>${item.role}</td>
    `;

    recipeTable.appendChild(row);
  });

  const totalInputKg = recipe.items.reduce((sum, item) => sum + item.kg * scale, 0);

  recipeMessage.textContent =
    `${recipe.name}입니다. 후배지 ${formatKg(substrateKg)} 기준 총 배합 투입량은 약 ${formatKg(totalInputKg)}입니다. ` +
    `${recipe.description} 배합 후 초기 수분 55~60%, pH 6.5~7.5, C/N 25~30을 목표로 수분과 탄질비를 현장에서 다시 보정해야 합니다.`;

  renderPatentLockedRecipe(substrateKg);
}

function renderPatentLockedRecipe(substrateKg) {
  patentRecipeTable.innerHTML = "";

  patentLockedRatios.forEach((item) => {
    const row = document.createElement("tr");
    const calculatedKg = substrateKg * (item.part / 100);

    row.innerHTML = `
      <td>${item.name}</td>
      <td><strong>${item.part}</strong></td>
      <td>${item.min}~${item.max}</td>
      <td><strong>${formatKg(calculatedKg)}</strong></td>
    `;

    patentRecipeTable.appendChild(row);
  });

  patentRecipeMessage.textContent =
    `특허 표준 잠금값은 건초 45, 밀짚 30, 가금류 분뇨 10, 미생물제 0.1 중량부입니다. ` +
    `현재 후배지 ${formatKg(substrateKg)} 기준 환산값을 자동 적용했습니다.`;
}

substrateInput.addEventListener("input", calculateRecipe);
recipeTypeSelect.addEventListener("change", calculateRecipe);

calculateRecipe();

```

---
## FILE: recipe-calculator/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 후배지 비료 배합 계산기</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>후배지 비료 배합 계산기</h1>
      <p class="description">
        후배지 투입량을 기준으로 고부숙 펠릿비료 제조에 필요한 첨가물 투입량을 자동 계산합니다.
        기본 배합은 후배지 1,000kg 기준 표준형, 프리미엄형, 저염형으로 구성됩니다.
      </p>
    </section>

    <section class="card controls">
      <label>
        후배지 투입량 kg
        <input id="substrateKg" type="number" value="1000" min="1" />
      </label>

      <label>
        배합 유형
        <select id="recipeType">
          <option value="standard">A안: 일반 농가용 고부숙 펠릿</option>
          <option value="premium">B안: 프리미엄 기능성 펠릿</option>
          <option value="lowSalt">C안: 저염 민감작물용</option>
        </select>
      </label>
    </section>

    <section class="grid">
      <div class="card">
        <h2>배합 결과</h2>
        <table>
          <thead>
            <tr>
              <th>원료</th>
              <th>기준량</th>
              <th>계산 투입량</th>
              <th>역할</th>
            </tr>
          </thead>
          <tbody id="recipeTable"></tbody>
        </table>
      </div>

      <div class="card result-card">
        <h2>공정 목표값</h2>

        <div class="result-row">
          <span>초기 목표 수분</span>
          <strong>55~60%</strong>
        </div>

        <div class="result-row">
          <span>초기 목표 pH</span>
          <strong>6.5~7.5</strong>
        </div>

        <div class="result-row">
          <span>초기 목표 C/N</span>
          <strong>25~30</strong>
        </div>

        <div class="result-row">
          <span>고온부숙 온도</span>
          <strong>55~65℃</strong>
        </div>

        <div class="result-row">
          <span>고온부숙 기간</span>
          <strong>7~14일</strong>
        </div>

        <div class="result-row">
          <span>후숙 기간</span>
          <strong>20~40일</strong>
        </div>

        <div class="message" id="recipeMessage">
          배합 설명이 여기에 표시됩니다.
        </div>

        <div class="lock-section">
          <h3>
            특허 기반 잠금 배합
            <span class="lock-badge">LOCKED DEFAULT</span>
          </h3>
          <p class="lock-description">
            특허 기준 중량부를 기본값으로 고정했습니다. 기준 원료 100중량부 환산으로 자동 계산됩니다.
          </p>

          <table>
            <thead>
              <tr>
                <th>원료</th>
                <th>특허 기준(중량부)</th>
                <th>허용 범위(중량부)</th>
                <th>환산 투입량</th>
              </tr>
            </thead>
            <tbody id="patentRecipeTable"></tbody>
          </table>

          <div class="message lock-message" id="patentRecipeMessage">
            특허 기준 잠금 배합 안내가 여기에 표시됩니다.
          </div>
        </div>
      </div>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: recipe-calculator/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1200px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.description {
  max-width: 860px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4c5748;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 24px;
  align-items: start;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

input,
select {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
}

input:focus,
select:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 14px;
}

th,
td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid #edf0e8;
  vertical-align: top;
}

th {
  background: #edf4e5;
  color: #2f4428;
  font-size: 14px;
}

td {
  font-size: 15px;
  line-height: 1.5;
}

td strong {
  font-size: 17px;
}

tbody tr:nth-child(2n) {
  background: #fafcf8;
}

.result-card {
  position: sticky;
  top: 24px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #edf0e8;
}

.result-row span {
  color: #566252;
  font-weight: 700;
}

.result-row strong {
  font-size: 19px;
}

.message {
  margin-top: 22px;
  padding: 18px;
  border-radius: 14px;
  background: #faf8ed;
  color: #574d2f;
  line-height: 1.65;
  font-weight: 700;
}

.lock-section {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #edf0e8;
}

.lock-section h3 {
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
}

.lock-badge {
  display: inline-block;
  background: #2f4428;
  color: #ffffff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.lock-description {
  margin: 0 0 12px;
  color: #4c5748;
  font-size: 14px;
  line-height: 1.6;
}

.lock-message {
  background: #edf4e5;
  color: #2f4428;
}

@media (max-width: 900px) {
  .controls,
  .grid {
    grid-template-columns: 1fr;
  }

  .result-card {
    position: static;
  }
}

```

---
## FILE: recipes/standard_recipe.json
```
{
  "name": "standard_recipe",
  "ingredients": []
}

```

---
## FILE: report-generator/app.js
```
const fermentationFileInput = document.getElementById("fermentationFile");
const qualityFileInput = document.getElementById("qualityFile");
const batchIdInput = document.getElementById("batchId");
const generateButton = document.getElementById("generateButton");
const downloadButton = document.getElementById("downloadButton");
const preview = document.getElementById("preview");
const message = document.getElementById("message");

let currentMarkdown = "";

function parseCsv(text) {
  const stripBom = (value) => String(value ?? "").replace(/^\uFEFF/, "").trim();
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && ch === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && next === "\n") {
        i += 1;
      }
      row.push(cell);
      if (row.some((part) => part !== "")) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += ch;
  }

  row.push(cell);
  if (row.some((part) => part !== "")) {
    rows.push(row);
  }

  if (rows.length === 0) {
    return {
      headers: [],
      records: [],
    };
  }

  const headers = rows[0].map((h) => stripBom(h));
  const records = rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = stripBom(cells[idx]);
    });
    return record;
  });

  return {
    headers,
    records,
  };
}

function findBatchField(recordOrHeaders) {
  const keys = Array.isArray(recordOrHeaders)
    ? recordOrHeaders
    : Object.keys(recordOrHeaders || {});

  if (keys.length === 0) return null;

  const candidates = ["제조번호", "batchId", "배치번호"];
  for (const key of candidates) {
    if (keys.includes(key)) return key;
  }
  return keys.find((key) => key.toLowerCase().includes("batch")) || null;
}

function toMarkdownTable(records, preferredHeaders) {
  if (records.length === 0) {
    return "해당 데이터 없음";
  }

  const headers = preferredHeaders.filter((h) => h in records[0]);
  const selected = headers.length > 0 ? headers : Object.keys(records[0]);

  const head = `| ${selected.join(" | ")} |`;
  const sep = `| ${selected.map(() => "---").join(" | ")} |`;
  const body = records.map((r) => `| ${selected.map((h) => (r[h] ?? "").replaceAll("|", "\\|")).join(" | ")} |`);
  return [head, sep, ...body].join("\n");
}

async function readCsvFile(fileInput) {
  const file = fileInput.files?.[0];
  if (!file) return null;
  const text = await file.text();
  return parseCsv(text);
}

function generateMarkdown(batchId, fermentationRecords, qualityRecords) {
  const now = new Date().toISOString().slice(0, 10);

  const fermentationHeaders = [
    "제조번호", "일차", "오전온도", "오후온도", "평균온도", "냄새", "수분상태", "판정", "판정내용", "조치"
  ];

  const qualityHeaders = [
    "검사일", "제조번호", "제품유형", "수분", "pH", "EC", "C/N", "발아지수", "펠릿파손율", "최종판정", "판정상세"
  ];

  return `# Farmerstree 제조번호별 통합 리포트\n\n- 생성일: ${now}\n- 제조번호: ${batchId}\n- 발효 기록 건수: ${fermentationRecords.length}\n- 품질검사 기록 건수: ${qualityRecords.length}\n\n---\n\n## 1. 발효 온도 기록\n\n${toMarkdownTable(fermentationRecords, fermentationHeaders)}\n\n---\n\n## 2. 품질검사 기록\n\n${toMarkdownTable(qualityRecords, qualityHeaders)}\n\n---\n\n## 3. 종합 메모\n\n\`\`\`text\n- 발효와 품질 기록을 교차 확인해 최종 출하 판정을 수행하세요.\n\`\`\`\n`;
}

async function handleGenerate() {
  const batchId = batchIdInput.value.trim();
  if (!batchId) {
    message.textContent = "제조번호를 입력하세요.";
    return;
  }

  const fermentationParsed = await readCsvFile(fermentationFileInput);
  const qualityParsed = await readCsvFile(qualityFileInput);

  if (!fermentationParsed || !qualityParsed) {
    message.textContent = "발효 온도 CSV와 품질검사 CSV를 모두 선택하세요.";
    return;
  }

  const fermentationAll = fermentationParsed.records;
  const qualityAll = qualityParsed.records;

  const fermentationKey = findBatchField(fermentationParsed.headers);
  const qualityKey = findBatchField(qualityParsed.headers);

  if (!fermentationKey || !qualityKey) {
    message.textContent = "CSV에서 제조번호 컬럼을 찾을 수 없습니다.";
    return;
  }

  const fermentationRecords = fermentationAll.filter((r) => r[fermentationKey] === batchId);
  const qualityRecords = qualityAll.filter((r) => r[qualityKey] === batchId);

  currentMarkdown = generateMarkdown(batchId, fermentationRecords, qualityRecords);
  preview.textContent = currentMarkdown;
  message.textContent = `리포트 생성 완료: 발효 ${fermentationRecords.length}건, 품질 ${qualityRecords.length}건`;
}

function handleDownload() {
  if (!currentMarkdown) {
    message.textContent = "먼저 리포트를 생성하세요.";
    return;
  }

  const batchId = batchIdInput.value.trim() || "unknown";
  const blob = new Blob([currentMarkdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `farmerstree-integrated-report-${batchId}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

generateButton.addEventListener("click", handleGenerate);
downloadButton.addEventListener("click", handleDownload);

```

---
## FILE: report-generator/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 통합 리포트 생성기</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>제조번호별 통합 리포트 생성기</h1>
      <p class="description">
        발효 온도 CSV와 품질검사 CSV를 업로드한 뒤 제조번호를 입력하면,
        해당 제조번호 데이터만 추출해 Markdown 리포트를 자동 생성합니다.
      </p>
    </section>

    <section class="card">
      <h2>입력</h2>
      <div class="form-grid">
        <label>
          발효 온도 CSV
          <input id="fermentationFile" type="file" accept=".csv,text/csv" />
        </label>

        <label>
          품질검사 CSV
          <input id="qualityFile" type="file" accept=".csv,text/csv" />
        </label>

        <label>
          제조번호
          <input id="batchId" type="text" placeholder="예: FT-FERT-20260429-001" />
        </label>
      </div>

      <div class="button-row">
        <button id="generateButton">리포트 생성</button>
        <button id="downloadButton">Markdown 다운로드</button>
      </div>

      <div id="message" class="message">CSV 2개와 제조번호를 입력하세요.</div>
    </section>

    <section class="card">
      <h2>미리보기</h2>
      <pre id="preview"></pre>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: report-generator/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1120px, 92vw);
  margin: 0 auto;
  padding: 46px 0 70px;
}

.hero {
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.description {
  margin-top: 14px;
  font-size: 16px;
  line-height: 1.7;
  color: #4c5748;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 20px;
}

h2 {
  margin: 0 0 16px;
  font-size: 22px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

input {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 15px;
  background: #fbfcfa;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  background: #5f7f45;
  color: #fff;
}

.message {
  margin-top: 14px;
  font-weight: 700;
  color: #4c5748;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.55;
  max-height: 520px;
  overflow: auto;
  background: #f7f9f4;
  border: 1px solid #e4eadc;
  border-radius: 12px;
  padding: 14px;
}

@media (max-width: 920px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

```

---
## FILE: reports/FT-FERT-20260429-001-integrated-report.md
```

```

---
## FILE: sales-manager/app.js
```
// ─────────────────────────────────────────────
//  Farmerstree — 재고·출하·거래처 관리  app.js
// ─────────────────────────────────────────────

const STORAGE_KEYS = {
  stocks:    'ft_stocks',
  shipments: 'ft_shipments',
  customers: 'ft_customers',
};

// ─── 데이터 로드/저장 ─────────────────────────
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getStocks()    { return load(STORAGE_KEYS.stocks);    }
function getShipments() { return load(STORAGE_KEYS.shipments); }
function getCustomers() { return load(STORAGE_KEYS.customers); }

// ─── 초기화 ───────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  setDefaultDates();
  renderAll();
});

function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  const mfgEl = document.getElementById('stockMfgDate');
  const shipEl = document.getElementById('shipDate');
  if (mfgEl) mfgEl.value = today;
  if (shipEl) shipEl.value = today;
}

function renderAll() {
  renderInventory();
  renderCustomerTable();
  renderHistory();
  updateKPI();
  populateLotSelect();
  populateCustomerSelects();
}

function toggleStockForm() {
  const card = document.getElementById('stockFormCard');
  if (!card) return;
  card.style.display = card.style.display === 'none' ? 'block' : 'none';
}

// ─── 탭 전환 ──────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  const btns = document.querySelectorAll('.tab-btn');
  const tabNames = ['inventory','shipment','customer','history'];
  const idx = tabNames.indexOf(name);
  if (idx >= 0 && btns[idx]) btns[idx].classList.add('active');
  if (name === 'shipment') { populateLotSelect(); populateCustomerSelects(); }
  if (name === 'history')  { populateFilterCustomer(); renderHistory(); }
}

// ─── 재고 등록 ────────────────────────────────
function addStock() {
  const lot      = document.getElementById('stockLot').value.trim();
  const type     = document.getElementById('stockProductType').value;
  const mfgDate  = document.getElementById('stockMfgDate').value;
  const pkgUnit  = parseInt(document.getElementById('stockPkgUnit').value);
  const qty      = parseInt(document.getElementById('stockQty').value);
  const note     = document.getElementById('stockNote').value.trim();

  if (!lot)     { alert('로트번호를 입력하세요.'); return; }
  if (!mfgDate) { alert('제조일을 입력하세요.');  return; }
  if (!qty || qty < 1) { alert('수량을 입력하세요.'); return; }

  const stocks = getStocks();
  const existing = stocks.find(s => s.lot === lot);
  if (existing) {
    if (!confirm(`로트번호 ${lot}가 이미 존재합니다. 수량을 추가하시겠습니까?`)) return;
    existing.inQty += qty;
    existing.note = note || existing.note;
  } else {
    stocks.push({ lot, type, mfgDate, pkgUnit, inQty: qty, note, createdAt: new Date().toISOString() });
  }
  save(STORAGE_KEYS.stocks, stocks);
  renderAll();
  document.getElementById('stockLot').value = '';
  document.getElementById('stockNote').value = '';
  alert(`✓ 재고 등록 완료: ${lot} ${qty}포`);
}

// ─── 출하 등록 ────────────────────────────────
function onShipLotChange() {
  const lot = document.getElementById('shipLot').value;
  const stocks = getStocks();
  const stock = stocks.find(s => s.lot === lot);
  const shipments = getShipments();
  const shipped = shipments.filter(s => s.lot === lot).reduce((a, b) => a + b.qty, 0);
  const avail = stock ? (stock.inQty - shipped) : 0;
  document.getElementById('shipAvailHint').textContent = `가용 재고: ${avail}포`;
  updateShipTotal();
}

document.addEventListener('input', e => {
  if (e.target.id === 'shipQty' || e.target.id === 'shipUnitPrice') updateShipTotal();
});

function updateShipTotal() {
  const qty = parseFloat(document.getElementById('shipQty').value) || 0;
  const price = parseFloat(document.getElementById('shipUnitPrice').value) || 0;
  const total = qty * price;
  const el = document.getElementById('shipTotalDisplay');
  if (el) el.textContent = total.toLocaleString('ko-KR') + '원';
}

function addShipment() {
  const lot      = document.getElementById('shipLot').value;
  const custId   = document.getElementById('shipCustomer').value;
  const date     = document.getElementById('shipDate').value;
  const qty      = parseInt(document.getElementById('shipQty').value);
  const price    = parseInt(document.getElementById('shipUnitPrice').value);
  const note     = document.getElementById('shipNote').value.trim();

  if (!lot)    { showMsg('shipMsg', '로트번호를 선택하세요.', 'error'); return; }
  if (!custId) { showMsg('shipMsg', '거래처를 선택하세요.', 'error'); return; }
  if (!date)   { showMsg('shipMsg', '출하일을 입력하세요.', 'error'); return; }
  if (!qty || qty < 1) { showMsg('shipMsg', '수량을 입력하세요.', 'error'); return; }

  // 가용 재고 확인
  const stocks = getStocks();
  const stock = stocks.find(s => s.lot === lot);
  const shipments = getShipments();
  const shipped = shipments.filter(s => s.lot === lot).reduce((a, b) => a + b.qty, 0);
  const avail = stock ? (stock.inQty - shipped) : 0;
  if (qty > avail) {
    showMsg('shipMsg', `재고 부족: 가용 ${avail}포, 요청 ${qty}포`, 'error');
    return;
  }

  const customers = getCustomers();
  const cust = customers.find(c => c.id === custId);
  const productType = stock ? stock.type : '–';

  const entry = {
    id:          `SHP-${Date.now()}`,
    lot,
    custId,
    custName:    cust ? cust.name : custId,
    date,
    qty,
    unitPrice:   price,
    totalAmount: qty * price,
    productType,
    note,
    createdAt:   new Date().toISOString(),
  };
  shipments.push(entry);
  save(STORAGE_KEYS.shipments, shipments);
  renderAll();
  document.getElementById('shipNote').value = '';
  showMsg('shipMsg', `✓ 출하 등록 완료: ${cust?.name || custId} / ${lot} / ${qty}포 / ${(qty*price).toLocaleString('ko-KR')}원`, 'success');
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `msg-box msg-${type}`;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

// ─── 거래처 등록 ──────────────────────────────
function addCustomer() {
  const name  = document.getElementById('custName').value.trim();
  const type  = document.getElementById('custType').value;
  const contact = document.getElementById('custContact').value.trim();
  const region  = document.getElementById('custRegion').value.trim();
  const price   = parseInt(document.getElementById('custDefaultPrice').value) || 0;
  const note    = document.getElementById('custNote').value.trim();

  if (!name) { alert('거래처명을 입력하세요.'); return; }

  const customers = getCustomers();
  if (customers.find(c => c.name === name)) {
    alert('이미 등록된 거래처명입니다.');
    return;
  }

  customers.push({
    id:           `CUST-${Date.now()}`,
    name, type, contact, region,
    defaultPrice: price,
    note,
    createdAt:    new Date().toISOString(),
  });
  save(STORAGE_KEYS.customers, customers);
  renderAll();
  ['custName','custContact','custRegion','custNote'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  alert(`✓ 거래처 등록: ${name}`);
}

function deleteCustomer(id) {
  const shipments = getShipments();
  if (shipments.find(s => s.custId === id)) {
    alert('납품 이력이 있는 거래처는 삭제할 수 없습니다.');
    return;
  }
  if (!confirm('삭제하시겠습니까?')) return;
  const customers = getCustomers().filter(c => c.id !== id);
  save(STORAGE_KEYS.customers, customers);
  renderAll();
}

// ─── 렌더링 ───────────────────────────────────
function getShippedByLot(lot) {
  return getShipments().filter(s => s.lot === lot).reduce((a, b) => a + b.qty, 0);
}

function renderInventory() {
  const stocks = getStocks();
  const tbody = document.getElementById('inventoryBody');
  if (!tbody) return;
  if (!stocks.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="9">등록된 재고가 없습니다.</td></tr>';
    return;
  }
  const productLabel = { A:'A형', B:'B형', C:'C형' };
  tbody.innerHTML = stocks.map(s => {
    const shipped = getShippedByLot(s.lot);
    const remain = s.inQty - shipped;
    const remainKg = remain * s.pkgUnit;
    const pct = s.inQty > 0 ? remain / s.inQty : 0;
    let status, statusClass;
    if (remain <= 0)      { status = '소진'; statusClass = 'badge-gray'; }
    else if (pct <= 0.2)  { status = '부족'; statusClass = 'badge-warn'; }
    else if (pct <= 0.5)  { status = '보통'; statusClass = 'badge-blue'; }
    else                  { status = '충분'; statusClass = 'badge-green'; }
    return `
      <tr>
        <td class="monospace">${s.lot}</td>
        <td><span class="badge badge-type-${s.type}">${productLabel[s.type] || s.type}</span></td>
        <td>${s.mfgDate}</td>
        <td>${s.pkgUnit}kg</td>
        <td>${s.inQty.toLocaleString()}</td>
        <td>${shipped.toLocaleString()}</td>
        <td><strong>${remain.toLocaleString()}</strong></td>
        <td>${remainKg.toLocaleString()}kg</td>
        <td><span class="badge ${statusClass}">${status}</span></td>
      </tr>`;
  }).join('');
}

function renderCustomerTable() {
  const customers = getCustomers();
  const shipments = getShipments();
  const tbody = document.getElementById('customerBody');
  if (!tbody) return;
  if (!customers.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">등록된 거래처가 없습니다.</td></tr>';
    return;
  }
  tbody.innerHTML = customers.map(c => {
    const custShips = shipments.filter(s => s.custId === c.id);
    const totalQty = custShips.reduce((a, b) => a + b.qty, 0);
    const totalRev = custShips.reduce((a, b) => a + b.totalAmount, 0);
    return `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td><span class="badge badge-gray">${c.type}</span></td>
        <td>${c.contact || '–'}</td>
        <td>${c.region || '–'}</td>
        <td>${(c.defaultPrice||0).toLocaleString()}원</td>
        <td>${totalQty.toLocaleString()}포</td>
        <td>${totalRev.toLocaleString()}원</td>
        <td>
          <button class="btn-xs" onclick="loadCustomerToShipment('${c.id}')">출하</button>
          <button class="btn-xs danger" onclick="deleteCustomer('${c.id}')">삭제</button>
        </td>
      </tr>`;
  }).join('');
}

function loadCustomerToShipment(custId) {
  switchTab('shipment');
  const sel = document.getElementById('shipCustomer');
  if (sel) {
    sel.value = custId;
    const cust = getCustomers().find(c => c.id === custId);
    if (cust) {
      const priceEl = document.getElementById('shipUnitPrice');
      if (priceEl && cust.defaultPrice) priceEl.value = cust.defaultPrice;
    }
  }
  updateShipTotal();
}

function renderHistory() {
  const shipments = getShipments();
  const filterCust = document.getElementById('filterCustomer')?.value || '';
  const filterProd = document.getElementById('filterProduct')?.value || '';

  const filtered = shipments.filter(s => {
    const custOk = !filterCust || s.custId === filterCust;
    const prodOk = !filterProd || s.productType === filterProd;
    return custOk && prodOk;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const tbody = document.getElementById('historyBody');
  if (!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">출하 이력이 없습니다.</td></tr>';
    document.getElementById('historySummary').innerHTML = '';
    return;
  }

  const totalQty = filtered.reduce((a, b) => a + b.qty, 0);
  const totalRev = filtered.reduce((a, b) => a + b.totalAmount, 0);
  const el = document.getElementById('historySummary');
  if (el) {
    el.innerHTML = `
      <div class="summary-stats">
        <span>총 ${filtered.length}건</span>
        <span>${totalQty.toLocaleString()}포</span>
        <span><strong>${totalRev.toLocaleString()}원</strong></span>
      </div>`;
  }

  const productLabel = { A:'A형', B:'B형', C:'C형' };
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.custName}</td>
      <td class="monospace">${s.lot}</td>
      <td><span class="badge badge-type-${s.productType}">${productLabel[s.productType] || s.productType}</span></td>
      <td>${s.qty.toLocaleString()}포</td>
      <td>${s.unitPrice.toLocaleString()}원</td>
      <td><strong>${s.totalAmount.toLocaleString()}원</strong></td>
      <td>${s.note || '–'}</td>
    </tr>
  `).join('');
}

function updateKPI() {
  const stocks = getStocks();
  const shipments = getShipments();

  let totalStockBags = 0, totalStockKg = 0, lowCount = 0;
  stocks.forEach(s => {
    const shipped = getShippedByLot(s.lot);
    const remain = s.inQty - shipped;
    totalStockBags += remain;
    totalStockKg += remain * s.pkgUnit;
    if (remain > 0 && remain / s.inQty <= 0.2) lowCount++;
  });

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const monthShips = shipments.filter(s => s.date.startsWith(thisMonth));
  const monthQty = monthShips.reduce((a, b) => a + b.qty, 0);
  const monthRev = monthShips.reduce((a, b) => a + b.totalAmount, 0);

  setText('kpiTotalStock', totalStockBags.toLocaleString() + '포');
  setText('kpiTotalKg', totalStockKg.toLocaleString() + 'kg');
  setText('kpiThisMonthShip', monthQty.toLocaleString() + '포');
  setText('kpiThisMonthRev', monthRev.toLocaleString() + '원');
  setText('kpiLowStockVal', lowCount + '건');

  const kpiLow = document.getElementById('kpiLowStock');
  if (kpiLow) kpiLow.className = 'kpi-card' + (lowCount > 0 ? ' warn' : '');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── 셀렉트 채우기 ────────────────────────────
function populateLotSelect() {
  const sel = document.getElementById('shipLot');
  if (!sel) return;
  const stocks = getStocks();
  const shipments = getShipments();
  const prev = sel.value;
  sel.innerHTML = '<option value="">— 로트 선택 —</option>';
  stocks.forEach(s => {
    const shipped = shipments.filter(sh => sh.lot === s.lot).reduce((a,b)=>a+b.qty,0);
    const remain = s.inQty - shipped;
    if (remain > 0) {
      const opt = document.createElement('option');
      opt.value = s.lot;
      const label = {A:'A형',B:'B형',C:'C형'}[s.type] || s.type;
      opt.textContent = `${s.lot} [${label} / 잔여 ${remain}포]`;
      if (s.lot === prev) opt.selected = true;
      sel.appendChild(opt);
    }
  });
  onShipLotChange();
}

function populateCustomerSelects() {
  const customers = getCustomers();
  ['shipCustomer'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '<option value="">— 거래처 선택 —</option>';
    customers.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.type})`;
      if (c.id === prev) opt.selected = true;
      sel.appendChild(opt);
    });
  });
}

function populateFilterCustomer() {
  const sel = document.getElementById('filterCustomer');
  if (!sel) return;
  const customers = getCustomers();
  const prev = sel.value;
  sel.innerHTML = '<option value="">전체 거래처</option>';
  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    if (c.id === prev) opt.selected = true;
    sel.appendChild(opt);
  });
}

// ─── 내보내기 ─────────────────────────────────
function exportHistoryCSV() {
  const shipments = getShipments().sort((a,b)=>b.date.localeCompare(a.date));
  if (!shipments.length) { alert('이력이 없습니다.'); return; }
  const rows = [
    ['출하일','거래처','로트번호','제품유형','수량(포)','단가(원)','금액(원)','비고'],
    ...shipments.map(s => [s.date, s.custName, s.lot, s.productType, s.qty, s.unitPrice, s.totalAmount, s.note||''])
  ];
  downloadCSV(rows, `farmerstree-shipments-${ymd()}.csv`);
}

function exportAllCSV() {
  exportHistoryCSV();
}

function backupJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    stocks:    getStocks(),
    shipments: getShipments(),
    customers: getCustomers(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `farmerstree-backup-${ymd()}.json`; a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function clearAll() {
  if (!confirm('모든 재고·출하·거래처 데이터를 삭제합니다. 계속하시겠습니까?')) return;
  if (!confirm('정말로 삭제합니다. 이 작업은 되돌릴 수 없습니다.')) return;
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  renderAll();
  alert('초기화 완료');
}

function ymd() {
  return new Date().toISOString().split('T')[0].replace(/-/g,'');
}

```

---
## FILE: sales-manager/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>재고·출하·거래처 관리 — Farmerstree</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <span class="logo">Farmerstree Fertilizer Platform</span>
    <nav class="header-nav">
      <a href="../calculator/">수익성 계산기</a>
      <a href="../quality-dashboard/">품질검사</a>
      <a href="../farmer-roi-calculator/">농가 ROI</a>
      <a href="../sales-manager/" class="active">재고·거래처</a>
    </nav>
  </div>
</header>

<main class="container">
  <h1 class="page-title">재고·출하·거래처 관리</h1>
  <p class="page-desc">로트별 재고 현황, 출하 이력, 거래처 납품 관리를 통합합니다.</p>

  <!-- KPI 대시보드 -->
  <div class="kpi-row">
    <div class="kpi-card" id="kpiTotalStockCard">
      <div class="kpi-label">총 재고 (포대)</div>
      <div class="kpi-value" id="kpiTotalStock">0</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">총 재고 (kg)</div>
      <div class="kpi-value" id="kpiTotalKg">0</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">이번 달 출하</div>
      <div class="kpi-value" id="kpiThisMonthShip">0포</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">이번 달 매출</div>
      <div class="kpi-value" id="kpiThisMonthRev">0원</div>
    </div>
    <div class="kpi-card" id="kpiLowStock">
      <div class="kpi-label">재고 부족 로트</div>
      <div class="kpi-value" id="kpiLowStockVal">0건</div>
    </div>
  </div>

  <!-- 탭 -->
  <div class="tab-bar">
    <button class="tab-btn active" onclick="switchTab('inventory')">재고 현황</button>
    <button class="tab-btn" onclick="switchTab('shipment')">출하 등록</button>
    <button class="tab-btn" onclick="switchTab('customer')">거래처 관리</button>
    <button class="tab-btn" onclick="switchTab('history')">납품 이력</button>
  </div>

  <!-- ── 탭 1: 재고 현황 ── -->
  <div class="tab-content active" id="tab-inventory">

    <section class="card">
      <div class="section-header">
        <h2 class="section-title">로트별 재고</h2>
        <button class="btn-toggle" onclick="toggleStockForm()">+ 재고 등록</button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>로트번호</th>
              <th>제품유형</th>
              <th>제조일</th>
              <th>포장단위</th>
              <th>입고(포)</th>
              <th>출하(포)</th>
              <th>잔여(포)</th>
              <th>잔여(kg)</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody id="inventoryBody">
            <tr class="empty-row"><td colspan="9">등록된 재고가 없습니다.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 재고 등록 폼 (기본 숨김) -->
    <section class="card" id="stockFormCard" style="display:none;">
      <h2 class="section-title">재고 입고 등록</h2>
      <p class="section-desc">생산 완료된 배치를 재고로 등록합니다. 로트번호는 품질검사 대시보드의 제조번호와 일치시키세요.</p>

      <div class="form-grid-3">
        <div class="form-group">
          <label for="stockLot">로트번호 (제조번호)</label>
          <input type="text" id="stockLot" placeholder="예) FT-BIO-20260430-001" />
        </div>
        <div class="form-group">
          <label for="stockProductType">제품 유형</label>
          <select id="stockProductType">
            <option value="A">A형 — 후배지 고부숙 펠릿</option>
            <option value="B">B형 — 기능성 미생물 펠릿</option>
            <option value="C">C형 — 바이오차 복합 펠릿</option>
          </select>
        </div>
        <div class="form-group">
          <label for="stockMfgDate">제조일</label>
          <input type="date" id="stockMfgDate" />
        </div>
        <div class="form-group">
          <label for="stockPkgUnit">포장 단위 (kg)</label>
          <select id="stockPkgUnit">
            <option value="20">20kg</option>
            <option value="10">10kg</option>
            <option value="5">5kg</option>
          </select>
        </div>
        <div class="form-group">
          <label for="stockQty">입고 수량 (포대)</label>
          <input type="number" id="stockQty" min="1" placeholder="0" />
        </div>
        <div class="form-group">
          <label for="stockNote">비고</label>
          <input type="text" id="stockNote" placeholder="선택 입력" />
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="addStock()">재고 등록</button>
        <button class="btn btn-ghost" onclick="toggleStockForm()">취소</button>
      </div>
    </section>

  </div><!-- /tab-inventory -->

  <!-- ── 탭 2: 출하 등록 ── -->
  <div class="tab-content" id="tab-shipment">

    <section class="card">
      <h2 class="section-title">출하 등록</h2>
      <p class="section-desc">거래처에 납품할 때 출하 내역을 기록합니다.</p>

      <div class="form-grid-3">
        <div class="form-group">
          <label for="shipLot">로트번호</label>
          <select id="shipLot" onchange="onShipLotChange()">
            <option value="">— 로트 선택 —</option>
          </select>
        </div>
        <div class="form-group">
          <label for="shipCustomer">거래처</label>
          <select id="shipCustomer">
            <option value="">— 거래처 선택 —</option>
          </select>
        </div>
        <div class="form-group">
          <label for="shipDate">출하일</label>
          <input type="date" id="shipDate" />
        </div>
        <div class="form-group">
          <label for="shipQty">수량 (포대) <span class="avail-hint" id="shipAvailHint">가용 재고: –</span></label>
          <input type="number" id="shipQty" min="1" placeholder="0" />
        </div>
        <div class="form-group">
          <label for="shipUnitPrice">단가</label>
          <div class="input-unit-row">
            <input type="number" id="shipUnitPrice" min="0" placeholder="0" />
            <span class="unit">원 / 포대</span>
          </div>
        </div>
        <div class="form-group">
          <label for="shipNote">비고</label>
          <input type="text" id="shipNote" placeholder="선택 입력" />
        </div>
      </div>

      <div class="ship-total-row">
        <span class="ship-total-label">출하 금액 (자동 계산)</span>
        <span class="ship-total-value" id="shipTotalDisplay">0원</span>
      </div>

      <div id="shipMsg" class="msg-box" style="display:none;"></div>

      <div class="form-actions">
        <button class="btn btn-primary" onclick="addShipment()">출하 등록</button>
      </div>
    </section>

  </div><!-- /tab-shipment -->

  <!-- ── 탭 3: 거래처 관리 ── -->
  <div class="tab-content" id="tab-customer">

    <!-- 거래처 등록 폼 -->
    <section class="card">
      <h2 class="section-title">거래처 등록</h2>
      <div class="form-grid-3">
        <div class="form-group">
          <label for="custName">거래처명</label>
          <input type="text" id="custName" placeholder="예) 한국농협 XX지점" />
        </div>
        <div class="form-group">
          <label for="custType">유형</label>
          <select id="custType">
            <option value="농협">농협</option>
            <option value="영농조합">영농조합</option>
            <option value="직거래 농가">직거래 농가</option>
            <option value="유통업체">유통업체</option>
            <option value="공공기관">공공기관</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div class="form-group">
          <label for="custContact">담당자 / 연락처</label>
          <input type="text" id="custContact" placeholder="홍길동 / 010-0000-0000" />
        </div>
        <div class="form-group">
          <label for="custRegion">지역</label>
          <input type="text" id="custRegion" placeholder="예) 전남 나주시" />
        </div>
        <div class="form-group">
          <label for="custDefaultPrice">기본 단가</label>
          <div class="input-unit-row">
            <input type="number" id="custDefaultPrice" min="0" placeholder="0" />
            <span class="unit">원/포</span>
          </div>
        </div>
        <div class="form-group">
          <label for="custNote">비고</label>
          <input type="text" id="custNote" placeholder="선택 입력" />
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="addCustomer()">거래처 등록</button>
      </div>
    </section>

    <!-- 거래처 목록 -->
    <section class="card">
      <h2 class="section-title">거래처 목록</h2>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>거래처명</th>
              <th>유형</th>
              <th>담당자/연락처</th>
              <th>지역</th>
              <th>기본단가</th>
              <th>총 납품</th>
              <th>총 매출</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody id="customerBody">
            <tr class="empty-row"><td colspan="8">등록된 거래처가 없습니다.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

  </div><!-- /tab-customer -->

  <!-- ── 탭 4: 납품 이력 ── -->
  <div class="tab-content" id="tab-history">

    <section class="card">
      <div class="section-header">
        <h2 class="section-title">납품 이력</h2>
        <div class="filter-row">
          <select id="filterCustomer" onchange="renderHistory()">
            <option value="">전체 거래처</option>
          </select>
          <select id="filterProduct" onchange="renderHistory()">
            <option value="">전체 제품</option>
            <option value="A">A형</option>
            <option value="B">B형</option>
            <option value="C">C형</option>
          </select>
          <button class="btn btn-outline" onclick="exportHistoryCSV()">CSV 내보내기</button>
        </div>
      </div>

      <div id="historySummary"></div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>출하일</th>
              <th>거래처</th>
              <th>로트번호</th>
              <th>제품유형</th>
              <th>수량(포)</th>
              <th>단가</th>
              <th>금액</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody id="historyBody">
            <tr class="empty-row"><td colspan="8">출하 이력이 없습니다.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

  </div><!-- /tab-history -->

  <!-- 데이터 관리 -->
  <section class="card data-mgmt-card">
    <h2 class="section-title">데이터 관리</h2>
    <div class="data-mgmt-row">
      <button class="btn btn-outline" onclick="exportAllCSV()">전체 데이터 CSV 내보내기</button>
      <button class="btn btn-outline" onclick="backupJSON()">JSON 백업</button>
      <button class="btn btn-danger" onclick="clearAll()">전체 초기화</button>
    </div>
    <p class="data-mgmt-note">※ localStorage 저장 방식입니다. 정기적으로 CSV/JSON 백업을 권장합니다.</p>
  </section>

</main>

<footer class="site-footer">
  <a href="../index.html">← Farmerstree Fertilizer Platform 메인으로</a>
</footer>

<script src="app.js"></script>
</body>
</html>

```

---
## FILE: sales-manager/style.css
```
/* ─────────────────────────────────────────────
   Farmerstree — 재고·출하·거래처 관리  style.css
───────────────────────────────────────────── */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green-50:  #f0faf4;
  --green-100: #d1f0dc;
  --green-400: #4db87a;
  --green-600: #2a8a52;
  --green-800: #14532d;
  --gray-50:   #f9f9f7;
  --gray-100:  #f0ede8;
  --gray-200:  #e0dbd2;
  --gray-400:  #9c9688;
  --gray-600:  #5a5650;
  --gray-800:  #2e2b26;
  --amber-50:  #fffbeb;
  --amber-100: #fef3c7;
  --amber-400: #d97706;
  --blue-50:   #eff6ff;
  --blue-400:  #3b82f6;
  --red-50:    #fef2f2;
  --red-100:   #fee2e2;
  --red-400:   #f87171;
  --red-600:   #dc2626;
  --bg:        #fafaf8;
  --card:      #ffffff;
  --border:    rgba(0,0,0,0.08);
  --text:      #1e1c18;
  --text-sub:  #6b6560;
  --radius:    12px;
  --shadow:    0 1px 4px rgba(0,0,0,0.06);
}

body {
  font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  line-height: 1.65;
}

/* ── 헤더 ── */
.site-header {
  background: var(--green-800);
  display: flex; align-items: center; gap: 20px;
  padding: 0 24px; height: 52px;
  position: sticky; top: 0; z-index: 100; flex-wrap: wrap;
}
.site-logo {
  color: #fff; font-size: 14px; font-weight: 700;
  text-decoration: none; white-space: nowrap;
}
.site-nav { display: flex; gap: 4px; flex-wrap: wrap; }
.site-nav a {
  color: rgba(255,255,255,0.65); text-decoration: none;
  font-size: 12px; padding: 4px 10px; border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.site-nav a:hover  { background: rgba(255,255,255,0.1); color: #fff; }
.site-nav a.active { background: rgba(255,255,255,0.18); color: #fff; font-weight: 500; }

/* ── 컨테이너 ── */
.container { max-width: 1000px; margin: 0 auto; padding: 28px 20px 60px; }

/* ── 페이지 타이틀 ── */
.page-header { margin-bottom: 20px; }
.page-header h1 { font-size: 22px; font-weight: 700; color: var(--green-800); margin-bottom: 4px; }
.page-desc { font-size: 13px; color: var(--text-sub); }

/* ── 탭 ── */
.tab-bar {
  display: flex; gap: 4px; margin-bottom: 20px;
  border-bottom: 2px solid var(--gray-100); padding-bottom: 0;
  flex-wrap: wrap;
}
.tab-btn {
  padding: 8px 18px; border: none; background: none;
  font-size: 14px; font-weight: 500; color: var(--gray-400);
  cursor: pointer; border-radius: 8px 8px 0 0;
  font-family: inherit; transition: color 0.15s, background 0.15s;
  border-bottom: 2px solid transparent; margin-bottom: -2px;
}
.tab-btn:hover  { color: var(--green-600); background: var(--green-50); }
.tab-btn.active { color: var(--green-600); border-bottom-color: var(--green-600); }

.tab-content { display: none; }
.tab-content.active { display: block; }

/* ── 카드 ── */
.card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 22px 24px;
  margin-bottom: 18px; box-shadow: var(--shadow);
}
.section-title {
  font-size: 15px; font-weight: 700; color: var(--green-800);
  margin-bottom: 16px; padding-bottom: 10px;
  border-bottom: 1px solid var(--gray-100);
}
.section-header-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; padding-bottom: 10px;
  border-bottom: 1px solid var(--gray-100); flex-wrap: wrap; gap: 8px;
}
.section-hint {
  font-size: 12px; color: var(--text-sub); margin-bottom: 14px;
  background: var(--green-50); padding: 8px 12px;
  border-radius: 6px; border-left: 3px solid var(--green-400);
}

/* ── KPI ── */
.kpi-row { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
.kpi-card {
  background: var(--gray-50); border: 1px solid var(--gray-100);
  border-radius: 10px; padding: 14px 18px; flex: 1; min-width: 130px;
}
.kpi-card.warn { background: var(--amber-50); border-color: var(--amber-100); }
.kpi-label { font-size: 11px; color: var(--text-sub); margin-bottom: 4px; }
.kpi-value { font-size: 18px; font-weight: 700; color: var(--green-800); }
.kpi-card.warn .kpi-value { color: var(--amber-400); }

/* ── 폼 ── */
.form-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px;
}
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 12px; font-weight: 500; color: var(--gray-600); }
.form-group label .unit { font-weight: 400; color: var(--gray-400); font-size: 11px; }
.form-group input,
.form-group select {
  padding: 8px 10px; border: 1px solid var(--gray-200); border-radius: 7px;
  font-size: 14px; color: var(--text); background: var(--bg); font-family: inherit;
  transition: border-color 0.15s; width: 100%;
}
.form-group input:focus,
.form-group select:focus { outline: none; border-color: var(--green-400); }
.input-hint { font-size: 11px; color: var(--text-sub); }

.calc-display {
  padding: 10px 14px; background: var(--green-50);
  border: 1px solid var(--green-100); border-radius: 7px;
  font-size: 16px; font-weight: 700; color: var(--green-600);
}

/* ── 테이블 ── */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th {
  background: var(--green-50); color: var(--green-800); font-weight: 600;
  padding: 9px 12px; text-align: left; border-bottom: 1.5px solid var(--green-100);
  white-space: nowrap;
}
.data-table td {
  padding: 8px 12px; border-bottom: 1px solid var(--gray-100); vertical-align: middle;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--gray-50); }
.empty-row td {
  text-align: center; color: var(--text-sub); padding: 24px;
  font-size: 13px; background: var(--gray-50);
}
.monospace { font-family: 'DM Mono', 'Fira Code', monospace; font-size: 12px; }

/* ── 배지 ── */
.badge {
  display: inline-block; padding: 2px 8px; border-radius: 12px;
  font-size: 11px; font-weight: 600; white-space: nowrap;
}
.badge-green { background: var(--green-50); color: var(--green-600); border: 1px solid var(--green-100); }
.badge-warn  { background: var(--amber-50); color: var(--amber-400); border: 1px solid var(--amber-100); }
.badge-blue  { background: var(--blue-50);  color: var(--blue-400);  border: 1px solid #dbeafe; }
.badge-gray  { background: var(--gray-100); color: var(--gray-600);  border: 1px solid var(--gray-200); }
.badge-type-A { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
.badge-type-B { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.badge-type-C { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

/* ── 버튼 ── */
.action-row { display: flex; gap: 8px; flex-wrap: wrap; }
.btn-primary {
  padding: 9px 18px; background: var(--green-600); color: #fff;
  border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: background 0.15s;
}
.btn-primary:hover { background: var(--green-800); }
.btn-secondary {
  padding: 9px 18px; background: var(--card); color: var(--green-600);
  border: 1.5px solid var(--green-400); border-radius: 8px;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: background 0.15s;
}
.btn-secondary:hover { background: var(--green-50); }
.btn-danger {
  padding: 9px 18px; background: var(--card); color: var(--red-600);
  border: 1.5px solid var(--red-400); border-radius: 8px;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: background 0.15s;
}
.btn-danger:hover { background: var(--red-50); }
.btn-small {
  padding: 5px 12px; background: var(--green-600); color: #fff;
  border: none; border-radius: 6px; font-size: 12px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: background 0.15s; white-space: nowrap;
}
.btn-small:hover { background: var(--green-800); }
.btn-xs {
  padding: 3px 8px; border-radius: 5px; font-size: 11px; font-weight: 500;
  cursor: pointer; font-family: inherit; border: 1px solid var(--gray-200);
  background: var(--bg); color: var(--text); transition: background 0.15s;
}
.btn-xs:hover  { background: var(--green-50); border-color: var(--green-400); }
.btn-xs.danger { color: var(--red-600); border-color: var(--red-400); }
.btn-xs.danger:hover { background: var(--red-50); }

/* ── 필터 행 ── */
.filter-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.filter-row select {
  padding: 5px 10px; border: 1px solid var(--gray-200); border-radius: 6px;
  font-size: 12px; background: var(--bg); font-family: inherit;
}

/* ── 납품 이력 요약 ── */
.history-summary { margin-bottom: 12px; }
.summary-stats {
  display: flex; gap: 20px; flex-wrap: wrap;
  font-size: 13px; color: var(--text-sub); padding: 8px 12px;
  background: var(--gray-50); border-radius: 7px;
}
.summary-stats strong { color: var(--green-600); font-weight: 700; }

/* ── 메시지 ── */
.msg-box {
  padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-top: 12px;
}
.msg-success { background: var(--green-50); color: var(--green-600); border: 1px solid var(--green-100); }
.msg-error   { background: var(--red-50);   color: var(--red-600);   border: 1px solid var(--red-100); }

/* ── 위험 구역 ── */
.danger-zone { border-color: var(--red-100); }

/* ── 참고 ── */
.ref-note { font-size: 11px; color: var(--text-sub); line-height: 1.5; }

/* ── 푸터 ── */
.site-footer {
  background: var(--green-800); color: rgba(255,255,255,0.7);
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; font-size: 12px; margin-top: 40px;
}
.site-footer a { color: rgba(255,255,255,0.7); text-decoration: none; }
.site-footer a:hover { color: #fff; }

/* ── 인쇄 ── */
@media print {
  .site-header, .site-footer, .tab-bar, .action-row, .btn-xs { display: none; }
  .tab-content { display: block !important; }
  .card { box-shadow: none; border: 1px solid #ccc; }
}

/* ── 모바일 ── */
@media (max-width: 640px) {
  .container { padding: 16px 12px 40px; }
  .form-grid { grid-template-columns: 1fr 1fr; }
  .kpi-row { gap: 8px; }
  .kpi-card { min-width: 100px; padding: 10px 12px; }
  .kpi-value { font-size: 15px; }
  .site-header { height: auto; padding: 10px 16px; gap: 8px; }
  .data-table { font-size: 12px; }
  .data-table th, .data-table td { padding: 6px 8px; }
}

/* ── 현재 HTML 호환 클래스 ── */
.header-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}
.logo {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}
.header-nav {
  margin-left: auto;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.header-nav a {
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.header-nav a:hover { background: rgba(255,255,255,0.1); color: #fff; }
.header-nav a.active { background: rgba(255,255,255,0.18); color: #fff; font-weight: 500; }

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--green-800);
  margin-bottom: 4px;
}
.page-desc { margin-bottom: 16px; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.form-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.input-unit-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.input-unit-row input { flex: 1; }
.unit {
  font-size: 11px;
  color: var(--text-sub);
  white-space: nowrap;
}

.btn {
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  border: none;
}
.btn-primary { background: var(--green-600); color: #fff; }
.btn-ghost {
  background: var(--card);
  color: var(--green-600);
  border: 1.5px solid var(--green-400);
}
.btn-outline {
  background: var(--card);
  color: var(--green-600);
  border: 1.5px solid var(--green-400);
}
.btn-toggle {
  padding: 5px 12px;
  background: var(--green-600);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.btn-toggle:hover { background: var(--green-800); }

.ship-total-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 7px;
  background: var(--green-50);
  border: 1px solid var(--green-100);
}
.ship-total-label { font-size: 12px; color: var(--gray-600); }
.ship-total-value { font-size: 16px; font-weight: 700; color: var(--green-600); }
.avail-hint { font-size: 11px; font-weight: 400; color: var(--text-sub); }

.data-mgmt-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.data-mgmt-note {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-sub);
}

@media (max-width: 900px) {
  .form-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .form-grid-3 { grid-template-columns: 1fr; }
}

```

---
## FILE: soil-carbon-calculator/app.js
```
const inputs = {
  projectName: document.getElementById("projectName"),
  areaM2: document.getElementById("areaM2"),
  productKg: document.getElementById("productKg"),
  biocharBlendRatio: document.getElementById("biocharBlendRatio"),
  fixedCarbonRatio: document.getElementById("fixedCarbonRatio"),
  stabilityRatio: document.getElementById("stabilityRatio"),
  baselineFertilizerKg: document.getElementById("baselineFertilizerKg"),
  fertilizerReductionRatio: document.getElementById("fertilizerReductionRatio"),
  cropName: document.getElementById("cropName"),
  usePurpose: document.getElementById("usePurpose"),
};

const outputs = {
  areaResult: document.getElementById("areaResult"),
  productPer10a: document.getElementById("productPer10a"),
  biocharKg: document.getElementById("biocharKg"),
  fixedCarbonKg: document.getElementById("fixedCarbonKg"),
  stableCarbonKg: document.getElementById("stableCarbonKg"),
  co2eKg: document.getElementById("co2eKg"),
  fertilizerSavedKg: document.getElementById("fertilizerSavedKg"),
  message: document.getElementById("message"),
  reportText: document.getElementById("reportText"),
};

const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");

let currentReport = "";

function num(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function formatKg(value, suffix = "kg") {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}톤${suffix === "kg" ? "" : " " + suffix}`;
  }

  return `${value.toLocaleString("ko-KR", {
    maximumFractionDigits: 1,
  })}${suffix}`;
}

function formatNumber(value) {
  return value.toLocaleString("ko-KR", {
    maximumFractionDigits: 1,
  });
}

function calculate() {
  const projectName = inputs.projectName.value.trim();
  const areaM2 = num(inputs.areaM2);
  const productKg = num(inputs.productKg);
  const biocharBlendRatio = num(inputs.biocharBlendRatio) / 100;
  const fixedCarbonRatio = num(inputs.fixedCarbonRatio) / 100;
  const stabilityRatio = num(inputs.stabilityRatio) / 100;
  const baselineFertilizerKg = num(inputs.baselineFertilizerKg);
  const fertilizerReductionRatio = num(inputs.fertilizerReductionRatio) / 100;
  const cropName = inputs.cropName.value.trim();
  const usePurpose = inputs.usePurpose.value;

  const area10a = areaM2 / 1000;
  const productPer10a = area10a > 0 ? productKg / area10a : 0;

  const biocharKg = productKg * biocharBlendRatio;
  const fixedCarbonKg = biocharKg * fixedCarbonRatio;
  const stableCarbonKg = fixedCarbonKg * stabilityRatio;

  // C to CO2 conversion factor: 44 / 12 = 3.6667
  const co2eKg = stableCarbonKg * (44 / 12);

  const fertilizerSavedKg = baselineFertilizerKg * fertilizerReductionRatio;

  outputs.areaResult.textContent = `${formatNumber(areaM2)}㎡ / ${formatNumber(area10a)}단보`;
  outputs.productPer10a.textContent = `${formatNumber(productPer10a)}kg/10a`;
  outputs.biocharKg.textContent = formatKg(biocharKg);
  outputs.fixedCarbonKg.textContent = `${formatNumber(fixedCarbonKg)}kg C`;
  outputs.stableCarbonKg.textContent = `${formatNumber(stableCarbonKg)}kg C`;
  outputs.co2eKg.textContent = `${formatNumber(co2eKg)}kg CO₂e`;
  outputs.fertilizerSavedKg.textContent = formatKg(fertilizerSavedKg);

  outputs.message.textContent = makeMessage({
    productPer10a,
    biocharKg,
    stableCarbonKg,
    co2eKg,
    fertilizerSavedKg,
  });

  currentReport = makeReport({
    projectName,
    areaM2,
    area10a,
    productKg,
    productPer10a,
    biocharBlendRatio,
    biocharKg,
    fixedCarbonRatio,
    fixedCarbonKg,
    stabilityRatio,
    stableCarbonKg,
    co2eKg,
    baselineFertilizerKg,
    fertilizerReductionRatio,
    fertilizerSavedKg,
    cropName,
    usePurpose,
  });

  outputs.reportText.textContent = currentReport;
}

function makeMessage({
  productPer10a,
  biocharKg,
  stableCarbonKg,
  co2eKg,
  fertilizerSavedKg,
}) {
  if (biocharKg <= 0) {
    return "Biochar 혼합비가 0%입니다. 탄소저장형 제품이 아니라 일반 후배지 펠릿비료 적용으로 계산됩니다.";
  }

  return `이번 조건에서는 10a당 제품 ${formatNumber(productPer10a)}kg을 투입하며, 총 SMS biochar ${formatKg(biocharKg)}이 토양에 들어갑니다. 안정화 탄소량은 약 ${formatNumber(stableCarbonKg)}kg C, CO₂e 환산량은 약 ${formatNumber(co2eKg)}kg CO₂e입니다. 예상 화학비료 절감량은 약 ${formatKg(fertilizerSavedKg)}입니다.`;
}

function makeReport(data) {
  const today = new Date().toISOString().slice(0, 10);

  return `# Farmerstree 토양·탄소 리포트

## 1. 기본 정보

| 항목 | 내용 |
|---|---|
| 프로젝트명 | ${data.projectName} |
| 리포트 생성일 | ${today} |
| 대상 작물 | ${data.cropName} |
| 적용 목적 | ${data.usePurpose} |
| 대상 면적 | ${formatNumber(data.areaM2)}㎡ |
| 대상 면적 환산 | ${formatNumber(data.area10a)}단보, 10a 기준 |

---

## 2. 투입 조건

| 항목 | 값 |
|---|---:|
| 투입 제품 총량 | ${formatKg(data.productKg)} |
| 10a당 제품 투입량 | ${formatNumber(data.productPer10a)}kg/10a |
| 제품 내 biochar 혼합비 | ${(data.biocharBlendRatio * 100).toFixed(1)}% |
| 총 SMS biochar 투입량 | ${formatKg(data.biocharKg)} |
| Biochar 고정탄소 함량 | ${(data.fixedCarbonRatio * 100).toFixed(1)}% |
| 탄소 안정화율 | ${(data.stabilityRatio * 100).toFixed(1)}% |

---

## 3. 탄소저장 추정

| 항목 | 값 |
|---|---:|
| 총 고정탄소량 | ${formatNumber(data.fixedCarbonKg)}kg C |
| 안정화 탄소량 | ${formatNumber(data.stableCarbonKg)}kg C |
| CO₂e 환산량 | ${formatNumber(data.co2eKg)}kg CO₂e |

계산식:

\`\`\`text
총 biochar 투입량 × 고정탄소 함량 = 총 고정탄소량
총 고정탄소량 × 탄소 안정화율 = 안정화 탄소량
안정화 탄소량 × 44/12 = CO₂e 환산량
\`\`\`

주의:

\`\`\`text
본 CO₂e 값은 내부 추정치이다.
공식 탄소크레딧, 배출권, 인증 용도로 사용하려면 별도 방법론, 검증기관, 시험성적서, 모니터링 절차가 필요하다.
\`\`\`

---

## 4. 화학비료 절감 추정

| 항목 | 값 |
|---|---:|
| 기존 화학비료 사용량 | ${formatKg(data.baselineFertilizerKg)} |
| 예상 절감률 | ${(data.fertilizerReductionRatio * 100).toFixed(1)}% |
| 예상 절감량 | ${formatKg(data.fertilizerSavedKg)} |

---

## 5. 토양개량 설명 문장

Farmerstree SMS biochar 복합 펠릿비료는 버섯 후배지 유래 고부숙 유기질비료와 SMS biochar를 결합한 토양개량형 제품이다. 후배지 펠릿은 유기물과 양분을 공급하고, SMS biochar는 다공성 탄소 구조를 통해 토양 수분 보유, 양분 보유, 토양 구조 개선, 장기 탄소저장 가능성을 보완한다.

본 조건에서는 ${formatNumber(data.areaM2)}㎡ 면적에 제품 ${formatKg(data.productKg)}을 투입하며, 이 중 SMS biochar는 약 ${formatKg(data.biocharKg)}이다. 추정 안정화 탄소량은 약 ${formatNumber(data.stableCarbonKg)}kg C이며, CO₂e 환산 시 약 ${formatNumber(data.co2eKg)}kg CO₂e에 해당한다.

---

## 6. ESG·공공사업용 설명 문장

본 실증은 버섯 재배 후 발생하는 후배지를 단순 폐기물이 아닌 순환형 토양자원으로 전환하는 프로젝트이다. 후배지는 고부숙 펠릿비료로 전환되고, 일부 후배지는 SMS biochar로 전환되어 토양개량과 탄소저장 기능을 동시에 수행한다. Farmerstree 플랫폼은 제조번호, 원료 이력, 발효 온도, 품질검사, biochar 로트, 토양 투입량, 탄소저장 추정치를 데이터로 기록하여 순환농업·토양복원·ESG형 농업 인프라로 확장할 수 있다.

---

## 7. 확인 사항

- [ ] biochar 로트번호 확인
- [ ] 혼합 대상 비료 제조번호 확인
- [ ] 토양 투입 면적 확인
- [ ] 투입 전 토양검정 확보
- [ ] 투입 후 토양 pH, EC, 유기물 변화 기록
- [ ] 작물 수량 및 품질 변화 기록
- [ ] 공식 탄소인증 여부는 별도 검토

---

## 8. 결론

본 조건은 Farmerstree 후배지 기능성 펠릿비료를 탄소형 토양개량 제품으로 확장하는 기초 설계이다. 내부 추정 기준으로는 약 ${formatNumber(data.co2eKg)}kg CO₂e의 탄소저장 효과를 설명할 수 있으나, 공식 인증 목적이 아니라 내부 실증·제안서·사업계획서용 추정치로 관리해야 한다.
`;
}

async function copyReport() {
  if (!currentReport) {
    calculate();
  }

  try {
    await navigator.clipboard.writeText(currentReport);
    window.alert("토양·탄소 리포트 문장이 복사되었습니다.");
  } catch {
    window.alert("복사에 실패했습니다. 리포트 내용을 직접 선택해 복사하세요.");
  }
}

function downloadReport() {
  if (!currentReport) {
    calculate();
  }

  const today = new Date().toISOString().slice(0, 10);
  const blob = new Blob([currentReport], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `farmerstree-soil-carbon-report-${today}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", calculate);
  input.addEventListener("change", calculate);
});

copyButton.addEventListener("click", copyReport);
downloadButton.addEventListener("click", downloadReport);

calculate();

```

---
## FILE: soil-carbon-calculator/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 토양·탄소 리포트 계산기</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>토양·탄소 리포트 계산기</h1>
      <p class="description">
        SMS biochar 복합 펠릿비료의 토양 투입량, 면적당 투입량, 고정탄소량,
        CO₂e 환산량, 화학비료 절감률을 계산하고 ESG·공공사업용 설명 문장을 생성합니다.
      </p>
    </section>

    <section class="grid">
      <section class="card input-card">
        <h2>입력값</h2>

        <label>
          프로젝트명
          <input id="projectName" type="text" value="Farmerstree SMS Biochar 토양복원 실증" />
        </label>

        <label>
          대상 농지 면적 ㎡
          <input id="areaM2" type="number" value="3300" min="1" step="1" />
        </label>

        <label>
          투입 제품 총량 kg
          <input id="productKg" type="number" value="1000" min="0" step="0.1" />
        </label>

        <label>
          제품 내 biochar 혼합비 %
          <input id="biocharBlendRatio" type="number" value="5" min="0" max="100" step="0.1" />
        </label>

        <label>
          Biochar 고정탄소 함량 %
          <input id="fixedCarbonRatio" type="number" value="55" min="0" max="100" step="0.1" />
        </label>

        <label>
          탄소 안정화율 %
          <input id="stabilityRatio" type="number" value="80" min="0" max="100" step="0.1" />
        </label>

        <label>
          기존 화학비료 사용량 kg
          <input id="baselineFertilizerKg" type="number" value="300" min="0" step="0.1" />
        </label>

        <label>
          예상 화학비료 절감률 %
          <input id="fertilizerReductionRatio" type="number" value="20" min="0" max="100" step="0.1" />
        </label>

        <label>
          작물
          <input id="cropName" type="text" value="고추 / 마늘 / 양파 / 과수" />
        </label>

        <label>
          적용 목적
          <select id="usePurpose">
            <option value="토양개량">토양개량</option>
            <option value="탄소저장">탄소저장</option>
            <option value="염류 완충">염류 완충</option>
            <option value="수분 보유력 개선">수분 보유력 개선</option>
            <option value="ESG 실증">ESG 실증</option>
            <option value="공공사업 제안">공공사업 제안</option>
          </select>
        </label>
      </section>

      <section class="card result-card">
        <h2>계산 결과</h2>

        <div class="result-row">
          <span>대상 면적</span>
          <strong id="areaResult">0㎡</strong>
        </div>

        <div class="result-row">
          <span>10a당 제품 투입량</span>
          <strong id="productPer10a">0kg</strong>
        </div>

        <div class="result-row">
          <span>총 biochar 투입량</span>
          <strong id="biocharKg">0kg</strong>
        </div>

        <div class="result-row">
          <span>총 고정탄소량</span>
          <strong id="fixedCarbonKg">0kg C</strong>
        </div>

        <div class="result-row">
          <span>안정화 탄소량</span>
          <strong id="stableCarbonKg">0kg C</strong>
        </div>

        <div class="highlight">
          <span>추정 CO₂e 환산량</span>
          <strong id="co2eKg">0kg CO₂e</strong>
        </div>

        <div class="highlight secondary">
          <span>화학비료 절감량</span>
          <strong id="fertilizerSavedKg">0kg</strong>
        </div>

        <div id="message" class="message">
          계산 결과가 여기에 표시됩니다.
        </div>
      </section>
    </section>

    <section class="card">
      <h2>리포트 문장</h2>

      <div class="report-actions">
        <button id="copyButton">리포트 문장 복사</button>
        <button id="downloadButton">Markdown 다운로드</button>
      </div>

      <pre id="reportText"></pre>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: soil-carbon-calculator/style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1220px, 92vw);
  margin: 0 auto;
  padding: 48px 0;
}

.hero {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 900;
}

h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.2;
}

.description {
  max-width: 960px;
  margin-top: 16px;
  font-size: 17px;
  line-height: 1.7;
  color: #4c5748;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 0.95fr;
  gap: 24px;
  align-items: start;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 24px;
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

.input-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.input-card h2 {
  grid-column: 1 / -1;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: #344231;
}

input,
select {
  width: 100%;
  border: 1px solid #cbd5c4;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  background: #fbfcfa;
}

input:focus,
select:focus {
  outline: 2px solid #88a86a;
  border-color: #88a86a;
}

.result-card {
  position: sticky;
  top: 24px;
}

.result-row,
.highlight {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #edf0e8;
}

.result-row span,
.highlight span {
  color: #566252;
  font-weight: 700;
}

.result-row strong {
  font-size: 20px;
}

.highlight {
  margin-top: 14px;
  padding: 18px;
  border-radius: 16px;
  border: none;
  background: #e8f1dd;
}

.highlight strong {
  font-size: 26px;
  color: #213b18;
}

.highlight.secondary {
  background: #eef3f8;
}

.message {
  margin-top: 22px;
  padding: 18px;
  border-radius: 14px;
  background: #faf8ed;
  color: #574d2f;
  line-height: 1.65;
  font-weight: 800;
}

.report-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 13px 18px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  background: #5f7f45;
  color: white;
}

button:hover {
  opacity: 0.9;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: #1f2a1f;
  color: #f4f6f0;
  border-radius: 16px;
  padding: 20px;
  min-height: 420px;
  overflow: auto;
  font-size: 14px;
  line-height: 1.65;
}

@media (max-width: 920px) {
  .grid,
  .input-card {
    grid-template-columns: 1fr;
  }

  .result-card {
    position: static;
  }
}

```

---
## FILE: soil-carbon-dashboard/app.js
```
const STORAGE_KEY = "farmerstree-soil-carbon-records";
const CO2_FACTOR = 3.67;

const inputs = {
  plotId: document.getElementById("plotId"),
  socBase: document.getElementById("socBase"),
  socNow: document.getElementById("socNow"),
  phBase: document.getElementById("phBase"),
  phNow: document.getElementById("phNow"),
  ecBase: document.getElementById("ecBase"),
  ecNow: document.getElementById("ecNow"),
  waterBase: document.getElementById("waterBase"),
  waterNow: document.getElementById("waterNow"),
  yieldBase: document.getElementById("yieldBase"),
  yieldNow: document.getElementById("yieldNow"),
  fertReduction: document.getElementById("fertReduction"),
  biocharInput: document.getElementById("biocharInput"),
};

const outputs = {
  socDelta: document.getElementById("socDelta"),
  phDelta: document.getElementById("phDelta"),
  ecDelta: document.getElementById("ecDelta"),
  waterDelta: document.getElementById("waterDelta"),
  yieldDelta: document.getElementById("yieldDelta"),
  fertReductionOut: document.getElementById("fertReductionOut"),
  carbonStored: document.getElementById("carbonStored"),
  recordCount: document.getElementById("recordCount"),
  message: document.getElementById("message"),
  tbody: document.getElementById("tbody"),
};

const calcBtn = document.getElementById("calcBtn");
const saveBtn = document.getElementById("saveBtn");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

let records = load();
let current = null;

function n(el) {
  const v = Number(el.value);
  return Number.isFinite(v) ? v : 0;
}

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function pctDelta(base, now) {
  if (base === 0) return 0;
  return ((now - base) / base) * 100;
}

function evaluate(data) {
  const socDelta = pctDelta(data.socBase, data.socNow);
  const phDelta = data.phNow - data.phBase;
  const ecDelta = data.ecNow - data.ecBase;
  const waterDelta = pctDelta(data.waterBase, data.waterNow);
  const yieldDelta = pctDelta(data.yieldBase, data.yieldNow);
  const fertReduction = data.fertReduction;

  const carbonStored = data.biocharInput * 0.75 * CO2_FACTOR;

  let score = 0;
  if (socDelta > 0) score += 1;
  if (Math.abs(phDelta) <= 0.8) score += 1;
  if (ecDelta <= 0) score += 1;
  if (waterDelta > 0) score += 1;
  if (yieldDelta > 0) score += 1;
  if (fertReduction >= 10) score += 1;

  const level = score >= 5 ? "good" : score >= 3 ? "warn" : "warn";
  const title = score >= 5 ? "양호" : "개선 필요";

  return {
    ...data,
    socDelta,
    phDelta,
    ecDelta,
    waterDelta,
    yieldDelta,
    fertReduction,
    carbonStored,
    level,
    title,
  };
}

function readInputs() {
  return {
    id: Date.now(),
    plotId: inputs.plotId.value.trim() || `PLOT-${Date.now()}`,
    socBase: n(inputs.socBase),
    socNow: n(inputs.socNow),
    phBase: n(inputs.phBase),
    phNow: n(inputs.phNow),
    ecBase: n(inputs.ecBase),
    ecNow: n(inputs.ecNow),
    waterBase: n(inputs.waterBase),
    waterNow: n(inputs.waterNow),
    yieldBase: n(inputs.yieldBase),
    yieldNow: n(inputs.yieldNow),
    fertReduction: n(inputs.fertReduction),
    biocharInput: n(inputs.biocharInput),
  };
}

function updateSummary(result) {
  outputs.socDelta.textContent = `${result.socDelta.toFixed(1)}%`;
  outputs.phDelta.textContent = `${result.phDelta >= 0 ? "+" : ""}${result.phDelta.toFixed(2)}`;
  outputs.ecDelta.textContent = `${result.ecDelta >= 0 ? "+" : ""}${result.ecDelta.toFixed(2)}`;
  outputs.waterDelta.textContent = `${result.waterDelta.toFixed(1)}%`;
  outputs.yieldDelta.textContent = `${result.yieldDelta.toFixed(1)}%`;
  outputs.fertReductionOut.textContent = `${result.fertReduction.toFixed(1)}%`;
  outputs.carbonStored.textContent = `${Math.round(result.carbonStored).toLocaleString("ko-KR")} kgCO2e`;

  outputs.message.textContent =
    result.level === "good"
      ? "토양복원 지표가 전반적으로 개선되었습니다. 탄소저장 성과와 함께 사업 설명에 활용할 수 있습니다."
      : "일부 지표가 기대 수준에 못 미칩니다. 투입량, 혼합비, 재배관리 조건을 함께 점검하세요.";
}

function calculateOnly() {
  current = evaluate(readInputs());
  updateSummary(current);
}

function saveRecord() {
  if (!current) current = evaluate(readInputs());
  records.push(current);
  save();
  renderTable();
}

function renderTable() {
  outputs.tbody.innerHTML = "";
  records.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.plotId}</td>
      <td>${r.socDelta.toFixed(1)}%</td>
      <td>${r.phDelta.toFixed(2)}</td>
      <td>${r.ecDelta.toFixed(2)}</td>
      <td>${r.waterDelta.toFixed(1)}%</td>
      <td>${r.yieldDelta.toFixed(1)}%</td>
      <td>${r.fertReduction.toFixed(1)}%</td>
      <td>${Math.round(r.carbonStored).toLocaleString("ko-KR")} kgCO2e</td>
      <td><span class="badge ${r.level}">${r.title}</span></td>
    `;
    outputs.tbody.appendChild(tr);
  });
  outputs.recordCount.textContent = `${records.length}건`;
}

function csvEscape(v) {
  return `"${String(v ?? "").replaceAll('"', '""')}"`;
}

function exportCsv() {
  if (!records.length) {
    window.alert("내보낼 기록이 없습니다.");
    return;
  }
  const headers = ["필지ID", "유기탄소변화", "pH변화", "EC변화", "수분보유변화", "수량변화", "비료절감률", "탄소저장", "판정"];
  const body = records.map((r) => [
    r.plotId,
    r.socDelta.toFixed(1),
    r.phDelta.toFixed(2),
    r.ecDelta.toFixed(2),
    r.waterDelta.toFixed(1),
    r.yieldDelta.toFixed(1),
    r.fertReduction.toFixed(1),
    Math.round(r.carbonStored),
    r.title,
  ]);
  const csv = [headers, ...body].map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `farmerstree-soil-carbon-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearAll() {
  if (!window.confirm("전체 시험구 기록을 삭제할까요?")) return;
  records = [];
  save();
  renderTable();
}

calcBtn.addEventListener("click", calculateOnly);
saveBtn.addEventListener("click", saveRecord);
exportBtn.addEventListener("click", exportCsv);
clearBtn.addEventListener("click", clearAll);

current = evaluate(readInputs());
updateSummary(current);
renderTable();

```

---
## FILE: soil-carbon-dashboard/index.html
```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmerstree 토양 탄소·효과 대시보드</title>
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Farmerstree Fertilizer Platform</p>
      <h1>토양 복원·탄소 효과 대시보드</h1>
      <p class="description">
        토양 유기탄소, pH, EC, 수분 보유력, 작물 수량, 화학비료 절감률, 탄소저장 추정량 변화를 관리합니다.
      </p>
    </section>

    <section class="card">
      <h2>측정값 입력</h2>
      <div class="form-grid">
        <label>필지/시험구 ID<input id="plotId" type="text" value="PLOT-A-01" /></label>
        <label>유기탄소 기준값 %<input id="socBase" type="number" value="1.2" step="0.01" /></label>
        <label>유기탄소 현재값 %<input id="socNow" type="number" value="1.8" step="0.01" /></label>
        <label>토양 pH 기준값<input id="phBase" type="number" value="6.2" step="0.1" /></label>
        <label>토양 pH 현재값<input id="phNow" type="number" value="6.8" step="0.1" /></label>
        <label>토양 EC 기준값<input id="ecBase" type="number" value="1.4" step="0.1" /></label>
        <label>토양 EC 현재값<input id="ecNow" type="number" value="1.1" step="0.1" /></label>
        <label>수분 보유력 기준값 %<input id="waterBase" type="number" value="28" step="0.1" /></label>
        <label>수분 보유력 현재값 %<input id="waterNow" type="number" value="34" step="0.1" /></label>
        <label>작물 수량 기준값 kg/10a<input id="yieldBase" type="number" value="520" step="1" /></label>
        <label>작물 수량 현재값 kg/10a<input id="yieldNow" type="number" value="590" step="1" /></label>
        <label>화학비료 절감률 %<input id="fertReduction" type="number" value="20" step="0.1" /></label>
        <label>토양 투입 biochar kg<input id="biocharInput" type="number" value="300" step="1" /></label>
      </div>

      <div class="button-row">
        <button id="calcBtn">변화 계산</button>
        <button id="saveBtn">기록 저장</button>
        <button id="exportBtn">CSV 내보내기</button>
        <button id="clearBtn" class="danger">전체 삭제</button>
      </div>
    </section>

    <section class="grid">
      <section class="card">
        <h2>변화 요약</h2>
        <div class="summary-grid">
          <div><span>토양 유기탄소 변화</span><strong id="socDelta">0%</strong></div>
          <div><span>토양 pH 변화</span><strong id="phDelta">0</strong></div>
          <div><span>토양 EC 변화</span><strong id="ecDelta">0</strong></div>
          <div><span>수분 보유력 변화</span><strong id="waterDelta">0%</strong></div>
          <div><span>작물 수량 변화</span><strong id="yieldDelta">0%</strong></div>
          <div><span>화학비료 절감률</span><strong id="fertReductionOut">0%</strong></div>
          <div><span>탄소저장 추정량</span><strong id="carbonStored">0 kgCO2e</strong></div>
          <div><span>누적 기록 수</span><strong id="recordCount">0건</strong></div>
        </div>
        <div id="message" class="message">입력 후 변화 계산을 누르세요.</div>
      </section>

      <section class="card">
        <h2>판정 힌트</h2>
        <ul class="rule-list">
          <li>유기탄소 상승은 토양 건강성 회복 신호</li>
          <li>pH는 작물 적정 범위(보통 6.0~7.0) 유지가 중요</li>
          <li>EC 감소는 염류 스트레스 완화에 유리</li>
          <li>수분 보유력 상승은 관수 효율 개선 가능</li>
          <li>작물 수량 상승 + 화학비료 절감 동시 달성이 핵심</li>
          <li>탄소저장 추정은 사업/ESG 설명용 지표로 활용</li>
        </ul>
      </section>
    </section>

    <section class="card">
      <h2>시험구 기록</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>필지ID</th>
              <th>유기탄소 변화</th>
              <th>pH 변화</th>
              <th>EC 변화</th>
              <th>수분보유 변화</th>
              <th>수량 변화</th>
              <th>비료 절감률</th>
              <th>탄소저장 추정</th>
              <th>판정</th>
            </tr>
          </thead>
          <tbody id="tbody"></tbody>
        </table>
      </div>
    </section>
  </main>

  <script src="./app.js"></script>
</body>
</html>

```

---
## FILE: soil-carbon-dashboard/style.css
```
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f6f0; color: #1f2a1f; }
.container { width: min(1220px, 92vw); margin: 0 auto; padding: 48px 0; }
.hero { margin-bottom: 24px; }
.eyebrow { margin: 0 0 8px; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #5d7145; font-weight: 800; }
h1 { margin: 0; font-size: 36px; }
.description { margin-top: 14px; max-width: 980px; line-height: 1.7; color: #4c5748; }
.card { background: #fff; border-radius: 20px; padding: 24px; margin-bottom: 20px; box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08); border: 1px solid rgba(80, 100, 70, 0.12); }
h2 { margin: 0 0 18px; }
.form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
label { display: flex; flex-direction: column; gap: 7px; font-size: 14px; font-weight: 700; }
input { border: 1px solid #cbd5c4; border-radius: 12px; padding: 10px 12px; font-size: 15px; background: #fbfcfa; }
.button-row { display: flex; gap: 10px; margin-top: 16px; }
button { border: none; border-radius: 12px; padding: 11px 16px; font-size: 15px; font-weight: 800; cursor: pointer; color: #fff; background: #5f7f45; }
button.danger { background: #8a3d31; }
.grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 20px; }
.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.summary-grid div { background: #eef4e7; border-radius: 14px; padding: 14px; }
.summary-grid span { display: block; font-size: 13px; color: #566252; margin-bottom: 7px; }
.summary-grid strong { font-size: 21px; }
.message { margin-top: 16px; background: #faf8ed; border-radius: 12px; padding: 14px; line-height: 1.6; font-weight: 700; color: #574d2f; }
.rule-list { margin: 0; padding-left: 18px; line-height: 1.85; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 980px; }
th, td { border-bottom: 1px solid #edf0e8; padding: 10px; text-align: left; font-size: 13px; }
th { background: #edf4e5; color: #2f4428; }
.badge { display: inline-flex; border-radius: 999px; padding: 4px 8px; font-size: 12px; font-weight: 900; }
.good { background: #e4f3da; color: #2f5e20; }
.warn { background: #fff3cf; color: #735400; }
@media (max-width: 980px) {
  .form-grid, .grid, .summary-grid { grid-template-columns: 1fr; }
}

```

---
## FILE: style.css
```
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(146, 174, 105, 0.28), transparent 32rem),
    #f4f6f0;
  color: #1f2a1f;
}

.container {
  width: min(1240px, 92vw);
  margin: 0 auto;
  padding: 52px 0;
}

.hero {
  background: #ffffff;
  border-radius: 28px;
  padding: 46px;
  box-shadow: 0 18px 46px rgba(25, 45, 20, 0.09);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5d7145;
  font-weight: 900;
}

h1 {
  margin: 0;
  font-size: clamp(22px, 3.2vw, 44px);
  line-height: 1.12;
  letter-spacing: -0.04em;
}

.description {
  max-width: 920px;
  margin-top: 20px;
  font-size: 18px;
  line-height: 1.75;
  color: #4c5748;
}

.hero-actions {
  display: flex;
  gap: 14px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 14px;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 900;
}

.primary-button {
  background: #5f7f45;
  color: #ffffff;
}

.secondary-button {
  background: #eef4e7;
  color: #2f4428;
}

.process-card,
.status-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 28px;
}

h2 {
  margin: 0 0 22px;
  font-size: 26px;
  letter-spacing: -0.02em;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.process-step {
  padding: 20px;
  border-radius: 18px;
  background: #f7f9f4;
  border: 1px solid #e4eadc;
}

.process-step span {
  display: inline-flex;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 900;
  color: #6b8055;
}

.process-step strong {
  display: block;
  font-size: 18px;
  margin-bottom: 8px;
}

.process-step p {
  margin: 0;
  color: #566252;
  line-height: 1.6;
  font-size: 14px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 28px;
}

.module-section {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  margin-bottom: 28px;
}

.module-section-title {
  margin-bottom: 8px;
}

.module-section-text {
  margin: 0 0 20px;
  color: #566252;
  font-weight: 700;
}

.module-section .module-grid {
  margin-bottom: 0;
}

.module-card {
  display: flex;
  flex-direction: column;
  min-height: 280px;
  background: #ffffff;
  border-radius: 24px;
  padding: 28px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 14px 36px rgba(25, 45, 20, 0.08);
  border: 1px solid rgba(80, 100, 70, 0.12);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 46px rgba(25, 45, 20, 0.12);
}

.module-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf4e5;
  color: #335026;
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 18px;
}

.module-card h3 {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.module-card p {
  margin: 0;
  color: #566252;
  line-height: 1.7;
  font-size: 15px;
}

.module-card span {
  margin-top: auto;
  padding-top: 22px;
  color: #5f7f45;
  font-weight: 900;
}

.ops-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.ops-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: #f7f9f4;
  border: 1px solid #e4eadc;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.ops-item:hover {
  background: #edf4e5;
  box-shadow: 0 4px 14px rgba(25, 45, 20, 0.08);
}

.ops-icon {
  font-size: 22px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.ops-item strong {
  display: block;
  font-size: 15px;
  font-weight: 900;
  color: #2f4428;
  margin-bottom: 4px;
}

.ops-item p {
  margin: 0;
  font-size: 13px;
  color: #566252;
  line-height: 1.55;
}

.status-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.status-list div {
  padding: 18px;
  border-radius: 16px;
  background: #f7f9f4;
  border: 1px solid #e4eadc;
}

.status-list strong {
  display: block;
  margin-bottom: 8px;
  color: #5d7145;
}

.status-list span {
  color: #344231;
  font-weight: 800;
}

@media (max-width: 980px) {
  .process-grid,
  .module-grid,
  .status-list,
  .ops-grid {
    grid-template-columns: 1fr 1fr;
  }

  .hero {
    padding: 34px;
  }
}

@media (max-width: 680px) {
  .process-grid,
  .module-grid,
  .status-list,
  .ops-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 28px;
  }
}

```
