// ─────────────────────────────────────────────
//  Farmerstree — 재고·출하·거래처 관리  app.js
// ─────────────────────────────────────────────

const STORAGE_KEYS = {
  stocks:    'ft_stocks',
  shipments: 'ft_shipments',
  customers: 'ft_customers',
};

// ─── 데이터 로드/저장 ─────────────────────────
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getStocks()    { return load(STORAGE_KEYS.stocks);    }
function getShipments() { return load(STORAGE_KEYS.shipments); }
function getCustomers() { return load(STORAGE_KEYS.customers); }

// ─── 초기화 ───────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  setDefaultDates();
  renderAll();
});

function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  const mfgEl = document.getElementById('stockMfgDate');
  const shipEl = document.getElementById('shipDate');
  if (mfgEl) mfgEl.value = today;
  if (shipEl) shipEl.value = today;
}

function renderAll() {
  renderInventory();
  renderCustomerTable();
  renderHistory();
  updateKPI();
  populateLotSelect();
  populateCustomerSelects();
}

function toggleStockForm() {
  const card = document.getElementById('stockFormCard');
  if (!card) return;
  card.style.display = card.style.display === 'none' ? 'block' : 'none';
}

// ─── 탭 전환 ──────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  const btns = document.querySelectorAll('.tab-btn');
  const tabNames = ['inventory','shipment','customer','history'];
  const idx = tabNames.indexOf(name);
  if (idx >= 0 && btns[idx]) btns[idx].classList.add('active');
  if (name === 'shipment') { populateLotSelect(); populateCustomerSelects(); }
  if (name === 'history')  { populateFilterCustomer(); renderHistory(); }
}

// ─── 재고 등록 ────────────────────────────────
function addStock() {
  const lot      = document.getElementById('stockLot').value.trim();
  const type     = document.getElementById('stockProductType').value;
  const mfgDate  = document.getElementById('stockMfgDate').value;
  const pkgUnit  = parseInt(document.getElementById('stockPkgUnit').value);
  const qty      = parseInt(document.getElementById('stockQty').value);
  const note     = document.getElementById('stockNote').value.trim();

  if (!lot)     { alert('로트번호를 입력하세요.'); return; }
  if (!mfgDate) { alert('제조일을 입력하세요.');  return; }
  if (!qty || qty < 1) { alert('수량을 입력하세요.'); return; }

  const stocks = getStocks();
  const existing = stocks.find(s => s.lot === lot);
  if (existing) {
    if (!confirm(`로트번호 ${lot}가 이미 존재합니다. 수량을 추가하시겠습니까?`)) return;
    existing.inQty += qty;
    existing.note = note || existing.note;
  } else {
    stocks.push({ lot, type, mfgDate, pkgUnit, inQty: qty, note, createdAt: new Date().toISOString() });
  }
  save(STORAGE_KEYS.stocks, stocks);
  renderAll();
  document.getElementById('stockLot').value = '';
  document.getElementById('stockNote').value = '';
  alert(`✓ 재고 등록 완료: ${lot} ${qty}포`);
}

// ─── 출하 등록 ────────────────────────────────
function onShipLotChange() {
  const lot = document.getElementById('shipLot').value;
  const stocks = getStocks();
  const stock = stocks.find(s => s.lot === lot);
  const shipments = getShipments();
  const shipped = shipments.filter(s => s.lot === lot).reduce((a, b) => a + b.qty, 0);
  const avail = stock ? (stock.inQty - shipped) : 0;
  document.getElementById('shipAvailHint').textContent = `가용 재고: ${avail}포`;
  updateShipTotal();
}

document.addEventListener('input', e => {
  if (e.target.id === 'shipQty' || e.target.id === 'shipUnitPrice') updateShipTotal();
});

function updateShipTotal() {
  const qty = parseFloat(document.getElementById('shipQty').value) || 0;
  const price = parseFloat(document.getElementById('shipUnitPrice').value) || 0;
  const total = qty * price;
  const el = document.getElementById('shipTotalDisplay');
  if (el) el.textContent = total.toLocaleString('ko-KR') + '원';
}

