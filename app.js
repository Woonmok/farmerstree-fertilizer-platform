console.log("Farmerstree Fertilizer Platform home loaded.");

document.addEventListener("DOMContentLoaded", () => {
	const runtimeBanner = document.getElementById("runtime-banner");
	const runtimeModeLabel = document.getElementById("runtime-mode-label");
	const runtimeCurrentUrl = document.getElementById("runtime-current-url");
	const runtimeLocalUrl = document.getElementById("runtime-local-url");

	if (!runtimeBanner || !runtimeModeLabel || !runtimeCurrentUrl || !runtimeLocalUrl) {
		return;
	}

	const currentUrl = window.location.href;
	const expectedLocalUrl = "file:///Users/seunghoonoh/.gemini/antigravity/scratch/farmerstree-fertilizer-platform/index.html";
	const isLocal = window.location.protocol === "file:";

	runtimeCurrentUrl.textContent = currentUrl;
	runtimeLocalUrl.textContent = expectedLocalUrl;

	if (isLocal) {
		runtimeModeLabel.textContent = "로컬 파일 실행 화면입니다.";
		runtimeBanner.classList.add("is-local");
	} else {
		runtimeModeLabel.textContent = "웹 배포 화면입니다. 로컬 실행이 필요하면 아래 권장 경로로 열어주세요.";
		runtimeBanner.classList.add("is-remote");
	}
});
