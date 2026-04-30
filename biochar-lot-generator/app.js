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
