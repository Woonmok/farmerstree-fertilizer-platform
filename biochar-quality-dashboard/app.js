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
