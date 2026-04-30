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
