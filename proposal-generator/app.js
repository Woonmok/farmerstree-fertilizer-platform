/* ── 날짜 초기화 ── */
const dateInput = document.getElementById("proposalDate");
dateInput.value = new Date().toISOString().slice(0, 10);

/* ── 헬퍼 ── */
function val(id) {
  return (document.getElementById(id).value || "").trim();
}
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setHtml(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
}
function setVisible(sectionId, show) {
  const el = document.getElementById(sectionId);
  if (el) el.style.display = show ? "" : "none";
}

/* ── 시트 빌드 ── */
function buildSheet() {
  const title      = val("proposalTitle") || "사업 제안서";
  const proposalNo = val("proposalNo");
  const validUntil = val("validUntil");
  const date       = val("proposalDate");

  setText("outTitle", title);
  const metaParts = [];
  if (proposalNo) metaParts.push(`제안번호: ${proposalNo}`);
  if (validUntil) metaParts.push(`유효기간: ${validUntil}`);
  setText("outMeta", metaParts.join("   |   "));

  const recipientFull = [val("recipientOrg"), val("recipientName")].filter(Boolean).join("  ·  ");
  setText("outRecipient", recipientFull || "—");
  setText("outDate", date || "—");

  const senderFull = [val("senderOrg"), val("senderName")].filter(Boolean).join("  ·  ");
  setText("outSender", senderFull || "—");
  const contactParts = [val("senderTel"), val("senderEmail")].filter(Boolean);
  setText("outContact", contactParts.join("  /  ") || "—");

  setHtml("outBackground",   val("background")      || "(미입력)");
  setHtml("outTechOverview", val("techOverview")     || "(미입력)");
  setHtml("outProposal",     val("proposal")         || "(미입력)");
  setHtml("outROI",          val("roiText")          || "(농가 ROI 시뮬레이터에서 복사한 내용을 붙여넣으세요)");
  setHtml("outCarbon",       val("carbonText")       || "(탄소 성과 리포트에서 복사한 내용을 붙여넣으세요)");
  setHtml("outEffect",       val("expectedEffect")   || "(미입력)");
  setHtml("outSchedule",     val("schedule")         || "(미입력)");

  const remarks = val("remarks");
  setHtml("outRemarks", remarks || "");
  setVisible("secRemarks", !!remarks);

  setText("outSignerName", val("senderName") || val("senderOrg") || "");
  setText("outFooterOrg",  senderFull || "");
  setText("outFooterAddress", val("senderAddress") || "");
}

/* ── PDF 다운로드 ── */
function downloadPDF() {
  buildSheet();

  const date   = val("proposalDate").replace(/-/g, "") || new Date().toISOString().slice(0,10).replace(/-/g,"");
  const title  = val("proposalTitle") || "제안서";
  const filename = `${title}-${date}.pdf`;

  const sheet = document.getElementById("proposalSheet");

  /* PDF 생성 중 시트를 일시적으로 보이게 처리 */
  sheet.style.display = "block";

  const opt = {
    margin:      [12, 14, 12, 14],   /* 상·우·하·좌 mm */
    filename,
    image:       { type: "jpeg", quality: 0.97 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF:       { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak:   { mode: ["avoid-all", "css"] },
  };

  const btn = document.getElementById("pdfBtn");
  const btn2 = document.getElementById("pdfBtn2");
  const label = "PDF 다운로드";
  const loading = "생성 중…";
  if (btn)  btn.textContent  = loading;
  if (btn2) btn2.textContent = loading;

  html2pdf()
    .set(opt)
    .from(sheet)
    .save()
    .then(() => {
      sheet.style.display = "";
      if (btn)  btn.textContent  = label;
      if (btn2) btn2.textContent = label;
    })
    .catch(() => {
      sheet.style.display = "";
      if (btn)  btn.textContent  = label;
      if (btn2) btn2.textContent = label;
      alert("PDF 생성에 실패했습니다. 브라우저 콘솔을 확인해 주세요.");
    });
}

/* ── 미리보기 ── */
function openPreview() {
  buildSheet();
  const sheet = document.getElementById("proposalSheet");
  document.getElementById("previewBody").innerHTML = sheet.outerHTML;
  document.getElementById("previewOverlay").classList.remove("hidden");
}
function closePreview() {
  document.getElementById("previewOverlay").classList.add("hidden");
}

/* ── 이벤트 연결 ── */
document.getElementById("previewBtn").addEventListener("click", openPreview);
document.getElementById("previewBtn2").addEventListener("click", openPreview);
document.getElementById("pdfBtn").addEventListener("click", downloadPDF);
document.getElementById("pdfBtn2").addEventListener("click", downloadPDF);
document.getElementById("closePreview").addEventListener("click", closePreview);
document.getElementById("pdfFromModal").addEventListener("click", () => {
  closePreview();
  downloadPDF();
});
document.getElementById("previewOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closePreview();
});

/* ── 초기화 ── */
buildSheet();
