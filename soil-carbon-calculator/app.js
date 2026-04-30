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
