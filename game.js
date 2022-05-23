var DELAY = 40;
var SPEED = 5;
var MAX_DY = 12;

var OBSTACLE_WIDTH = 30;
var OBSTACLE_HEIGHT = 100;

var TERRAIN_WIDTH = 10;
var MIN_TERRAIN_HEIGHT = 20;
var MAX_TERRAIN_HEIGHT = 50;

var POINTS_PER_ROUND = 5;

var NUM_OBSTACLES = 3;

var copter;
var dy = 0;
var clicking = false;

var points = 0;
var score;	// text you see on the screen

var obstacles = [];
var top_terrain = [];
var bottom_terrain = [];

var homescreen = true;

var pause = false;

//When the code starts and all the functions are told to run 
function start() {
  background();
	delayInstructions();
  mouseClickMethod(startGame);

}

function background(){
  var background = new Rectangle(getWidth(), getHeight());
  background.setColor(Color.PURPLE);
  background.setPosition(0,0);
  add(background);
}

function addText(text){
  var arr = text.split(" ");
  var wordsPerLine = 7;
  for(var i = 0; i < arr.length; i += wordsPerLine) {
    var lineText = arr.slice(i, i + wordsPerLine).join(" ");
    var label = new Text(lineText, "14pt Arial");
    label.setPosition(
      getWidth()/2 - label.getWidth()/2, 
      (label.getHeight() + 10) * (i/wordsPerLine + 1)
    );
    //label.setColor(Color.WHITE);
    add(label);
  }
}

function delayInstructions(){
  
  addText("Hello there, welcome to math run! This is quite similar to flappy bird. You're a little cat flying past obstacles, if you crash into an obstacle you'll need to complete quick multiplication problems to progress. But it lasts forever, try to see how far you can get! Good luck!");
}

function startGame(){
  if(homescreen) {
    homescreen = false;
    removeAll();
    setup();
    setTimer(game, DELAY);
    mouseDownMethod(onMouseDown);
    mouseUpMethod(onMouseUp);
    var mySong = new Audio("https://codehs.com/uploads/9d093aa32394d33d6fe8525ade280465");
    mySong.play();
    mySong.loop = true;
  }
}

//A function that sets up the graphics and layout of the game
function setup() {
	setBackgroundColor(Color.black);
	copter = new WebImage("https://codehs.com/uploads/256486ac3416c6bbf66fcca7faf0c67d");
	copter.setSize(50, 50);
  copter.setPosition(getWidth()/3, getHeight()/2);
	add(copter);
	
	addObstacles();
	addTerrain();
	
	score = new Text("0");
	score.setColor(Color.white);
	score.setPosition(10, 30);
	add(score);
}

//The points start at 0 and add POINT_PER_ROUND each round. Then ther is text that displys the points
function updateScore() {
	points += POINTS_PER_ROUND;
	score.setText(points);
}

function game() {
  if(pause) {
    return;
  }
	updateScore();
	if (copter.getY() + copter.getHeight() > getHeight() - MAX_TERRAIN_HEIGHT) {
		dy = -1;
	}
	var collider = getCollider();
	if (collider != null) {
		if (collider != copter) {
			lose(collider);
			return;
		}
	}
	if (clicking) {
		dy -= 1;
		if (dy < -MAX_DY) {
			dy = -MAX_DY;
		}
	} else {
		dy += 1;
		if (dy > MAX_DY) {
			dy = MAX_DY;
		}
	}
  copter.move(0, dy);
	moveObstacles();
	moveTerrain();
}

function onMouseDown(e) {
  if(pause) {
    pause = false;
  }
	clicking = true;
}

function onMouseUp(e) {
	clicking = false;
}

