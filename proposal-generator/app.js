/* ═══════════════════════════════════════════
   유틸
═══════════════════════════════════════════ */
const $   = id => document.getElementById(id);
const val = id => ($( id)?.value || "").trim();
const num = id => parseFloat($(id)?.value) || 0;
const comma  = n => Math.round(n).toLocaleString("ko-KR");
const wonStr = n => {
  const a = Math.abs(n);
  if (a >= 1000000000) return `${(n/1000000000).toFixed(1)}십억원`;
  if (a >= 100000000)  return `${(n/100000000).toFixed(1)}억원`;
  if (a >= 10000000)   return `${(n/10000000).toFixed(1)}천만원`;
  if (a >= 1000000)    return `${(n/1000000).toFixed(1)}백만원`;
  if (a >= 10000)      return `${(n/10000).toFixed(0)}만원`;
  return `${comma(n)}원`;
};
const setText = (id, t)    => { const e=$(id); if(e) e.textContent = t; };
const setHtml = (id, h)    => { const e=$(id); if(e) e.innerHTML   = h; };
const setVis  = (id, show) => { const e=$(id); if(e) e.style.display = show ? "" : "none"; };
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br />");

/* ═══════════════════════════════════════════
   날짜 초기화
═══════════════════════════════════════════ */
$("proposalDate").value = new Date().toISOString().slice(0, 10);

/* ═══════════════════════════════════════════
   localStorage 자동 저장
═══════════════════════════════════════════ */
const SAVE_KEY = "ft_proposal_v2";
const SAVE_IDS = [
  "proposalTitle","proposalDate","proposalNo","validUntil","confidential",
  "recipientOrg","recipientName",
  "senderOrg","senderName","senderTel","senderEmail","senderAddress",
  "execOneLiner","kp1","kp2","kp3","kp4","execMarketSize","execAskSize",
  "companyIntro","marketAnalysis","biocharDiff","proposal","bizModel",
  "expectedEffect","schedule","investAsk","remarks",
  "roiCrop","roiArea","roiCropPrice","roiBase","roiTop","roiSoil","roiLabor","roiYield",
  "roiProduct","roiPrice","roiUsage","roiChemReplace","roiSoilReplace","roiYieldUp","roiSubsidy",
  "cPeriod","cRegion","cRecycled","cBiochar","cSoilApplied","cCarbonStored","cFertReduction","cCrop",
  "rev1","rev2","rev3","op1","op2","op3","totalInvest","bepTarget",
];

function saveForm() {
  const data = {};
  SAVE_IDS.forEach(id => { const e=$(id); if(e) data[id] = e.value; });
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  const notice = $("saveNotice");
  if (notice) { notice.textContent = "자동 저장됨 ✓"; setTimeout(() => { notice.textContent = "입력값은 자동 저장됩니다."; }, 1500); }
}

function loadForm() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    SAVE_IDS.forEach(id => { const e=$(id); if(e && data[id] !== undefined) e.value = data[id]; });
    return true;
  } catch { return false; }
}

