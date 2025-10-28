export function loadSlider() {
  fetch("../starter-code/assets/icon-x.svg")
    .then((response) => response.text())
    .then((svgText) => {
      const container = document.getElementById("x-mark-slider");
      container.innerHTML = svgText;

      const svg = container.querySelector("svg");
      svg.setAttribute("height", "100%");
      svg.setAttribute("width", "100%");
      svg.setAttribute("viewBox", "0 0 70 70");
    })
    .catch((err) => console.error("Error loading SVG:", err));

  fetch("../starter-code/assets/icon-o.svg")
    .then((response) => response.text())
    .then((svgText) => {
      const container = document.getElementById("o-mark-slider");
      container.innerHTML = svgText;

      const svg = container.querySelector("svg");
      svg.setAttribute("height", "100%");
      svg.setAttribute("width", "100%");
      svg.setAttribute("viewBox", "0 0 70 70");
    })
    .catch((err) => console.error("Error loading SVG:", err));

  const slider = document.querySelector(".slider");
  slider.addEventListener("click", () => {
    giveSliderFunction();
  });
}

loadSlider();

function giveSliderFunction() {
  const xMark = document.getElementById("x-mark-slider");
  const oMark = document.getElementById("o-mark-slider");
  const xRadio = document.getElementById("x-mark-radio");
  const oRadio = document.getElementById("o-mark-radio");

  if (xMark.classList.contains("selected")) {
    xRadio.removeAttribute("checked");
    oRadio.setAttribute("checked", "");
    xMark.classList.remove("selected");
    oMark.classList.add("selected");
  } else {
    oRadio.removeAttribute("checked");
    xRadio.setAttribute("checked", "");
    oMark.classList.remove("selected");
    xMark.classList.add("selected");
  }
}