function addShipment() {
  const lot      = document.getElementById('shipLot').value;
  const custId   = document.getElementById('shipCustomer').value;
  const date     = document.getElementById('shipDate').value;
  const qty      = parseInt(document.getElementById('shipQty').value);
  const price    = parseInt(document.getElementById('shipUnitPrice').value);
  const note     = document.getElementById('shipNote').value.trim();

  if (!lot)    { showMsg('shipMsg', '로트번호를 선택하세요.', 'error'); return; }
  if (!custId) { showMsg('shipMsg', '거래처를 선택하세요.', 'error'); return; }
  if (!date)   { showMsg('shipMsg', '출하일을 입력하세요.', 'error'); return; }
  if (!qty || qty < 1) { showMsg('shipMsg', '수량을 입력하세요.', 'error'); return; }

  // 가용 재고 확인
  const stocks = getStocks();
  const stock = stocks.find(s => s.lot === lot);
  const shipments = getShipments();
  const shipped = shipments.filter(s => s.lot === lot).reduce((a, b) => a + b.qty, 0);
  const avail = stock ? (stock.inQty - shipped) : 0;
  if (qty > avail) {
    showMsg('shipMsg', `재고 부족: 가용 ${avail}포, 요청 ${qty}포`, 'error');
    return;
  }

  const customers = getCustomers();
  const cust = customers.find(c => c.id === custId);
  const productType = stock ? stock.type : '–';

  const entry = {
    id:          `SHP-${Date.now()}`,
    lot,
    custId,
    custName:    cust ? cust.name : custId,
    date,
    qty,
    unitPrice:   price,
    totalAmount: qty * price,
    productType,
    note,
    createdAt:   new Date().toISOString(),
  };
  shipments.push(entry);
  save(STORAGE_KEYS.shipments, shipments);
  renderAll();
  document.getElementById('shipNote').value = '';
  showMsg('shipMsg', `✓ 출하 등록 완료: ${cust?.name || custId} / ${lot} / ${qty}포 / ${(qty*price).toLocaleString('ko-KR')}원`, 'success');
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `msg-box msg-${type}`;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

// ─── 거래처 등록 ──────────────────────────────
function addCustomer() {
  const name  = document.getElementById('custName').value.trim();
  const type  = document.getElementById('custType').value;
  const contact = document.getElementById('custContact').value.trim();
  const region  = document.getElementById('custRegion').value.trim();
  const price   = parseInt(document.getElementById('custDefaultPrice').value) || 0;
  const note    = document.getElementById('custNote').value.trim();

  if (!name) { alert('거래처명을 입력하세요.'); return; }

  const customers = getCustomers();
  if (customers.find(c => c.name === name)) {
    alert('이미 등록된 거래처명입니다.');
    return;
  }

  customers.push({
    id:           `CUST-${Date.now()}`,
    name, type, contact, region,
    defaultPrice: price,
    note,
    createdAt:    new Date().toISOString(),
  });
  save(STORAGE_KEYS.customers, customers);
  renderAll();
  ['custName','custContact','custRegion','custNote'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  alert(`✓ 거래처 등록: ${name}`);
}

function deleteCustomer(id) {
  const shipments = getShipments();
  if (shipments.find(s => s.custId === id)) {
    alert('납품 이력이 있는 거래처는 삭제할 수 없습니다.');
    return;
  }
  if (!confirm('삭제하시겠습니까?')) return;
  const customers = getCustomers().filter(c => c.id !== id);
  save(STORAGE_KEYS.customers, customers);
  renderAll();
}

// ─── 렌더링 ───────────────────────────────────
function getShippedByLot(lot) {
  return getShipments().filter(s => s.lot === lot).reduce((a, b) => a + b.qty, 0);
}

function renderInventory() {
  const stocks = getStocks();
  const tbody = document.getElementById('inventoryBody');
  if (!tbody) return;
  if (!stocks.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="9">등록된 재고가 없습니다.</td></tr>';
    return;
  }
  const productLabel = { A:'A형', B:'B형', C:'C형' };
  tbody.innerHTML = stocks.map(s => {
    const shipped = getShippedByLot(s.lot);
    const remain = s.inQty - shipped;
    const remainKg = remain * s.pkgUnit;
    const pct = s.inQty > 0 ? remain / s.inQty : 0;
    let status, statusClass;
    if (remain <= 0)      { status = '소진'; statusClass = 'badge-gray'; }
    else if (pct <= 0.2)  { status = '부족'; statusClass = 'badge-warn'; }
    else if (pct <= 0.5)  { status = '보통'; statusClass = 'badge-blue'; }
    else                  { status = '충분'; statusClass = 'badge-green'; }
    return `
      <tr>
        <td class="monospace">${s.lot}</td>
        <td><span class="badge badge-type-${s.type}">${productLabel[s.type] || s.type}</span></td>
        <td>${s.mfgDate}</td>
        <td>${s.pkgUnit}kg</td>
        <td>${s.inQty.toLocaleString()}</td>
        <td>${shipped.toLocaleString()}</td>
        <td><strong>${remain.toLocaleString()}</strong></td>
        <td>${remainKg.toLocaleString()}kg</td>
        <td><span class="badge ${statusClass}">${status}</span></td>
      </tr>`;
  }).join('');
}

function renderCustomerTable() {
  const customers = getCustomers();
  const shipments = getShipments();
  const tbody = document.getElementById('customerBody');
  if (!tbody) return;
  if (!customers.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">등록된 거래처가 없습니다.</td></tr>';
    return;
  }
  tbody.innerHTML = customers.map(c => {
    const custShips = shipments.filter(s => s.custId === c.id);
    const totalQty = custShips.reduce((a, b) => a + b.qty, 0);
    const totalRev = custShips.reduce((a, b) => a + b.totalAmount, 0);
    return `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td><span class="badge badge-gray">${c.type}</span></td>
        <td>${c.contact || '–'}</td>
        <td>${c.region || '–'}</td>
        <td>${(c.defaultPrice||0).toLocaleString()}원</td>
        <td>${totalQty.toLocaleString()}포</td>
        <td>${totalRev.toLocaleString()}원</td>
        <td>
          <button class="btn-xs" onclick="loadCustomerToShipment('${c.id}')">출하</button>
          <button class="btn-xs danger" onclick="deleteCustomer('${c.id}')">삭제</button>
        </td>
      </tr>`;
  }).join('');
}

function loadCustomerToShipment(custId) {
  switchTab('shipment');
  const sel = document.getElementById('shipCustomer');
  if (sel) {
    sel.value = custId;
    const cust = getCustomers().find(c => c.id === custId);
    if (cust) {
      const priceEl = document.getElementById('shipUnitPrice');
      if (priceEl && cust.defaultPrice) priceEl.value = cust.defaultPrice;
    }
  }
  updateShipTotal();
}

function renderHistory() {
  const shipments = getShipments();
  const filterCust = document.getElementById('filterCustomer')?.value || '';
  const filterProd = document.getElementById('filterProduct')?.value || '';

  const filtered = shipments.filter(s => {
    const custOk = !filterCust || s.custId === filterCust;
    const prodOk = !filterProd || s.productType === filterProd;
    return custOk && prodOk;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const tbody = document.getElementById('historyBody');
  if (!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">출하 이력이 없습니다.</td></tr>';
    document.getElementById('historySummary').innerHTML = '';
    return;
  }

  const totalQty = filtered.reduce((a, b) => a + b.qty, 0);
  const totalRev = filtered.reduce((a, b) => a + b.totalAmount, 0);
  const el = document.getElementById('historySummary');
  if (el) {
    el.innerHTML = `
      <div class="summary-stats">
        <span>총 ${filtered.length}건</span>
        <span>${totalQty.toLocaleString()}포</span>
        <span><strong>${totalRev.toLocaleString()}원</strong></span>
      </div>`;
  }

  const productLabel = { A:'A형', B:'B형', C:'C형' };
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>${s.date}</td>
      <td>${s.custName}</td>
      <td class="monospace">${s.lot}</td>
      <td><span class="badge badge-type-${s.productType}">${productLabel[s.productType] || s.productType}</span></td>
      <td>${s.qty.toLocaleString()}포</td>
      <td>${s.unitPrice.toLocaleString()}원</td>
      <td><strong>${s.totalAmount.toLocaleString()}원</strong></td>
      <td>${s.note || '–'}</td>
    </tr>
  `).join('');
}

function updateKPI() {
  const stocks = getStocks();
  const shipments = getShipments();

  let totalStockBags = 0, totalStockKg = 0, lowCount = 0;
  stocks.forEach(s => {
    const shipped = getShippedByLot(s.lot);
    const remain = s.inQty - shipped;
    totalStockBags += remain;
    totalStockKg += remain * s.pkgUnit;
    if (remain > 0 && remain / s.inQty <= 0.2) lowCount++;
  });

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const monthShips = shipments.filter(s => s.date.startsWith(thisMonth));
  const monthQty = monthShips.reduce((a, b) => a + b.qty, 0);
  const monthRev = monthShips.reduce((a, b) => a + b.totalAmount, 0);

  setText('kpiTotalStock', totalStockBags.toLocaleString() + '포');
  setText('kpiTotalKg', totalStockKg.toLocaleString() + 'kg');
  setText('kpiThisMonthShip', monthQty.toLocaleString() + '포');
  setText('kpiThisMonthRev', monthRev.toLocaleString() + '원');
  setText('kpiLowStockVal', lowCount + '건');

  const kpiLow = document.getElementById('kpiLowStock');
  if (kpiLow) kpiLow.className = 'kpi-card' + (lowCount > 0 ? ' warn' : '');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── 셀렉트 채우기 ────────────────────────────
function populateLotSelect() {
  const sel = document.getElementById('shipLot');
  if (!sel) return;
  const stocks = getStocks();
  const shipments = getShipments();
  const prev = sel.value;
  sel.innerHTML = '<option value="">— 로트 선택 —</option>';
  stocks.forEach(s => {
    const shipped = shipments.filter(sh => sh.lot === s.lot).reduce((a,b)=>a+b.qty,0);
    const remain = s.inQty - shipped;
    if (remain > 0) {
      const opt = document.createElement('option');
      opt.value = s.lot;
      const label = {A:'A형',B:'B형',C:'C형'}[s.type] || s.type;
      opt.textContent = `${s.lot} [${label} / 잔여 ${remain}포]`;
      if (s.lot === prev) opt.selected = true;
      sel.appendChild(opt);
    }
  });
  onShipLotChange();
}

function populateCustomerSelects() {
  const customers = getCustomers();
  ['shipCustomer'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '<option value="">— 거래처 선택 —</option>';
    customers.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.type})`;
      if (c.id === prev) opt.selected = true;
      sel.appendChild(opt);
    });
  });
}

