const inputs = {
	bags: document.getElementById("bags"),
	rawCost: document.getElementById("rawCost"),
	saltCost: document.getElementById("saltCost"),
	cnCost: document.getElementById("cnCost"),
	microbeCost: document.getElementById("microbeCost"),
	compostCost: document.getElementById("compostCost"),
	pelletCost: document.getElementById("pelletCost"),
	packagingCost: document.getElementById("packagingCost"),
	qcCost: document.getElementById("qcCost"),
	laborCost: document.getElementById("laborCost"),
	salePrice: document.getElementById("salePrice"),
	subsidy: document.getElementById("subsidy"),
};

const outputs = {
	unitCost: document.getElementById("unitCost"),
	totalCost: document.getElementById("totalCost"),
	totalRevenue: document.getElementById("totalRevenue"),
	farmerPrice: document.getElementById("farmerPrice"),
	profit: document.getElementById("profit"),
	marginRate: document.getElementById("marginRate"),
	breakEvenPrice: document.getElementById("breakEvenPrice"),
	businessMessage: document.getElementById("businessMessage"),
};

function toNumber(input) {
	const value = Number(input.value);
	return Number.isFinite(value) ? value : 0;
}

function formatWon(value) {
	return Math.round(value).toLocaleString("ko-KR") + "원";
}

function calculate() {
	const bags = Math.max(toNumber(inputs.bags), 0);

	const unitCost =
		toNumber(inputs.rawCost) +
		toNumber(inputs.saltCost) +
		toNumber(inputs.cnCost) +
		toNumber(inputs.microbeCost) +
		toNumber(inputs.compostCost) +
		toNumber(inputs.pelletCost) +
		toNumber(inputs.packagingCost) +
		toNumber(inputs.qcCost) +
		toNumber(inputs.laborCost);

	const salePrice = toNumber(inputs.salePrice);
	const subsidy = toNumber(inputs.subsidy);

	const totalCost = unitCost * bags;
	const totalRevenue = salePrice * bags;
	const profit = totalRevenue - totalCost;
	const marginRate = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
	const farmerPrice = Math.max(salePrice - subsidy, 0);
	const breakEvenPrice = unitCost;

	outputs.unitCost.textContent = formatWon(unitCost);
	outputs.totalCost.textContent = formatWon(totalCost);
	outputs.totalRevenue.textContent = formatWon(totalRevenue);
	outputs.farmerPrice.textContent = formatWon(farmerPrice);
	outputs.profit.textContent = formatWon(profit);
	outputs.marginRate.textContent = marginRate.toFixed(1) + "%";
	outputs.breakEvenPrice.textContent = formatWon(breakEvenPrice);

	outputs.businessMessage.textContent = getBusinessMessage({
		unitCost,
		salePrice,
		subsidy,
		farmerPrice,
		profit,
		marginRate,
	});
}

function getBusinessMessage({
	unitCost,
	salePrice,
	subsidy,
	farmerPrice,
	profit,
	marginRate,
}) {
	if (profit < 0) {
		return `현재 조건은 적자 구조입니다. 포대당 제조원가가 ${formatWon(unitCost)}인데 판매가가 ${formatWon(salePrice)}이므로 판매가 인상, 첨가물비 절감, 펠릿화비 절감이 필요합니다.`;
	}

	if (marginRate < 20) {
		return `마진율이 ${marginRate.toFixed(1)}%로 낮습니다. 보조금 ${formatWon(subsidy)} 적용 후 농가 체감가는 ${formatWon(farmerPrice)}입니다. 최소 25~30% 마진을 목표로 판매가 또는 원가를 조정해야 합니다.`;
	}

	if (marginRate < 35) {
		return `현실적인 사업 가능 구간입니다. 보조금 적용 후 농가 체감가 ${formatWon(farmerPrice)}, 마진율 ${marginRate.toFixed(1)}%입니다. 초기 농가 공급용 가격으로 검토할 수 있습니다.`;
	}

	return `양호한 수익 구조입니다. 보조금 적용 후 농가 체감가 ${formatWon(farmerPrice)}, 마진율 ${marginRate.toFixed(1)}%입니다. 기능성 펠릿비료로 브랜딩하면 사업성이 있습니다.`;
}

Object.values(inputs).forEach((input) => {
	input.addEventListener("input", calculate);
});

calculate();
