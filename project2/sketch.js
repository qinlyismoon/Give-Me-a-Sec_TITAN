let particlesFront = [];
let particlesBack = [];

let res = 2.5;

let imgFront;  // Disinformation image
let imgBack;   // Titan logo image

function preload() {
  imgFront = loadImage("disinformation.png");
  imgBack = loadImage("TITAN.png");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");
  
  noStroke();
  placeParticles();
}

function draw() {
  background("#D1E7F2");

  // Backimage：Titan logo particle
  for (let p of particlesBack) {
    p.update();
    p.draw();
  }

  // Frontimage：Disinformation particle
  for (let p of particlesFront) {
    p.update();
    p.draw();
  }
}

function placeParticles() {
  for (let i = 0; i < width; i += res) {
    for (let j = 0; j < height; j += res) {
      let xRatio = i / width;
      let yRatio = j / height;

      // Frontimage-Disinformation
      let xF = int(xRatio * imgFront.width);
      let yF = int(yRatio * imgFront.height);
      let cF = imgFront.get(xF, yF);

      // Backimage-Titan
      let xB = int(xRatio * imgBack.width);
      let yB = int(yRatio * imgBack.height);
      let cB = imgBack.get(xB, yB);

      // 只处理非白色前景像素
      if (cF[0] + cF[1] + cF[2] < 255 * 3) {
        particlesFront.push(new Particle(i, j, cF));
      }

      // 只处理非白色背景像素
      if (cB[0] + cB[1] + cB[2] < 255 * 3) {
        particlesBack.push(new RevealParticle(i, j, cB));
      }
    }
  }
}

// 前层粒子类（可移动）
class Particle {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.c = c;

    this.homeX = x;
    this.homeY = y;
  }

  update() {
    let d = dist(this.x, this.y, mouseX, mouseY);
    let a = atan2(this.y - mouseY, this.x - mouseX);

    let dHome = dist(this.x, this.y, this.homeX, this.homeY);
    let aHome = atan2(this.homeY - this.y, this.homeX - this.x);

    let fMouse = constrain(map(d, 0, 100, 10, 0), 0, 10);
    let fHome = map(dHome, 0, 100, 0, 10);

    let vx = cos(a) * fMouse + cos(aHome) * fHome;
    let vy = sin(a) * fMouse + sin(aHome) * fHome;

    this.x += vx;
    this.y += vy;
  }

  draw() {
    fill(this.c);
    ellipse(this.x, this.y, res, res);
  }
}

// 后层粒子类（根据鼠标距离改变透明度）
class RevealParticle {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.alpha = 0;
  }

  update() {
    let d = dist(this.x, this.y, mouseX, mouseY);
    this.alpha = constrain(map(d, 0, 30, 255, 0), 0, 255);
  }

  draw() {
    fill(this.c[0], this.c[1], this.c[2], this.alpha);
    ellipse(this.x, this.y, res, res);
  }
}
