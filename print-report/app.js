const ids = [
  "batchId", "productName", "inspectionDate", "moisture", "ph", "ec", "cn", "gi", "breakage", "finalStatus", "reviewComment", "approver"
];

const inputs = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

const outputs = {
  batchId: document.getElementById("outBatchId"),
  productName: document.getElementById("outProductName"),
  inspectionDate: document.getElementById("outInspectionDate"),
  moisture: document.getElementById("outMoisture"),
  ph: document.getElementById("outPh"),
  ec: document.getElementById("outEc"),
  cn: document.getElementById("outCn"),
  gi: document.getElementById("outGi"),
  breakage: document.getElementById("outBreakage"),
  finalStatus: document.getElementById("outFinalStatus"),
  reviewComment: document.getElementById("outReviewComment"),
  approver: document.getElementById("outApprover"),
};

const generateBtn = document.getElementById("generateBtn");
const printBtn = document.getElementById("printBtn");

function today() {
  return new Date().toISOString().slice(0, 10);
}

inputs.inspectionDate.value = today();

function generateReport() {
  outputs.batchId.textContent = inputs.batchId.value.trim();
  outputs.productName.textContent = inputs.productName.value.trim();
  outputs.inspectionDate.textContent = inputs.inspectionDate.value;
  outputs.moisture.textContent = `${inputs.moisture.value}%`;
  outputs.ph.textContent = inputs.ph.value;
  outputs.ec.textContent = inputs.ec.value;
  outputs.cn.textContent = inputs.cn.value;
  outputs.gi.textContent = inputs.gi.value;
  outputs.breakage.textContent = `${inputs.breakage.value}%`;
  outputs.finalStatus.textContent = inputs.finalStatus.value;
  outputs.reviewComment.textContent = inputs.reviewComment.value.trim();
  outputs.approver.textContent = inputs.approver.value.trim();
}

generateBtn.addEventListener("click", generateReport);
printBtn.addEventListener("click", () => {
  generateReport();
  window.print();
});

generateReport();
