const KEY = "espressoLogbook.v1";
const form = document.getElementById("shot-form");
const tableBody = document.getElementById("shots-table");
const kpis = document.getElementById("kpis");

const getShots = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const saveShots = (shots) => localStorage.setItem(KEY, JSON.stringify(shots));

const extractionYield = (tds, yieldOut, doseIn) => (tds && yieldOut && doseIn) ? ((tds / 100) * yieldOut / doseIn) * 100 : null;
const brewRatio = (yieldOut, doseIn) => doseIn ? (yieldOut / doseIn) : null;
const flowRate = (yieldOut, shotTime) => shotTime ? (yieldOut / shotTime) : null;

function shotQualityScore(s) {
  // Weighted score that balances taste, extraction window, and repeatability.
  const ratio = brewRatio(s.yieldOut, s.doseIn);
  const ey = extractionYield(s.tds, s.yieldOut, s.doseIn);
  const timePenalty = Math.min(Math.abs(s.shotTime - 30) / 30, 1);
  const ratioPenalty = ratio ? Math.min(Math.abs(ratio - 2) / 1.2, 1) : 1;
  const eyPenalty = ey ? Math.min(Math.abs(ey - 19) / 6, 1) : 0.6;
  const sat = (s.satisfaction || 5) / 10;
  return Math.round((sat * 0.45 + (1 - eyPenalty) * 0.25 + (1 - ratioPenalty) * 0.2 + (1 - timePenalty) * 0.1) * 100);
}

function render() {
  const shots = getShots().sort((a,b) => new Date(a.shotAt) - new Date(b.shotAt));
  tableBody.innerHTML = shots.slice(-20).reverse().map(s => {
    const ratio = brewRatio(s.yieldOut, s.doseIn)?.toFixed(2) || "-";
    const ey = extractionYield(s.tds, s.yieldOut, s.doseIn)?.toFixed(1) || "-";
    return `<tr><td>${new Date(s.shotAt).toLocaleString()}</td><td>${s.bagId}</td><td>${ratio}</td><td>${s.shotTime}s</td><td>${ey}</td><td>${shotQualityScore(s)}</td></tr>`;
  }).join("");

  const avg = (arr) => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
  const ratios = shots.map(s => brewRatio(s.yieldOut, s.doseIn)).filter(Boolean);
  const times = shots.map(s => s.shotTime).filter(Boolean);
  const sats = shots.map(s => s.satisfaction).filter(Boolean);

  kpis.innerHTML = `
    <div><strong>${shots.length}</strong><br/>Shots</div>
    <div><strong>${avg(ratios).toFixed(2)}</strong><br/>Avg Ratio</div>
    <div><strong>${avg(times).toFixed(1)}s</strong><br/>Avg Time</div>
    <div><strong>${avg(sats).toFixed(1)}/10</strong><br/>Avg Satisfaction</div>
  `;

  const labels = shots.map(s => new Date(s.shotAt).toLocaleDateString());
  const ratioData = shots.map(s => brewRatio(s.yieldOut, s.doseIn));
  const qualityData = shots.map(s => shotQualityScore(s));

  if (window.ratioChart) window.ratioChart.destroy();
  if (window.qualityChart) window.qualityChart.destroy();

  window.ratioChart = new Chart(document.getElementById("ratioTrend"), {
    type: "line",
    data: { labels, datasets: [{ label: "Brew Ratio", data: ratioData, borderColor: "#4ecdc4" }] }
  });
  window.qualityChart = new Chart(document.getElementById("qualityTrend"), {
    type: "line",
    data: { labels, datasets: [{ label: "Quality Score", data: qualityData, borderColor: "#ffb703" }] }
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const shot = {
    shotAt: shotAt.value,
    machine: machine.value,
    grinder: grinder.value,
    bagId: bagId.value,
    portafilter: portafilter.value,
    grindSetting: grindSetting.value,
    puckPrepNotes: puckPrepNotes.value,
    doseIn: Number(doseIn.value),
    shotTime: Number(shotTime.value),
    yieldOut: Number(yieldOut.value),
    maxPressure: Number(maxPressure.value || 0),
    tds: Number(tds.value || 0),
    satisfaction: Number(satisfaction.value),
    flavorNotes: flavorNotes.value,
    visualNotes: visualNotes.value
  };

  const shots = getShots();
  shots.push(shot);
  saveShots(shots);
  form.reset();
  render();
});

document.getElementById("export-btn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(getShots(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `espresso-logbook-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
});

render();
