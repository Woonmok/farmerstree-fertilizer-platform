// ─────────────────────────────────────────────
//  Farmerstree — 농가 ROI 시뮬레이터  app.js
// ─────────────────────────────────────────────

// 작물별 기본값 (기비/추비/토양개량/인건비/수확량/단가/수확증가율%)
const CROP_PRESETS = {
  rice:       { name:'벼 (논)',       base:30000, top:15000, soil:10000, labor:15000, yield:500,  price:1800, yieldUp:5  },
  pepper:     { name:'고추',          base:40000, top:25000, soil:18000, labor:25000, yield:180,  price:8000, yieldUp:8  },
  garlic:     { name:'마늘',          base:50000, top:20000, soil:20000, labor:30000, yield:800,  price:3500, yieldUp:7  },
  onion:      { name:'양파',          base:35000, top:18000, soil:15000, labor:20000, yield:4000, price:500,  yieldUp:6  },
  cabbage:    { name:'배추',          base:30000, top:15000, soil:12000, labor:18000, yield:5000, price:300,  yieldUp:6  },
  strawberry: { name:'딸기 (시설)',   base:60000, top:40000, soil:30000, labor:40000, yield:2000, price:6000, yieldUp:10 },
  tomato:     { name:'토마토 (시설)', base:55000, top:35000, soil:25000, labor:35000, yield:8000, price:1500, yieldUp:9  },
  apple:      { name:'사과',          base:45000, top:30000, soil:20000, labor:35000, yield:2000, price:3000, yieldUp:7  },
};

// 제품별 기본 설정
const PRODUCT_PRESETS = {
  A: { price:18000, usage:2.0, chemReplace:50, soilReplace:60, yieldUp:4  },
  B: { price:23000, usage:2.0, chemReplace:55, soilReplace:70, yieldUp:6  },
  C: { price:28000, usage:2.5, chemReplace:60, soilReplace:80, yieldUp:8  },
};

// ─── 초기화 ───────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  renderRefTable();
  onCropChange();
  calcROI();
});

function onCropChange() {
  const key = document.getElementById('cropType').value;
  const p = CROP_PRESETS[key];
  if (!p) return;
  document.getElementById('chemBase').value   = p.base;
  document.getElementById('chemTop').value    = p.top;
  document.getElementById('chemSoil').value   = p.soil;
  document.getElementById('chemLabor').value  = p.labor;
  document.getElementById('chemYield').value  = p.yield;
  document.getElementById('cropPrice').value  = p.price;
  document.getElementById('ftYieldUp').value  = p.yieldUp;
  calcROI();
}

function onProductChange() {
  const key = document.getElementById('ftProductType').value;
  const p = PRODUCT_PRESETS[key];
  if (!p) return;
  document.getElementById('ftPrice').value       = p.price;
  document.getElementById('ftUsage').value       = p.usage;
  document.getElementById('ftChemReplace').value = p.chemReplace;
  document.getElementById('ftSoilReplace').value = p.soilReplace;
  document.getElementById('ftYieldUp').value     = p.yieldUp;
  calcROI();
}

function onAreaUnitChange() {
  const val = document.getElementById('areaUnit').value;
  const grp = document.getElementById('customAreaGroup');
  grp.style.display = (val === 'custom') ? 'block' : 'none';
  calcROI();
}