function clearForm() {
  if (!confirm("저장된 입력값을 모두 초기화하겠습니까?")) return;
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

document.addEventListener("input", saveForm);
document.addEventListener("change", saveForm);

/* ═══════════════════════════════════════════
   ROI 계산기
═══════════════════════════════════════════ */
const CROP_PRESETS = {
  rice:       { name:"벼 (논)",        base:30000, top:15000, soil:10000, labor:15000, yield:500,  price:1800, yieldUp:5  },
  pepper:     { name:"고추",            base:40000, top:25000, soil:18000, labor:25000, yield:180,  price:8000, yieldUp:8  },
  garlic:     { name:"마늘",            base:50000, top:20000, soil:20000, labor:30000, yield:800,  price:3500, yieldUp:7  },
  onion:      { name:"양파",            base:35000, top:18000, soil:15000, labor:20000, yield:4000, price:500,  yieldUp:6  },
  cabbage:    { name:"배추",            base:30000, top:15000, soil:12000, labor:18000, yield:5000, price:300,  yieldUp:6  },
  strawberry: { name:"딸기 (시설)",    base:60000, top:40000, soil:30000, labor:40000, yield:2000, price:6000, yieldUp:10 },
  tomato:     { name:"토마토 (시설)",  base:55000, top:35000, soil:25000, labor:35000, yield:8000, price:1500, yieldUp:9  },
  apple:      { name:"사과",            base:45000, top:30000, soil:20000, labor:35000, yield:2000, price:3000, yieldUp:7  },
};
const PRODUCT_PRESETS = {
  A: { price:18000, usage:2.0, chemReplace:50, soilReplace:60, yieldUp:4 },
  B: { price:23000, usage:2.0, chemReplace:55, soilReplace:70, yieldUp:6 },
  C: { price:28000, usage:2.5, chemReplace:60, soilReplace:80, yieldUp:8 },
};

function onRoiCropChange() {
  const p = CROP_PRESETS[$("roiCrop").value]; if (!p) return;
  $("roiBase").value=$("roiTop").value=0;
  Object.assign($("roiBase"),{value:p.base}); $("roiTop").value=p.top;
  $("roiSoil").value=p.soil; $("roiLabor").value=p.labor;
  $("roiYield").value=p.yield; $("roiCropPrice").value=p.price; $("roiYieldUp").value=p.yieldUp;
  calcROI(); saveForm();
}
function onRoiProductChange() {
  const p = PRODUCT_PRESETS[$("roiProduct").value]; if (!p) return;
  $("roiPrice").value=p.price; $("roiUsage").value=p.usage;
  $("roiChemReplace").value=p.chemReplace; $("roiSoilReplace").value=p.soilReplace;
  $("roiYieldUp").value=p.yieldUp;
  calcROI(); saveForm();
}

let roiData = {};

function calcROI() {
  const area      = num("roiArea"), scale = area/1000;
  const base      = num("roiBase"), top = num("roiTop"), soil = num("roiSoil"), labor = num("roiLabor");
  const yieldKg   = num("roiYield"), cropPrice = num("roiCropPrice");
  const ftPrice   = num("roiPrice"), ftUsage = num("roiUsage");
  const chemRep   = num("roiChemReplace")/100, soilRep = num("roiSoilReplace")/100;
  const yieldUp   = num("roiYieldUp")/100, subsidyRate = num("roiSubsidy")/100;
  const pk        = $("roiProduct").value, ck = $("roiCrop").value;
  const cropName  = CROP_PRESETS[ck]?.name || "작물";
  const prodName  = {A:"A형(고부숙)",B:"B형(기능성)",C:"C형(바이오차 복합)"}[pk]||"";

  const fertSaving  = ((base+top)*chemRep + soil*soilRep)*scale;
  const ftCostAll   = ftPrice*ftUsage*scale;
  const subsidyAmt  = ftCostAll*subsidyRate;
  const ftNetCost   = ftCostAll-subsidyAmt;
  const yieldGainKg = yieldKg*yieldUp*scale;
  const yieldGainWon= yieldGainKg*cropPrice;
  const netSaving   = fertSaving+yieldGainWon-ftNetCost;
  const roi         = ftNetCost>0 ? netSaving/ftNetCost : 0;
  const bepYears    = netSaving>0 ? ftNetCost/netSaving : Infinity;
  const bepStr      = isFinite(bepYears) ? (bepYears<1?`${Math.round(bepYears*12)}개월`:`${bepYears.toFixed(1)}년`) : "–";
  const biocharKg   = pk==="C" ? ftUsage*20*0.3*scale : 0;
  const carbonSeq   = biocharKg*0.60;

  const summary = netSaving>=0
    ? `${cropName} ${comma(area)}㎡에 Farmerstree ${prodName} 비료 적용 시, 비료비 절감 ${wonStr(fertSaving)}과 수확량 증가 수익 ${wonStr(yieldGainWon)}을 합산해 연간 약 ${wonStr(netSaving)} 순이익 개선. ROI ${roi.toFixed(1)}배, 투자 회수 ${bepStr}${subsidyAmt>0?`, 보조금 ${wonStr(subsidyAmt)} 포함`:""}${pk==="C"?`. 바이오차 투입으로 탄소저장 약 ${carbonSeq.toFixed(1)}kg CO₂e 인정 가능.`:""}`
    : "현재 조건에서는 절감 효과가 크지 않습니다. 면적 확대 또는 대체율 조정 권장.";

  $("roiResult").innerHTML = `
    <table class="inner-table">
      <tr><th>작물</th><td>${cropName}</td><th>적용 면적</th><td>${comma(area)}㎡</td></tr>
      <tr><th>비료비 절감</th><td class="c-green">${wonStr(fertSaving)}</td><th>수확량 증가</th><td class="c-green">${wonStr(yieldGainWon)}</td></tr>
      <tr><th>비료비</th><td>${wonStr(ftNetCost)}</td><th>보조금</th><td>${wonStr(subsidyAmt)}</td></tr>
      <tr class="bold-row"><th>연간 순이익</th><td class="${netSaving>=0?"c-green":"c-red"}">${wonStr(netSaving)}</td><th>ROI</th><td class="${roi>=1?"c-green":""}">${roi.toFixed(1)}배 (${bepStr})</td></tr>
      ${pk==="C"?`<tr><th>탄소저장 추정</th><td colspan="3">${carbonSeq.toFixed(1)}kg CO₂e</td></tr>`:""}
    </table>
    <p class="summary-box-text">${summary}</p>`;

  roiData = { cropName, area, prodName, fertSaving, yieldGainWon, ftNetCost, subsidyAmt, netSaving, roi, bepStr, summary, carbonSeq, pk };
}

/* ═══════════════════════════════════════════
   탄소·ESG
═══════════════════════════════════════════ */
let carbonData = {};

function calcCarbon() {
  const period   = val("cPeriod")||"기준 기간", region = val("cRegion")||"적용 권역";
  const crop     = val("cCrop")||"적용 작물";
  const recycled = num("cRecycled"), biochar = num("cBiochar");
  const soilApp  = num("cSoilApplied"), stored = num("cCarbonStored"), fertRed = num("cFertReduction");
  const kg = v => `${comma(v)}kg`;

  const publicText =
    `${region}을 대상으로 ${crop} 재배지에 SMS Biochar 기반 탄소형 복합비료를 적용하는 실증·확산 사업을 제안합니다. ` +
    `본 모델은 후배지 ${kg(recycled)} 재자원화, Biochar ${kg(biochar)} 생산, 토양 투입 ${kg(soilApp)}을 통해 ` +
    `약 ${comma(stored)}kgCO₂e의 탄소저장 잠재력을 제시합니다. ` +
    `화학비료 사용량을 ${fertRed.toFixed(1)}% 절감하여 농가 경영비 부담을 낮추고, ` +
    `토양 유기탄소 증진·수분보유력 개선·염류 스트레스 완화 등 지역 단위 지속가능 농업 전환 성과를 창출할 수 있습니다.`;

  $("carbonResult").innerHTML = `
    <table class="inner-table" style="margin-bottom:10px">
      <tr><th>후배지 재자원화</th><td>${kg(recycled)}</td><th>Biochar 생산</th><td>${kg(biochar)}</td></tr>
      <tr><th>토양 투입량</th><td>${kg(soilApp)}</td><th>탄소저장 추정</th><td class="c-green">${comma(stored)}kgCO₂e</td></tr>
      <tr><th>화학비료 절감률</th><td colspan="3">${fertRed.toFixed(1)}%</td></tr>
    </table>
    <p class="sub-label">▸ 공공사업·투자자 제안 문장</p>
    <p class="summary-box-text">${publicText}</p>`;

  carbonData = { recycled, biochar, soilApp, stored, fertRed, kg, publicText };
}

/* ═══════════════════════════════════════════
   재무 전망
═══════════════════════════════════════════ */
let finData = {};

function calcFinance() {
  const r1 = num("rev1"), r2 = num("rev2"), r3 = num("rev3");
  const p1 = num("op1")/100, p2 = num("op2")/100, p3 = num("op3")/100;
  const invest = num("totalInvest"), bep = val("bepTarget");

  const op1Won = r1*p1, op2Won = r2*p2, op3Won = r3*p3;
  const totalRev3 = r1+r2+r3;

  $("finResult").innerHTML = `
    <table class="inner-table">
      <thead><tr><th>구분</th><th>1년차</th><th>2년차</th><th>3년차</th></tr></thead>
      <tbody>
        <tr><td class="row-label-sm">예상 매출</td><td>${wonStr(r1)}</td><td>${wonStr(r2)}</td><td>${wonStr(r3)}</td></tr>
        <tr><td class="row-label-sm">영업이익률</td><td>${(p1*100).toFixed(1)}%</td><td>${(p2*100).toFixed(1)}%</td><td>${(p3*100).toFixed(1)}%</td></tr>
        <tr class="bold-row"><td class="row-label-sm">영업이익</td><td>${wonStr(op1Won)}</td><td>${wonStr(op2Won)}</td><td class="c-green">${wonStr(op3Won)}</td></tr>
        <tr><td class="row-label-sm">누적 매출</td><td>${wonStr(r1)}</td><td>${wonStr(r1+r2)}</td><td>${wonStr(totalRev3)}</td></tr>
      </tbody>
    </table>
    <p class="summary-box-text" style="margin-top:8px">
      총 투자 요청액 <strong>${wonStr(invest)}</strong> | 예상 투자 회수 시점 <strong>${bep||"–"}</strong> | 3년 누적 매출 <strong>${wonStr(totalRev3)}</strong>
    </p>`;

  finData = { r1,r2,r3,p1,p2,p3,op1Won,op2Won,op3Won,invest,bep,totalRev3 };
}

/* ═══════════════════════════════════════════
   시트 빌드
═══════════════════════════════════════════ */
function buildSheet() {
  const title       = val("proposalTitle")||"사업 제안서";
  const date        = val("proposalDate");
  const proposalNo  = val("proposalNo");
  const validUntil  = val("validUntil");
  const confidential= val("confidential");
  const recipFull   = [val("recipientOrg"),val("recipientName")].filter(Boolean).join("  ·  ")||"—";
  const senderFull  = [val("senderOrg"),val("senderName")].filter(Boolean).join("  ·  ")||"—";

  /* 표지 */
  setText("cvTitle",     title);
  setText("cvDate",      date||"—");
  setText("cvRecipient", recipFull);
  setText("cvNo",        proposalNo||"—");
  setText("cvValid",     validUntil||"—");
  setText("cvSender",    senderFull);
  setText("cvConfidential", confidential||"CONFIDENTIAL — 본 문서는 수신자 외 외부 무단 배포를 금합니다.");

  /* 표지 핵심 수치 */
  const kpiItems = [
    { label:"시장 규모", value: val("execMarketSize")||"5,000억원/년" },
    { label:"탄소저장 추정", value: carbonData.stored ? `${comma(carbonData.stored)}kgCO₂e` : "—" },
    { label:"농가 순이익", value: roiData.netSaving !== undefined ? wonStr(roiData.netSaving) : "—" },
    { label:"투자 요청", value: finData.invest ? wonStr(finData.invest) : (val("execAskSize")||"—") },
  ];
  setHtml("coverKpiRow", kpiItems.map(k=>`<div class="ckpi"><div class="ckpi-val">${k.value}</div><div class="ckpi-label">${k.label}</div></div>`).join(""));

  /* Executive Summary */
  setText("esDate", date||"");
  setText("esOneLiner", val("execOneLiner"));

  const kps = ["kp1","kp2","kp3","kp4"].map(id=>val(id)).filter(Boolean);
  setHtml("esKpiGrid", kps.map(kp=>`<div class="es-kpi"><span class="es-kpi-bullet">▸</span>${kp}</div>`).join(""));

  const askSize = val("execAskSize");
  setHtml("esAskBox", askSize
    ? `<div class="es-ask"><span class="es-ask-label">협력·투자 제안</span><span class="es-ask-val">${askSize}</span></div>`
    : "");

  /* 본문 헤더 */
  setText("outRecipient", recipFull);
  setText("outDate",      date||"—");
  setText("outSender",    senderFull);
  setText("outContact",   [val("senderTel"),val("senderEmail")].filter(Boolean).join("  /  ")||"—");

  setHtml("outCompanyIntro",  esc(val("companyIntro")||"(미입력)"));
  setHtml("outMarketAnalysis",esc(val("marketAnalysis")||"(미입력)"));
  setHtml("outBiocharDiff",   esc(val("biocharDiff")||"(미입력)"));
  setHtml("outProposal",      esc(val("proposal")||"(미입력)"));
  setHtml("outBizModel",      esc(val("bizModel")||"(미입력)"));
  setHtml("outEffect",        esc(val("expectedEffect")||"(미입력)"));
  setHtml("outSchedule",      esc(val("schedule")||"(미입력)"));
  setHtml("outInvestAsk",     esc(val("investAsk")||"(미입력)"));

  /* ROI */
  if (roiData.summary) {
    const d = roiData;
    setHtml("outROITable",`
      <table class="info-table" style="margin-bottom:8px">
        <tr><th>작물</th><td>${d.cropName}</td><th>적용 면적</th><td>${comma(d.area)}㎡</td></tr>
        <tr><th>비료비 절감</th><td>${wonStr(d.fertSaving)}</td><th>수확량 증가 수익</th><td>${wonStr(d.yieldGainWon)}</td></tr>
        <tr><th>Farmerstree 비료비</th><td>${wonStr(d.ftNetCost)}</td><th>보조금</th><td>${wonStr(d.subsidyAmt)}</td></tr>
        <tr><th><b>연간 순이익</b></th><td><b>${wonStr(d.netSaving)}</b></td><th>ROI</th><td><b>${d.roi.toFixed(1)}배</b> (회수 ${d.bepStr})</td></tr>
        ${d.pk==="C"?`<tr><th>탄소저장 추정</th><td colspan="3">${d.carbonSeq.toFixed(1)}kg CO₂e</td></tr>`:""}
      </table>`);
    setHtml("outROISummary", esc(d.summary));
  } else {
    setHtml("outROITable",""); setText("outROISummary","⑨ ROI 섹션 데이터를 입력하세요.");
  }

  /* 탄소 */
  if (carbonData.publicText) {
    const d = carbonData;
    setHtml("outCarbonFigures",`
      <table class="info-table" style="margin-bottom:8px">
        <tr><th>후배지 재자원화</th><td>${d.kg(d.recycled)}</td><th>Biochar 생산</th><td>${d.kg(d.biochar)}</td></tr>
        <tr><th>토양 투입량</th><td>${d.kg(d.soilApp)}</td><th>탄소저장 추정</th><td><b>${comma(d.stored)}kgCO₂e</b></td></tr>
        <tr><th>화학비료 절감률</th><td colspan="3">${d.fertRed.toFixed(1)}%</td></tr>
      </table>`);
    setHtml("outCarbonText", esc(d.publicText));
  } else {
    setHtml("outCarbonFigures",""); setText("outCarbonText","⑩ 탄소·ESG 섹션 데이터를 입력하세요.");
  }

  /* 재무 전망 */
  if (finData.r1 || finData.r2 || finData.r3) {
    const d = finData;
    setHtml("outFinTable",`
      <table class="info-table">
        <thead><tr><th>구분</th><th>1년차</th><th>2년차</th><th>3년차</th></tr></thead>
        <tbody>
          <tr><th>예상 매출</th><td>${wonStr(d.r1)}</td><td>${wonStr(d.r2)}</td><td>${wonStr(d.r3)}</td></tr>
          <tr><th>영업이익률</th><td>${(d.p1*100).toFixed(1)}%</td><td>${(d.p2*100).toFixed(1)}%</td><td>${(d.p3*100).toFixed(1)}%</td></tr>
          <tr><th><b>영업이익</b></th><td>${wonStr(d.op1Won)}</td><td>${wonStr(d.op2Won)}</td><td><b>${wonStr(d.op3Won)}</b></td></tr>
          <tr><th>누적 매출</th><td>${wonStr(d.r1)}</td><td>${wonStr(d.r1+d.r2)}</td><td>${wonStr(d.totalRev3)}</td></tr>
        </tbody>
      </table>
      <p class="sec-body" style="margin-top:8px">총 투자 요청액 <b>${wonStr(d.invest)}</b> | 예상 회수 시점 <b>${d.bep||"–"}</b> | 3년 누적 매출 <b>${wonStr(d.totalRev3)}</b></p>`);
  }

  /* 기타 */
  const remarks = val("remarks");
  if (remarks) { setHtml("outRemarks",esc(remarks)); setVis("secRemarks",true); }
  else setVis("secRemarks",false);

  setText("outSignerName",    val("senderName")||val("senderOrg")||"");
  setText("outFooterOrg",     senderFull);
  setText("outFooterAddress", val("senderAddress")||"");
}

/* ═══════════════════════════════════════════
   PDF 다운로드
   proposalSheet는 pdf-render-box 안에서 항상 렌더링된 상태
   → display 토글·타이머 없이 바로 캡처
═══════════════════════════════════════════ */
function downloadPDF() {
  buildSheet();
  const dateStr  = val("proposalDate").replace(/-/g,"")||new Date().toISOString().slice(0,10).replace(/-/g,"");
  const filename = `${val("proposalTitle")||"제안서"}-${dateStr}.pdf`;

  const setLabel = t => ["pdfBtn","pdfBtn2"].forEach(id => { const b=$(id); if(b) b.textContent=t; });
  setLabel("생성 중…");

  html2pdf().set({
    margin:      [8, 10, 8, 10],
    filename,
    image:       { type:"jpeg", quality:0.97 },
    html2canvas: { scale:2, useCORS:true, logging:false },
    jsPDF:       { unit:"mm", format:"a4", orientation:"portrait" },
    pagebreak:   { mode:["css","legacy"] },
  }).from($("proposalSheet")).save()
    .then(()  => setLabel("PDF 다운로드"))
    .catch(()  => { setLabel("PDF 다운로드"); alert("PDF 생성 실패."); });
}

/* ═══════════════════════════════════════════
   미리보기
═══════════════════════════════════════════ */
function openPreview() {
  buildSheet();
  $("previewBody").innerHTML = $("proposalSheet").outerHTML;
  $("previewOverlay").classList.remove("hidden");
}
function closePreview() { $("previewOverlay").classList.add("hidden"); }

/* ═══════════════════════════════════════════
   이벤트
═══════════════════════════════════════════ */
$("previewBtn").addEventListener("click", openPreview);
$("previewBtn2").addEventListener("click", openPreview);
$("pdfBtn").addEventListener("click", downloadPDF);
$("pdfBtn2").addEventListener("click", downloadPDF);
$("clearBtn").addEventListener("click", clearForm);
$("closePreview").addEventListener("click", closePreview);
$("pdfFromModal").addEventListener("click", () => { closePreview(); downloadPDF(); });
$("previewOverlay").addEventListener("click", e => { if(e.target===e.currentTarget) closePreview(); });

/* ═══════════════════════════════════════════
   초기화
═══════════════════════════════════════════ */
const _restored = loadForm();
if (!_restored) onRoiCropChange(); // 저장값 없을 때만 프리셋으로 덮어쓰기
else calcROI();                    // 저장값 있으면 그대로 재계산
calcCarbon();
calcFinance();
buildSheet();
