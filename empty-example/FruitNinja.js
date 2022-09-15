const GRAVITY = 0.2;

const BLADE_SIZE = 20; // number of strokes before fading
const BLADE_LENGTH = 150;  // maximum distance between points to connect two strokes

const BAD_FRUIT_PROBABILITY = 0.9; // chance of each fruit being bad

var sword;
var fruit = []; // on-screen fruit

var lives;
var score;

let img,img2,img3;
function preload() {
 img2=loadImage('restart.png');
  img = loadImage('bg.png');
  img3=loadImage('FatalBomb.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sword = new Blade(color("#FFF0EE"));
  frameRate(80);

  lives = 4;
  score = 0;
}

function draw() {
  background(img);

	handleMouse();
  score += handleFruit();//handle fruit 

  drawScore();
  drawLives();
}

/**
 * swings and draws the sword
 */
function handleMouse() {

	if (mouseIsPressed) { // swinging
		sword.swing(mouseX, mouseY);
	}

  if (frameCount % 2 === 0) { // update half the time

		sword.update();
	}

  sword.draw();
}

/**
 * pushes and updates fruit
 * returns number of points scored
 */
function handleFruit() {

	/* push new fruit */
  if (frameCount % 10 === 0) {

		if (noise(frameCount) > 0.66) {

			fruit.push(randomFruit());
		}
	}

	/* handle slicing fruit */
	var points = 0;
	for (var i = fruit.length - 1; i >= 0; i--) {

		fruit[i].update();
		fruit[i].draw();

		if (!fruit[i].visible) { // if the fruit is no longer on-screen

			if (!fruit[i].sliced && !fruit[i].bad) { // if we haven't sliced & it's not a bad

				lives--;
			}

			if (lives < 1) { // if it's game over

				endGame();
			}

			fruit.splice(i, 1); // delete invisible fruit from array
		} else {

			points += (sword.checkForSlice(fruit[i])) ? 1 : 0; // if we sliced the fruit, add to the points
		}

	}

	return points;
}

/**
 * draws lives in the top right
 */
function drawLives() {

  stroke(255);
  strokeWeight(3);
  fill("#FF0000");

  for (var i = lives; i > 0; i--) {

	  image(img3,windowWidth-(i*150)-80,50,200);
	}

}

/**
 * draws score in the top left
 */
function drawScore() {

  textAlign(LEFT);
  noStroke();
  fill(0);//color
  textSize(65);
  textStyle(BOLD);
  
  text("#Score:"+score, 10, 100);
}

/**
 * ends the loop, draws message
 */
function endGame() {

  noLoop();

  textAlign(CENTER);
  noStroke();
  fill("#FF0000");
  textSize(100);
  image(img2,width / 2.25, height /3.5);
 // text("Game over!", width / 2, height / 2);
  textSize(50);
  textStyle(BOLD);
  text(" # PRESS F5 TO RESTART! #", width / 2, height / 2 + 60);
}