// ─── 핵심 계산 ────────────────────────────────
function calcROI() {
  const areaUnitVal = document.getElementById('areaUnit').value;
  const unitSize = areaUnitVal === 'custom'
    ? (parseFloat(document.getElementById('customArea').value) || 1000)
    : parseFloat(areaUnitVal);
  const areaCount = parseFloat(document.getElementById('areaCount').value) || 1;
  const totalArea = unitSize * areaCount;

  // 단위 환산 비율 (입력은 1,000㎡ 기준 → 실제 면적 적용)
  const scale = totalArea / 1000;

  // 화학비료 현황
  const chemBase  = parseFloat(document.getElementById('chemBase').value)  || 0;
  const chemTop   = parseFloat(document.getElementById('chemTop').value)   || 0;
  const chemSoil  = parseFloat(document.getElementById('chemSoil').value)  || 0;
  const chemLabor = parseFloat(document.getElementById('chemLabor').value) || 0;
  const chemYield = parseFloat(document.getElementById('chemYield').value) || 0;
  const cropPrice = parseFloat(document.getElementById('cropPrice').value) || 0;

  const chemTotalPer1k = chemBase + chemTop + chemSoil + chemLabor;
  const chemTotalAll   = chemTotalPer1k * scale;
  const chemRevenue    = chemYield * cropPrice * scale;

  // Farmerstree 설정
  const ftPrice      = parseFloat(document.getElementById('ftPrice').value)      || 0;
  const ftUsage      = parseFloat(document.getElementById('ftUsage').value)      || 0;
  const ftChemRepl   = parseFloat(document.getElementById('ftChemReplace').value)/ 100 || 0;
  const ftSoilRepl   = parseFloat(document.getElementById('ftSoilReplace').value)/ 100 || 0;
  const ftYieldUp    = parseFloat(document.getElementById('ftYieldUp').value)    / 100 || 0;
  const subsidyRate  = parseFloat(document.getElementById('subsidyRate').value)  / 100 || 0;

  // 비료비 절감
  const fertSavingPer1k = (chemBase + chemTop) * ftChemRepl + chemSoil * ftSoilRepl;
  const fertSavingAll   = fertSavingPer1k * scale;

  // Farmerstree 비용
  const ftCostPer1k  = ftPrice * ftUsage;
  const ftCostAll    = ftCostPer1k * scale;

  // 보조금
  const subsidyAll   = ftCostAll * subsidyRate;
  const ftNetCostAll = ftCostAll - subsidyAll;

  // 수확량 증가 수익
  const yieldGainKg  = chemYield * ftYieldUp * scale;
  const yieldGainWon = yieldGainKg * cropPrice;

  // 순 절감·수익
  const netSaving = fertSavingAll + yieldGainWon - ftNetCostAll;

  // ROI (투자 대비)
  const roi = ftNetCostAll > 0 ? (netSaving / ftNetCostAll) : 0;

  // 투자 회수 (연 단위)
  const bepYears = netSaving > 0 ? (ftNetCostAll / netSaving) : Infinity;

  // 탄소저장 추정 (C형만, 바이오차 20kg포대 × 30% biochar 함유 × 탄소함량 60%)
  const productType = document.getElementById('ftProductType').value;
  const biocharKg   = productType === 'C' ? (ftUsage * 20 * 0.3 * scale) : 0;
  const carbonSeqKg = biocharKg * 0.60;

  // ─── UI 업데이트 ───
  document.getElementById('totalAreaHint').textContent = `총 ${comma(totalArea)}㎡`;
  document.getElementById('resultAreaLabel').textContent = `적용 면적: ${comma(totalArea)}㎡ (${comma(unitSize)}㎡ × ${areaCount}단위)`;

  document.getElementById('resNetSaving').textContent   = wonStr(netSaving);
  document.getElementById('resNetSavingSub').textContent = netSaving >= 0
    ? `화학비료 대비 연간 절감·수익 합산` : `비용 부담이 더 큽니다 — 면적·대체율 조정 권장`;
  document.getElementById('resNetSaving').className = 'result-value ' + (netSaving >= 0 ? 'green' : 'red');

  document.getElementById('resFertSaving').textContent   = wonStr(fertSavingAll);
  document.getElementById('resFertSavingSub').textContent = `(화학비료 대체 절감 ${wonStr(fertSavingPer1k)}/1,000㎡)`;

  document.getElementById('resYieldGain').textContent   = wonStr(yieldGainWon);
  document.getElementById('resYieldGainSub').textContent = `수확량 +${comma(Math.round(yieldGainKg))}kg × ${comma(cropPrice)}원/kg`;

  document.getElementById('resFTCost').textContent   = wonStr(ftNetCostAll);
  document.getElementById('resFTCostSub').textContent = `(보조금 ${wonStr(subsidyAll)} 차감 후 실비용)`;

  document.getElementById('resSubsidy').textContent = wonStr(subsidyAll);

  const roiText = roi >= 0 ? `${roi.toFixed(1)}배` : '–';
  document.getElementById('resROI').textContent = roiText;
  document.getElementById('resROI').className = 'result-value ' + (roi >= 1 ? 'green' : roi >= 0 ? '' : 'red');

  document.getElementById('resBEP').textContent = isFinite(bepYears)
    ? (bepYears < 1 ? `${Math.round(bepYears * 12)}개월 이내` : `${bepYears.toFixed(1)}년`)
    : '절감 효과 없음';

  document.getElementById('resYieldKg').textContent = `+${comma(Math.round(yieldGainKg))}kg (${(ftYieldUp*100).toFixed(0)}% 증가)`;

  document.getElementById('resCarbonSeq').textContent = productType === 'C'
    ? `약 ${carbonSeqKg.toFixed(1)}kg CO₂e 저장`
    : 'C형(바이오차 복합) 선택 시 적용';

  // 비교 바
  const maxBar = Math.max(chemTotalAll, ftCostAll + (chemTotalAll - fertSavingAll));
  const ftBarCost = ftCostAll + chemTotalAll - fertSavingAll - subsidyAll;
  document.getElementById('barChem').style.width   = maxBar > 0 ? `${Math.min(100, chemTotalAll / maxBar * 100)}%` : '0%';
  document.getElementById('barFT').style.width     = maxBar > 0 ? `${Math.min(100, Math.max(0, ftBarCost / maxBar * 100))}%` : '0%';
  document.getElementById('barChemVal').textContent = wonStr(chemTotalAll);
  document.getElementById('barFTVal').textContent   = wonStr(Math.max(0, ftBarCost));

  // 영업 요약 문구
  const cropName = CROP_PRESETS[document.getElementById('cropType').value]?.name || '작물';
  const productName = { A:'A형(고부숙)', B:'B형(기능성)', C:'C형(바이오차 복합)' }[productType] || '';
  const summaryText = netSaving >= 0
    ? `${cropName} ${comma(totalArea)}㎡에 Farmerstree ${productName} 비료를 적용할 경우, ` +
      `비료비 절감 ${wonStr(fertSavingAll)}과 수확량 증가 수익 ${wonStr(yieldGainWon)}을 합산해 ` +
      `연간 약 ${wonStr(netSaving)}의 순이익 개선 효과가 예상됩니다. ` +
      `(ROI ${roiText}, 보조금 ${wonStr(subsidyAll)} 포함)` +
      (productType === 'C' ? ` 바이오차 투입으로 탄소저장 ${carbonSeqKg.toFixed(1)}kg CO₂e 인정 가능.` : '')
    : `현재 입력 조건에서는 비용 대비 절감 효과가 크지 않습니다. 면적 확대 또는 화학비료 대체율을 높일 경우 효과가 개선됩니다.`;

  document.getElementById('summaryText').textContent = summaryText;
}

