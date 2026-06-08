const inputs = {
  totalSmsKg: document.getElementById("totalSmsKg"),
  biocharRatio: document.getElementById("biocharRatio"),
  initialMoisture: document.getElementById("initialMoisture"),
  targetMoisture: document.getElementById("targetMoisture"),
  charYield: document.getElementById("charYield"),
  blendRatio: document.getElementById("blendRatio"),
  fertilizerYield: document.getElementById("fertilizerYield"),
  bagKg: document.getElementById("bagKg"),
  biocharCostPerKg: document.getElementById("biocharCostPerKg"),
  premiumPerBag: document.getElementById("premiumPerBag"),
};

const outputs = {
  smsForBiochar: document.getElementById("smsForBiochar"),
  smsForFertilizer: document.getElementById("smsForFertilizer"),
  driedSmsKg: document.getElementById("driedSmsKg"),
  biocharKg: document.getElementById("biocharKg"),
  baseFertilizerKg: document.getElementById("baseFertilizerKg"),
  finalProductKg: document.getElementById("finalProductKg"),
  bagCount: document.getElementById("bagCount"),
  extraCostPerBag: document.getElementById("extraCostPerBag"),
  netPremiumPerBag: document.getElementById("netPremiumPerBag"),
  message: document.getElementById("message"),
};

function num(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function formatKg(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}톤`;
  }
  if (value < 1 && value > 0) {
    return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}kg`;
  }
  return `${Math.round(value).toLocaleString("ko-KR")}kg`;
}

function formatWon(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function calculate() {
  const totalSmsKg = num(inputs.totalSmsKg);
  const biocharRatio = num(inputs.biocharRatio) / 100;
  const initialMoisture = num(inputs.initialMoisture) / 100;
  const targetMoisture = num(inputs.targetMoisture) / 100;
  const charYield = num(inputs.charYield) / 100;
  const blendRatio = num(inputs.blendRatio) / 100;
  const fertilizerYield = num(inputs.fertilizerYield) / 100;
  const bagKg = Math.max(num(inputs.bagKg), 1);
  const biocharCostPerKg = num(inputs.biocharCostPerKg);
  const premiumPerBag = num(inputs.premiumPerBag);

  if (targetMoisture >= 1) {
    outputs.message.textContent = "목표 수분은 100% 미만이어야 합니다.";
    return;
  }

  const smsForBiochar = totalSmsKg * biocharRatio;
  const smsForFertilizer = totalSmsKg - smsForBiochar;

  const dryMatter = smsForBiochar * (1 - initialMoisture);
  const driedSmsKg = dryMatter / (1 - targetMoisture);

  const biocharKg = driedSmsKg * charYield;
  const baseFertilizerKg = smsForFertilizer * fertilizerYield;

  const maxBiocharByBlend =
    blendRatio > 0 ? (baseFertilizerKg * blendRatio) / (1 - blendRatio) : 0;

  const usedBiocharKg = blendRatio > 0 ? Math.min(biocharKg, maxBiocharByBlend) : 0;
  const unusedBiocharKg = Math.max(biocharKg - usedBiocharKg, 0);

  const finalProductKg = baseFertilizerKg + usedBiocharKg;
  const bagCount = finalProductKg / bagKg;

  const totalBiocharCost = usedBiocharKg * biocharCostPerKg;
  const extraCostPerBag = bagCount > 0 ? totalBiocharCost / bagCount : 0;
  const netPremiumPerBag = premiumPerBag - extraCostPerBag;

  outputs.smsForBiochar.textContent = formatKg(smsForBiochar);
  outputs.smsForFertilizer.textContent = formatKg(smsForFertilizer);
  outputs.driedSmsKg.textContent = formatKg(driedSmsKg);
  outputs.biocharKg.textContent = `${formatKg(biocharKg)} 생산 / ${formatKg(usedBiocharKg)} 사용`;
  outputs.baseFertilizerKg.textContent = formatKg(baseFertilizerKg);
  outputs.finalProductKg.textContent = formatKg(finalProductKg);
  outputs.bagCount.textContent = `${Math.floor(bagCount).toLocaleString("ko-KR")}포`;
  outputs.extraCostPerBag.textContent = formatWon(extraCostPerBag);
  outputs.netPremiumPerBag.textContent = formatWon(netPremiumPerBag);

  outputs.message.textContent = makeMessage({
    blendRatio,
    biocharKg,
    usedBiocharKg,
    unusedBiocharKg,
    extraCostPerBag,
    netPremiumPerBag,
  });
}

function makeMessage({
  blendRatio,
  biocharKg,
  usedBiocharKg,
  unusedBiocharKg,
  extraCostPerBag,
  netPremiumPerBag,
}) {
  if (blendRatio === 0) {
    return "최종 혼합비가 0%입니다. biochar를 제품에 넣지 않는 조건입니다.";
  }

  if (usedBiocharKg <= 0) {
    return "사용 가능한 biochar가 없습니다. biochar 전환 비율, 탄화 수율, 혼합비를 다시 확인하세요.";
  }

  const messages = [];

  messages.push(
    `최종 제품에는 SMS biochar 약 ${formatKg(usedBiocharKg)}이 혼합됩니다.`
  );

  if (unusedBiocharKg > 1) {
    messages.push(
      `생산 biochar 중 약 ${formatKg(unusedBiocharKg)}은 남습니다. 별도 토양개량재, 다음 배치 혼합, 시험포 투입용으로 관리할 수 있습니다.`
    );
  }

  messages.push(
    `biochar로 인한 포대당 추가 원가는 약 ${formatWon(extraCostPerBag)}입니다.`
  );

  if (netPremiumPerBag > 0) {
    messages.push(
      `설정한 프리미엄 가격 기준으로 포대당 약 ${formatWon(netPremiumPerBag)}의 순증 효과가 있습니다. 탄소형 제품으로 사업성이 있습니다.`
    );
  } else {
    messages.push(
      "설정한 프리미엄 가격으로는 biochar 추가 원가를 충분히 회수하지 못합니다. 판매가 상승분 또는 제조비를 조정해야 합니다."
    );
  }

  return messages.join(" ");
}

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", calculate);
});

calculate();
