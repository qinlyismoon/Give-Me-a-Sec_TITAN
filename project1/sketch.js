let slider;
let font;
let words = [];
let totalWords = 8; // The number of lines is appropriate.
let fontSize = 48;
let baseX = 550; // Control the overall right alignment

function preload() {
  font = loadFont("PixelFont.ttf"); 
}

function setup() {
  createCanvas(600, 600);
  cnv.parent("canvas-container");
  
  textFont(font);
  textAlign(RIGHT, CENTER);
  textSize(fontSize);
  noStroke();

  // slider
  slider = createSlider(0, 100, 0); // Initially set to 0, meaning only "information" will be displayed.
  slider.position("slider-holder");
  slider.style("width", "580px");
  slider.style("direction", "rtl");

  let spacing = fontSize + 10;
  let startY = 100;
  for (let i = 0; i < totalWords; i++) {
    let isDisinfo = random() < 0.4;
    let y = startY + i * spacing;
    words.push({ isDisinfo, x: baseX, y });
  }
}

function draw() {
  background("#48AFEE");

  let sliderVal = slider.value(); // 0 ~ 100
  let disMaxWidth = textWidth("dis");
  let visibleW = map(sliderVal, 0, 100, 0, disMaxWidth); // Reveal width for "dis"

  // Determine the position of the line: It should be at the boundary between "dis" and "information"
  let infoW = textWidth("information");
  let lineX = baseX - infoW; // The right boundary of -dis
  let revealX = lineX - disMaxWidth + visibleW;

  // Reveal Boundary Line
  stroke(255);
  strokeWeight(2);
  line(revealX, 0, revealX, height);
  noStroke();

  for (let word of words) {
    let { isDisinfo, x, y } = word;

    // Always display "information"
    fill("white");
    text("information", x, y);

    if (isDisinfo && visibleW > 0) {
      let disStartX = x - textWidth("information") - disMaxWidth;

      fill("yellow");
      push();
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(disStartX, y - fontSize / 2, visibleW, fontSize);
      drawingContext.clip();
      text("dis", x - textWidth("information"), y); // "dis" and "info" are aligned to the right.
      drawingContext.restore();
      pop();
    }
  }
}
