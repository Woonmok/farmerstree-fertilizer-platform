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
