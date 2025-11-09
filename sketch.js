

let data;
let img;
let minLat, minLon, maxLat, maxLon;
let margin = 70;
let chartW, chartH;

let selectedVolcano = null;

function preload() {
  data = loadTable("data_vulcani.csv", "csv", "header");
  img = loadImage("worldmap.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");

  let allLat = [];
  let allLon = [];

  for (let i = 0; i < data.getRowCount(); i++) {
    let lat = parseFloat(data.getString(i, "Latitude"));
    let lon = parseFloat(data.getString(i, "Longitude"));
    if (!isNaN(lat) && !isNaN(lon)) {
      allLat.push(lat);
      allLon.push(lon);
    }
  }

  minLat = min(allLat);
  maxLat = max(allLat);
  minLon = min(allLon);
  maxLon = max(allLon);

  chartW = width * 0.75;
  chartH = height * 0.9;
}

function draw() {
  background(1);
  drawMap();
  drawSidePanel();
}

function drawMap() {
 // mappa
  image(img, margin, margin, chartW - margin * 1.7, chartH - margin * 1.5);
  
   // cornice
  noFill();
  stroke(220);
  strokeWeight(1);
  rect(margin * 1, margin, chartW - margin * 1.85, chartH - margin * 1.5, 15); // raggio 25 per tutti e 4 gli angoli
  noStroke();


  // titolo
  fill(255);
  textSize(26);
  textAlign(LEFT);
  text("Volcanoes of the World", margin, margin - 30);

  let closestDist = Infinity;
  let closestRow = null;
  let closestX, closestY;

  // vulcani
  for (let i = 0; i < data.getRowCount(); i++) {
    let lat = parseFloat(data.getString(i, "Latitude"));
    let lon = parseFloat(data.getString(i, "Longitude"));
    let elev = parseFloat(data.getString(i, "Elevation (m)"));

    if (isNaN(lat) || isNaN(lon)) continue;

    let x = map(lon, minLon, maxLon, margin, chartW - margin);
    let y = map(lat, minLat, maxLat, chartH - margin, margin);

    let t = map(elev, -6000, 7000, 0, 1);
    let col = lerpColor(color(254,78,117), color(57,145,300), constrain(t, 0, 1));

    fill(col);
    ellipse(x, y, 8);

    let d = dist(mouseX, mouseY, x, y);
    if (d < 6 && d < closestDist) {
      closestDist = d;
      closestRow = i;
      closestX = x;
      closestY = y;
    }
  }
//hover
  if (closestRow !== null) {
    fill(237,254,106);
    ellipse(closestX, closestY, 12);

    selectedVolcano = {
      name: data.getString(closestRow, "Volcano Name"),
      country: data.getString(closestRow, "Country"),
      typeCat: data.getString(closestRow, "TypeCategory"),
      type: data.getString(closestRow, "Type"),
      num: data.getString(closestRow, "Volcano Number"),
      status: data.getString(closestRow, "Status"),
      erup: data.getString(closestRow, "Last Known Eruption"),
      elev: data.getString(closestRow, "Elevation (m)"),
      lat: data.getString(closestRow, "Latitude"),
      lon: data.getString(closestRow, "Longitude")
    };
  }
}

// pannello laterale
function drawSidePanel() {
  let panelX = chartW + 40;
  let panelY = margin;
  let panelW = width - panelX - 30;
  let panelH = chartH - 105;

  // sfondo box
  fill(255);
  noStroke();
  rect(panelX, panelY, panelW, panelH, 15
  );

  // titolo box laterale
  fill(1);
  textSize(18);
  textAlign(LEFT);
  text("Volcano Data", panelX + 20, panelY + 30);

  // legenda altitudine
  drawLegend(panelX + 20, panelY + 60);

  // box info vulcano
  if (selectedVolcano) {
    fill(1);
    textSize(15);
    text("Name: " + selectedVolcano.name, panelX + 20, panelY + 220);
    text("Country: " + selectedVolcano.country, panelX + 20, panelY + 240);
    text("Type: " + selectedVolcano.type, panelX + 20, panelY + 260);
    text("Category: " + selectedVolcano.typeCat, panelX + 20, panelY + 280);
    text("Elevation: " + selectedVolcano.elev + " m", panelX + 20, panelY + 300);
    text("Lat: " + selectedVolcano.lat, panelX + 20, panelY + 320);
    text("Lon: " + selectedVolcano.lon, panelX + 20, panelY + 340);
    text("Status: " + selectedVolcano.status, panelX + 20, panelY + 360);
    text("Last Eruption: " + selectedVolcano.erup, panelX + 20, panelY + 380);
  } else {
    fill(1);
    textSize(15);
    text("Hover a volcano to view details", panelX + 20, panelY + 220);
  }
}

// legenda
function drawLegend(x, y) {
  fill(1);
  textSize(15);
  text("Elevation (m)", x, y - 10);

  let gradH = 120;
  for (let i = 0; i <= gradH; i++) {
    let inter = i / gradH;
    let c = lerpColor(color(10, 400, 500), color(1000, 0, 300), inter);
    stroke(c);
    line(x, y + i, x + 5, y + i);
  }

  noStroke();
  fill(1);
  textSize(16);
  text("+7000", x + 10, y + 13);
  text("-6000", x + 8, y + gradH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  chartW = width * 0.75;
  chartH = height * 0.9;
}