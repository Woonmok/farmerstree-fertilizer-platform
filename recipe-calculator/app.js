const recipes = {
  standard: {
    name: "A안: 일반 농가용 고부숙 펠릿",
    description:
      "일반 농가 공급용 기본 배합입니다. 원가와 품질의 균형을 맞춘 구조로 고추, 마늘, 양파, 과수, 노지작물에 적합합니다.",
    items: [
      { name: "버섯 후배지", kg: 1000, role: "주원료, 유기물 공급" },
      { name: "발효계분 또는 계분퇴비", kg: 100, role: "질소·인산 보정" },
      { name: "미강", kg: 40, role: "발효 촉진, 미생물 먹이" },
      { name: "제올라이트", kg: 30, role: "암모니아·냄새 흡착" },
      { name: "바이오차 또는 왕겨숯", kg: 20, role: "통기성, 보수성, 토양개량" },
      { name: "석고", kg: 10, role: "칼슘·황 공급, pH 완충" },
      { name: "당밀", kg: 3, role: "미생물 활성 보조" },
      { name: "Bacillus 미생물제", kg: 1, role: "후숙 후 기능성 미생물 접종" },
    ],
  },

  premium: {
    name: "B안: 프리미엄 기능성 펠릿",
    description:
      "브랜드형 고급 제품 배합입니다. 유박, 바이오차, 제올라이트, 기능성 미생물 비중을 높여 시설원예, 과수, 온라인 소포장에 적합합니다.",
    items: [
      { name: "버섯 후배지", kg: 1000, role: "주원료, 유기물 공급" },
      { name: "발효계분 또는 계분퇴비", kg: 80, role: "질소·인산 보정" },
      { name: "유박 또는 깻묵", kg: 60, role: "질소·유기물 보강" },
      { name: "미강", kg: 50, role: "발효 촉진, 결착 보조" },
      { name: "제올라이트", kg: 40, role: "암모니아·냄새 흡착" },
      { name: "바이오차 또는 왕겨숯", kg: 40, role: "통기성, 토양개량, 탄소 안정화" },
      { name: "석고", kg: 15, role: "칼슘·황 공급, pH 완충" },
      { name: "해조분 또는 아미노산 부산물", kg: 15, role: "미량요소·기능성 보강" },
      { name: "당밀", kg: 5, role: "미생물 활성 보조" },
      { name: "복합 Bacillus + 효모", kg: 2, role: "후숙 후 기능성 미생물 접종" },
    ],
  },

  lowSalt: {
    name: "C안: 저염 민감작물용",
    description:
      "염류장해에 민감한 작물용 배합입니다. 계분과 유박을 줄이고 코코피트, 왕겨, 바이오차, 제올라이트를 늘려 저염·토양개량 성격을 강화합니다.",
    items: [
      { name: "저염 버섯 후배지", kg: 1000, role: "주원료, 유기물 공급" },
      { name: "코코피트 또는 왕겨", kg: 100, role: "염류 희석, 통기성 보강" },
      { name: "미강", kg: 30, role: "발효 촉진" },
      { name: "바이오차 또는 왕겨숯", kg: 40, role: "염류·냄새 흡착, 토양개량" },
      { name: "제올라이트", kg: 40, role: "암모니아·양이온 흡착" },
      { name: "발효계분 또는 계분퇴비", kg: 50, role: "질소 보정, 저투입" },
      { name: "유박 또는 깻묵", kg: 30, role: "질소·유기물 보강, 저투입" },
      { name: "석고", kg: 10, role: "칼슘·황 공급, pH 완충" },
      { name: "당밀", kg: 2, role: "미생물 활성 보조" },
      { name: "Bacillus 미생물제", kg: 1, role: "후숙 후 기능성 미생물 접종" },
    ],
  },
};

const substrateInput = document.getElementById("substrateKg");
const recipeTypeSelect = document.getElementById("recipeType");
const recipeTable = document.getElementById("recipeTable");
const recipeMessage = document.getElementById("recipeMessage");
const patentRecipeTable = document.getElementById("patentRecipeTable");
const patentRecipeMessage = document.getElementById("patentRecipeMessage");

const patentLockedRatios = [
  { name: "건초", part: 45, min: 40, max: 50 },
  { name: "밀짚", part: 30, min: 25, max: 35 },
  { name: "가금류 분뇨", part: 10, min: 5, max: 15 },
  { name: "미생물제", part: 0.1, min: 0.05, max: 0.2 },
];

function toNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function formatKg(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}톤`;
  }

  if (value < 1) {
    return `${value.toFixed(2)}kg`;
  }

  return `${Math.round(value).toLocaleString("ko-KR")}kg`;
}

function calculateRecipe() {
  const substrateKg = Math.max(toNumber(substrateInput), 0);
  const recipe = recipes[recipeTypeSelect.value];
  const scale = substrateKg / 1000;

  recipeTable.innerHTML = "";

  recipe.items.forEach((item) => {
    const calculatedKg = item.kg * scale;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${formatKg(item.kg)}</td>
      <td><strong>${formatKg(calculatedKg)}</strong></td>
      <td>${item.role}</td>
    `;

    recipeTable.appendChild(row);
  });

  const totalInputKg = recipe.items.reduce((sum, item) => sum + item.kg * scale, 0);

  recipeMessage.textContent =
    `${recipe.name}입니다. 후배지 ${formatKg(substrateKg)} 기준 총 배합 투입량은 약 ${formatKg(totalInputKg)}입니다. ` +
    `${recipe.description} 배합 후 초기 수분 55~60%, pH 6.5~7.5, C/N 25~30을 목표로 수분과 탄질비를 현장에서 다시 보정해야 합니다.`;

  renderPatentLockedRecipe(substrateKg);
}

function renderPatentLockedRecipe(substrateKg) {
  patentRecipeTable.innerHTML = "";

  patentLockedRatios.forEach((item) => {
    const row = document.createElement("tr");
    const calculatedKg = substrateKg * (item.part / 100);

    row.innerHTML = `
      <td>${item.name}</td>
      <td><strong>${item.part}</strong></td>
      <td>${item.min}~${item.max}</td>
      <td><strong>${formatKg(calculatedKg)}</strong></td>
    `;

    patentRecipeTable.appendChild(row);
  });

  patentRecipeMessage.textContent =
    `특허 표준 잠금값은 건초 45, 밀짚 30, 가금류 분뇨 10, 미생물제 0.1 중량부입니다. ` +
    `현재 후배지 ${formatKg(substrateKg)} 기준 환산값을 자동 적용했습니다.`;
}

substrateInput.addEventListener("input", calculateRecipe);
recipeTypeSelect.addEventListener("change", calculateRecipe);

calculateRecipe();