// ─── 유틸 ─────────────────────────────────────
function comma(n) {
  return Math.round(n).toLocaleString('ko-KR');
}
function wonStr(n) {
  const abs = Math.abs(n);
  if (abs >= 10000000) return `${(n/10000000).toFixed(1)}천만원`;
  if (abs >= 1000000)  return `${(n/1000000).toFixed(1)}백만원`;
  if (abs >= 10000)    return `${(n/10000).toFixed(0)}만원`;
  return `${comma(n)}원`;
}

function copySummary() {
  const text = document.getElementById('summaryText').textContent;
  navigator.clipboard.writeText(text)
    .then(() => {
      const btn = document.querySelector('.btn-copy');
      btn.textContent = '복사 완료!';
      setTimeout(() => btn.textContent = '문구 복사', 2000);
    })
    .catch(() => alert('복사에 실패했습니다. 직접 선택해 복사하세요.'));
}

function exportCSV() {
  const rows = [
    ['항목', '값'],
    ['작물', CROP_PRESETS[document.getElementById('cropType').value]?.name || ''],
    ['면적(㎡)', document.getElementById('totalAreaHint').textContent.replace('총 ','').replace('㎡','')],
    ['제품', document.getElementById('ftProductType').selectedOptions[0].text],
    ['비료비 절감(원)', document.getElementById('resFertSaving').textContent],
    ['수확량 증가 수익(원)', document.getElementById('resYieldGain').textContent],
    ['FT비료 순비용(원)', document.getElementById('resFTCost').textContent],
    ['보조금(원)', document.getElementById('resSubsidy').textContent],
    ['연간 순이익 개선(원)', document.getElementById('resNetSaving').textContent],
    ['ROI', document.getElementById('resROI').textContent],
    ['투자회수기간', document.getElementById('resBEP').textContent],
    ['탄소저장', document.getElementById('resCarbonSeq').textContent],
    ['생성일시', new Date().toLocaleString('ko-KR')],
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `farmerstree-roi-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function renderRefTable() {
  const tbody = document.getElementById('refTableBody');
  tbody.innerHTML = Object.entries(CROP_PRESETS).map(([, p]) => `
    <tr>
      <td>${p.name}</td>
      <td>${comma(p.base)}원</td>
      <td>${comma(p.top)}원</td>
      <td>${comma(p.soil)}원</td>
      <td>${comma(p.yield)}kg</td>
      <td>${comma(p.price)}원/kg</td>
      <td>+${p.yieldUp}%</td>
    </tr>
  `).join('');
}
