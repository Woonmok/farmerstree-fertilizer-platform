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
