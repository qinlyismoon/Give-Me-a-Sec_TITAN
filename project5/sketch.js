let img;
let pixelFont;
let offset = 0;
let easing = 0.05;

let sequence = ['T', 'I', 'T', 'A', 'N'];
let currentIndex = 0;

function preload() {
  img = loadImage('TITAN_CODE.png');
  pixelFont = loadFont('PixelFont.ttf'); 
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");
  
  img.resize(600, 600);
  textFont(pixelFont);
  textAlign(CENTER, CENTER);
  textSize(24);
  fill(255);
}

function draw() {
  background(0);
  tint(255, 255);
  image(img, 0, 0); // base image

  let dx = mouseX - img.width / 2 - offset;
  offset += dx * easing;

  tint(255, 127);
  let w = img.width;
  let h = img.height;

  for (let i = 0; i < currentIndex; i++) {
    image(
      img,
      offset + (i * w) / 5, 0, w / 5, h, // source
      (i * w) / 5, 0, w / 5, h            // destination
    );
  }

  noStroke();
  fill("#1E3F66");
  text("Press TITAN to reveal the image", width / 2, height - 50);
}

function keyPressed() {
  let expectedKey = sequence[currentIndex];
  if (key.toUpperCase() === expectedKey && currentIndex < sequence.length) {
    currentIndex++;
  }
}
