// WEBartisan - @WebArtisanPW
// Jesus Montes - @tonirilix

var angle = 0;
var lenVariation = 0.7;

function setup() {
  createCanvas(2000, 1200);
}

function draw() {
  background(40);
  angle = PI / 6;
  stroke(0, 255, 33);
  translate(1000, height);
  branch(300);
}

function branch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);

  lenVariation = random(0.5, 0.9);

  if(len > 1.5) {
    push();
      rotate(angle);
      branch(len * lenVariation);
    pop();
    push();
      rotate(-angle);
      branch(len * lenVariation);
    pop();
  }
}
