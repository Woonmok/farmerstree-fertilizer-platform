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
