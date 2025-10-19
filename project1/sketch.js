let slider;
let font;
let words = [];
let totalWords = 8; // 控制行数
let fontSize = 48;
let baseX = 550; // 用于控制右对齐的边界

function preload() {
  font = loadFont("PixelFont.ttf"); // 请确保字体文件已正确上传到项目目录
}

function setup() {
  let cnv = createCanvas(600, 600);
  cnv.parent("canvas-container"); // 让画布嵌入 HTML 中的容器中

  textFont(font);
  textAlign(RIGHT, CENTER);
  textSize(fontSize);
  noStroke();

  // slider 设置
  slider = createSlider(0, 100, 0); // 初始值为0，只显示"information"
  slider.position(10, height + 30); // 向下错开
  slider.style("width", "580px");
  slider.style("direction", "rtl"); // 设置滑动方向从右向左

  // 生成 disinformation 行
  let spacing = fontSize + 10;
  let startY = 100;
  for (let i = 0; i < totalWords; i++) {
    let isDisinfo = random() < 0.4; // 40% 的概率带 dis
    let y = startY + i * spacing;
    words.push({ isDisinfo, x: baseX, y });
  }
}

function draw() {
  background("#48AFEE");

  let sliderVal = slider.value(); // 范围为 0~100
  let disMaxWidth = textWidth("dis");
  let visibleW = map(sliderVal, 0, 100, 0, disMaxWidth); // 显示 dis 的宽度

  // 计算分割线位置
  let infoW = textWidth("information");
  let lineX = baseX - infoW; // information 的起始点
  let revealX = lineX - disMaxWidth + visibleW;

  // 显示白线作为分界
  stroke(255);
  strokeWeight(2);
  line(revealX, 0, revealX, height);
  noStroke();

  for (let word of words) {
    let { isDisinfo, x, y } = word;

    // 始终显示 "information"
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
      text("dis", x - textWidth("information"), y); // 让 dis 和 information 对齐
      drawingContext.restore();
      pop();
    }
  }
}
