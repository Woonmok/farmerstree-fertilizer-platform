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
  recordsTable: document.getElementById("recordsTable"),
};

const evaluateButton = document.getElementById("evaluateButton");
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");
const exportCsvButton = document.getElementById("exportCsvButton");

const STORAGE_KEY = "farmerstree-quality-records";

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
    title: "출하 가능",
    detail: "현재 입력값 기준으로 출하 가능한 품질입니다.",
  };

  if (dangerCount > 0) {
    status = {
      level: "danger",
      title: "출하 불가",
      detail: "위험 항목이 있습니다. 재건조, 추가 후숙, 재부숙 또는 재선별이 필요합니다.",
    };
  } else if (warnCount > 0) {
    status = {
      level: "warn",
      title: "조건부 출하 / 재검토",
      detail: "주의 항목이 있습니다. 제품 유형과 사용 작물에 따라 조건부 출하 또는 재검사가 필요합니다.",
    };
  }

  if (data.moisture > 25 && dangerCount > 0) {
    status.title = "재건조 필요";
    status.detail = "수분이 높아 보관 중 곰팡이·부패 위험이 있습니다.";
  }

  if (data.gi < 70 || data.odor === "ammonia" || data.odor === "rot") {
    status.title = "추가 후숙 또는 재부숙 필요";
    status.detail = "식물 독성, 암모니아취, 부패취 가능성이 있어 바로 출하하면 안 됩니다.";
  }

  if (data.ripeningDays < 20 || data.ripeningTemp > 45 || data.pileDelta > 15) {
    status.title = "추가 후숙 또는 재부숙 필요";
    status.detail = "후숙 운영 기준 미달 항목이 있어 즉시 출하하면 안 됩니다.";
  }

  if (
    data.inoculationTemp > 40 ||
    data.inoculationAmmonia === "present" ||
    data.inoculationTiming === "beforeHotCompost" ||
    data.stabilizationDays < 5
  ) {
    status.title = "미생물 접종 조건 미달";
    status.detail = "접종 핵심 조건(온도/암모니아취/후접종/안정화 기간) 중 미달 항목이 있어 재조정이 필요합니다.";
    status.level = "danger";
  }

  if (data.ec > 5.0) {
    status.title = "사용 제한";
    status.detail = "염류장해 위험이 높아 민감작물용 출하를 제한해야 합니다.";
  }

  if (data.pathogen === "exceed" || data.heavyMetals === "exceed" || data.maturity === "unstable") {
    status.title = "출하 불가";
    status.detail = "법적/위생/부숙도 기준 미달 항목이 있어 출하할 수 없습니다.";
    status.level = "danger";
  }

  return {
    ...data,
    status,
    reasons,
  };
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
    "판정상세"
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
      `;

      outputs.recordsTable.appendChild(row);
    });
}

evaluateButton.addEventListener("click", evaluateCurrent);
saveButton.addEventListener("click", saveCurrent);
clearButton.addEventListener("click", clearRecords);
exportCsvButton.addEventListener("click", exportRecordsToCsv);

evaluateCurrent();
renderRecords();