function populateFilterCustomer() {
  const sel = document.getElementById('filterCustomer');
  if (!sel) return;
  const customers = getCustomers();
  const prev = sel.value;
  sel.innerHTML = '<option value="">전체 거래처</option>';
  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    if (c.id === prev) opt.selected = true;
    sel.appendChild(opt);
  });
}

// ─── 내보내기 ─────────────────────────────────
function exportHistoryCSV() {
  const shipments = getShipments().sort((a,b)=>b.date.localeCompare(a.date));
  if (!shipments.length) { alert('이력이 없습니다.'); return; }
  const rows = [
    ['출하일','거래처','로트번호','제품유형','수량(포)','단가(원)','금액(원)','비고'],
    ...shipments.map(s => [s.date, s.custName, s.lot, s.productType, s.qty, s.unitPrice, s.totalAmount, s.note||''])
  ];
  downloadCSV(rows, `farmerstree-shipments-${ymd()}.csv`);
}

function exportAllCSV() {
  exportHistoryCSV();
}

function backupJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    stocks:    getStocks(),
    shipments: getShipments(),
    customers: getCustomers(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `farmerstree-backup-${ymd()}.json`; a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function clearAll() {
  if (!confirm('모든 재고·출하·거래처 데이터를 삭제합니다. 계속하시겠습니까?')) return;
  if (!confirm('정말로 삭제합니다. 이 작업은 되돌릴 수 없습니다.')) return;
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  renderAll();
  alert('초기화 완료');
}

function ymd() {
  return new Date().toISOString().split('T')[0].replace(/-/g,'');
}
