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

// Load AI test report (JSON + markdown) from repository root
async function loadAiTestReport() {
  if (!aiReportSummary) return;

  try {
    const res = await fetch("../ai-test-report.json");
    if (res.ok) {
      const data = await res.json();
      aiReportSummary.innerHTML = `<strong>${data.report_date}</strong> · SOP ${data.sop_version} · 상태: ${data.status}`;

      const list = document.createElement("ul");
      data.test_results.forEach((r) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${r.category}</strong>: ${r.status} — ${r.description}`;
        list.appendChild(li);
      });

      aiReportSummary.appendChild(list);
    } else {
      aiReportSummary.textContent = "AI 리포트 로드 실패 (JSON).";
    }
  } catch (err) {
    aiReportSummary.textContent = "AI 리포트 로드 실패.";
  }

  // load markdown file for full report text (display as plain text)
  if (!aiReportDetails) return;
  try {
    const mdRes = await fetch("../ai-test-report.md");
    if (mdRes.ok) {
      const md = await mdRes.text();
      aiReportDetails.textContent = md;
    } else {
      aiReportDetails.textContent = "AI 리포트(마크다운) 없음.";
    }
  } catch (err) {
    aiReportDetails.textContent = "AI 리포트(마크다운) 로드 실패.";
  }
}

loadAiTestReport();