function addObstacles() {
	for (var i = 0; i < NUM_OBSTACLES; i++) {
		var obstacle = new Rectangle(OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
		obstacle.setColor(Color.purple);
		var obstacleX = getWidth() + i * (getWidth()/NUM_OBSTACLES);
		var obstacleY = getHeight() - MAX_TERRAIN_HEIGHT - OBSTACLE_HEIGHT;
		obstacle.setPosition(obstacleX, obstacleY);
		obstacles.push(obstacle);
		add(obstacle);
	}
}

function moveObstacles() {
	for (var i=0; i < obstacles.length; i++) {
		var obstacle = obstacles[i];
		obstacle.move(-SPEED, 0);
		if(obstacle.getX() < 0) {
			obstacle.setPosition(getWidth(),
							Randomizer.nextInt(0, getHeight() - OBSTACLE_HEIGHT));
		}
	}
}

function getSafePosition(collider) {
  var top = collider.getY();
  var bottom = collider.getY() + collider.getHeight();

  var minY = MAX_TERRAIN_HEIGHT;
  var maxY = getHeight() - MAX_TERRAIN_HEIGHT;

  var topGapSize = top - minY;
  var bottomGapSize = maxY - bottom;
  if(topGapSize > bottomGapSize) {
    return minY + topGapSize / 2;
  } else {
    return maxY - bottomGapSize / 2;
  }
}

//If you hit an object the game stops. Then it sees if the users got the math question correct. 
function lose(collider) {
	stopTimer(game);
  clicking = false;
  pause = true;
  var correct = division();
  if(!correct) {
    //This text is displayed if the user gets the math problem wrong.
  	var text = new Text("You Lose!");
  	text.setColor(Color.red);
    text.setPosition(getWidth()/2 - text.getWidth()/2,
  					 getHeight()/2);
  	add(text);
    var textTwo = new Text("Click anywhere to try again!" );
    textTwo.setColor(Color.red);
    textTwo.setPosition(getWidth()/2 - textTwo.getWidth()/2,
  					 getHeight()/2 + text.getHeight());
    add(textTwo);
    homescreen = true;
  } else {
    //If the user gets the math problem correct the character continues with the current progress somewhere in the screen that is not blocked by an obsticle. 
    //pasue == true;
    //mouseClickedMethod(puasue==false);
    copter.setPosition(copter.getX(), getSafePosition(collider));
    setTimer(game, DELAY);
    dy = 0;
  }
}


function getCollider() {
	var topLeft = getElementAt(copter.getX()-1, copter.getY()-1);
	if (topLeft != null) {
		return topLeft;
	}
	
	var topRight = getElementAt(copter.getX() + copter.getWidth() + 1,
								copter.getY() - 1);
	if (topRight != null) {
		return topRight;
	}
	
	return null;
}


function addTerrain() {
	for (var i=0; i <= getWidth() / TERRAIN_WIDTH; i++) {
		var height = Randomizer.nextInt(MIN_TERRAIN_HEIGHT, MAX_TERRAIN_HEIGHT);
		var terrain = new Rectangle(TERRAIN_WIDTH, height);
		terrain.setPosition(TERRAIN_WIDTH * i, 0);
		terrain.setColor(Color.purple);
		top_terrain.push(terrain);
		add(terrain);
		
		height = MAX_TERRAIN_HEIGHT;
		var bottomTerrain = new Rectangle(TERRAIN_WIDTH, height);
		bottomTerrain.setPosition(TERRAIN_WIDTH * i, 
								  getHeight() - bottomTerrain.getHeight());
		bottomTerrain.setColor(Color.purple);
		bottom_terrain.push(bottomTerrain);
		add(bottomTerrain);
	}
}


function moveTerrain() {
	for (var i=0; i < top_terrain.length; i++) {
		var obj = top_terrain[i];
		obj.move(-SPEED, 0);
		if (obj.getX() < -obj.getWidth()) {
			obj.setPosition(getWidth(), 0);
		}
	}
	
	for (var i=0; i < bottom_terrain.length; i++) {
		var obj = bottom_terrain[i];
		obj.move(-SPEED, 0);
		if (obj.getX() < -obj.getWidth()) {
			obj.setPosition(getWidth(), getHeight() - obj.getHeight());
		}
	}
}
