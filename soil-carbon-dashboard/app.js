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
