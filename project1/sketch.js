let slider;
let font;
let words = [];
let totalWords = 8; // 控制行数
let fontSize = 48;
let baseX = 550; // 控制右对齐的边界

function preload() {
  font = loadFont("PixelFont.ttf"); // 确保字体文件在正确路径
}

function setup() {
  // 创建 canvas 并插入指定 div
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");

  textFont(font);
  textAlign(RIGHT, CENTER);
  textSize(fontSize);
  noStroke();

  // 创建 slider 并插入指定 div
  slider = createSlider(0, 100, 0); // 初始值设为 0
  slider.parent("slider-holder");
  slider.style("width", "580px");
  slider.style("direction", "rtl");

  let spacing = fontSize + 10;
  let startY = 100;

  for (let i = 0; i < totalWords; i++) {
    let isDisinfo = random() < 0.4; // 40% 显示 dis
    let y = startY + i * spacing;
    words.push({ isDisinfo, x: baseX, y });
  }
}

function draw() {
  background("#D1E7F2");

  let sliderVal = slider.value(); // 获取滑块值
  let disMaxWidth = textWidth("dis");
  let visibleW = map(sliderVal, 0, 100, 0, disMaxWidth); // reveal 宽度

  let infoW = textWidth("information");
  let lineX = baseX - infoW;
  let revealX = lineX - disMaxWidth + visibleW;

  // reveal 边界线
  stroke(255);
  strokeWeight(2);
  line(revealX, 0, revealX, height);
  noStroke();

  for (let word of words) {
    let { isDisinfo, x, y } = word;

    // 始终显示 information
    fill("white");
    text("information", x, y);

    // 条件显示 dis 前缀
    if (isDisinfo && visibleW > 0) {
      let disStartX = x - textWidth("information") - disMaxWidth;

      fill("#832011");
      push();
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(disStartX, y - fontSize / 2, visibleW, fontSize);
      drawingContext.clip();
      text("dis", x - textWidth("information"), y);
      drawingContext.restore();
      pop();
    }
  }
}
