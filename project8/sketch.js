let handposeModel;
let video;
let predictions = [];
let boxes = [];
let labels = ["Information", "Disinformation"];
let pixelFont;
let palette = ["#CE7A51", "#EFE7D3", "#BEC8AF", "#7BA4AA"];

function preload() {
  pixelFont = loadFont("PixelFont.ttf");
}

function setup() {
  createCanvas(700, 600);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // ✅ 使用 ml5 handpose 旧版模型
  handposeModel = ml5.handpose(video, () => {
    console.log("✅ Handpose model loaded!");
  });

  handposeModel.on("predict", results => {
    predictions = results;
  });

  initializeBoxes();
}

function draw() {
  background("#D1E7F2");

  let frameX = 30;
  let frameY = 20;
  let frameW = 640;
  let frameH = 480;

  // 蓝色边框背景
  noStroke();
  fill("#D1E7F2");
  rect(frameX - 3, frameY - 3, frameW + 6, frameH + 80, 12);

  // 镜像摄像头
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, width - frameX - frameW, frameY, frameW, frameH);
  pop();

  // TITAN
  fill("#48AFEE");
  textFont(pixelFont);
  textSize(80);
  textAlign(CENTER, CENTER);
  text("TITAN", width / 2, frameY + frameH + 40);

  // 显示拖动框
  for (let box of boxes) {
    box.update();
    box.display();
  }

  // 手势检测
  if (predictions.length > 0) {
    let hand = predictions[0];
    let finger = hand.annotations.indexFinger[3]; // index tip
    let thumb = hand.annotations.thumb[3];       // thumb tip

    // 镜像修正
    let fx = width - finger[0];
    let fy = finger[1];
    let tx = width - thumb[0];
    let ty = thumb[1];

    // 显示识别点
    fill("#48AFEE");
    noStroke();
    ellipse(fx, fy, 20);
    ellipse(tx, ty, 20);

    // 拖拽逻辑
    let pinchX = (fx + tx) / 2;
    let pinchY = (fy + ty) / 2;
    let pinchDist = dist(fx, fy, tx, ty);

    if (pinchDist < 40) {
      for (let box of boxes) {
        if (
          pinchX > box.x &&
          pinchX < box.x + box.w &&
          pinchY > box.y &&
          pinchY < box.y + box.h
        ) {
          box.dragging = true;
          box.x = pinchX - box.w / 2;
          box.y = pinchY - box.h / 2;
        }
      }
    } else {
      for (let box of boxes) {
        box.dragging = false;
      }
    }
  }
}

// 生成信息块
function initializeBoxes() {
  for (let i = 0; i < 50; i++) {
    let w = random(140, 200);
    let h = random(60, 100);
    let x = random(width - w);
    let y = random(height - h - 50);
    let label = random(labels);
    let col = color(random(palette));
    boxes.push(new DraggableBox(x, y, w, h, col, label));
  }
}

// 信息框类
class DraggableBox {
  constructor(x, y, w, h, col, label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.label = label;
    this.dragging = false;
  }

  display() {
    fill(this.col);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 12);

    textFont(pixelFont);
    textSize(this.label === "Information" ? 28 : 26);
    textAlign(CENTER, CENTER);
    fill("#333333");
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  update() {}
}