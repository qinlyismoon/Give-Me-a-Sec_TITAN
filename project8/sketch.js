let video;
let detector;
let hands = [];
let boxes = [];
let labels = ["Information", "Disinformation"];
let pixelFont;
let palette = ["#CE7A51", "#EFE7D3", "#BEC8AF", "#7BA4AA"];

function preload() {
  pixelFont = loadFont("PixelFont.ttf");
}

async function setup() {
  await tf.setBackend('webgl'); // ✅ 显式设置 WebGL 后端
  await tf.ready();             // ✅ 确保 TensorFlow 初始化完成

  createCanvas(700, 600);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const config = {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
  };
  detector = await handPoseDetection.createDetector(model, config);

  initializeBoxes();
}

function draw() {
  background("#D1E7F2");

  let frameX = 30;
  let frameY = 20;
  let frameW = 640;
  let frameH = 480;

  noStroke();
  fill("#D1E7F2");
  rect(frameX - 3, frameY - 3, frameW + 6, frameH + 80, 12);

  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, width - frameX - frameW, frameY, frameW, frameH);
  pop();

  fill("#48AFEE");
  textFont(pixelFont);
  textSize(80);
  textAlign(CENTER, CENTER);
  text("TITAN", width / 2, frameY + frameH + 40);

  for (let box of boxes) {
    box.update();
    box.display();
  }

  detectAndHandleHands();

  // 显示识别点 4 和 8（食指 & 拇指）
  if (hands.length > 0) {
    const keypoints = hands[0].keypoints;

    if (keypoints[4] && keypoints[8]) {
      let tx = width - keypoints[4].x;
      let ty = keypoints[4].y;
      let fx = width - keypoints[8].x;
      let fy = keypoints[8].y;

      fill("#48AFEE");
      noStroke();
      ellipse(fx, fy, 20);
      ellipse(tx, ty, 20);
    }
  }
}

async function detectAndHandleHands() {
  if (!detector) return;

  const estimationConfig = { flipHorizontal: true };
  hands = await detector.estimateHands(video.elt, estimationConfig);

  console.log("Hands:", hands); // ✅ 调试输出

  if (hands.length > 0) {
    const keypoints = hands[0].keypoints;

    if (keypoints[4] && keypoints[8]) {
      let tx = width - keypoints[4].x;
      let ty = keypoints[4].y;
      let fx = width - keypoints[8].x;
      let fy = keypoints[8].y;

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
}

function initializeBoxes() {
  for (let i = 0; i < 60; i++) {
    let w = random(140, 200);
    let h = random(60, 100);
    let x = random(width - w);
    let y = random(height - h - 50);
    let label = random(labels);
    let col = color(random(palette));
    boxes.push(new DraggableBox(x, y, w, h, col, label));
  }
}

class DraggableBox {
  constructor(x, y, w, h, col, label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = col;
    this.label = label;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
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

  pressed() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    this.dragging = false;
  }
}

function mousePressed() {
  for (let box of boxes) {
    box.pressed();
  }
}

function mouseReleased() {
  for (let box of boxes) {
    box.released();
  }
}