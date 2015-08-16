var CANVAS_WIDTH = 850;
var CANVAS_HEIGHT = 400;
var CANVAS_TOP_OFFSET = 150;
var CANVAS_LEFT_OFFSET = 50;
var updates = 0;
var divArray = [];
var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var divSpawnRate = 60; // number of updates between spawns
var score = 0;
var gameOverProg = 0;
var gameOverIncrement = 10; // percent toward game over when div hits bottom
var updateInterval;
var drawScreenInterval;
var gameRunning = false;

// Javascript "OOP" implementationzz
var Div = function() {
	this.width = 30;
	this.height = 35;
	this.topOffset = 0;
	this.leftOffset = Math.floor(Math.random() * (CANVAS_WIDTH - this.width));
	this.speed = 1; // pixels per update
	this.content = charSet[Math.floor(Math.random() * charSet.length)]; // random char
};
Div.prototype.draw = function () {
	$("#canvas").append("<div class='divBlock' style='left:"
	+ this.leftOffset + "px;top:" + this.topOffset + "px;'><span class='divContent'>"
	+ this.content + "</span></div>");
};

function drawGameOverProg() {
	$("#gameOverProg").css({"width": gameOverProg + "%"});
}

function clearCanvas() {
	$("#canvas").empty();
}

function drawDivArray() {
	clearCanvas();
	for (i = 0; i < divArray.length; i++) {
		divArray[i].draw();
	}
}

function drawStats() {
	$("#score").text("Score: " + score);
}

function drawScreen() {
	drawStats();
	drawDivArray();
	drawGameOverProg();
}

function gameOver() {
	gameRunning = false;
	clearInterval(updateInterval);
	clearInterval(drawScreenInterval);
	$("#canvas").append("<div id='gameOverMessage' style='display: none'>Game Over</div>");
	$("#canvas").animate({backgroundColor: "black"}, 1000);
	$("#gameOverMessage").delay(1000).fadeIn(2000);
	$("#startMessage").delay(2000).fadeIn(2000);
}

function updateGame() {
	if (gameOverProg >= 100) {
		gameOver();
	}
	
	// Keep track of number of updates
	updates++;
	
	// Update divs
	for (i = 0; i < divArray.length; i++) {
		divArray[i].topOffset += divArray[i].speed;
		if ((divArray[i].topOffset + (divArray[i].height - 2)) > CANVAS_HEIGHT) {
			//$("#canvas").css({"background-color": "black"}).animate({"background-color": "white"});
			
			/* When array element is deleted the next element is skipped when updating since
				indexes change. The below forces the update of the next element before deleting
				the current element.
			*/
			divArray[i + 1].topOffset += divArray[i + 1].speed;
			divArray.splice(i, 1);
			gameOverProg += gameOverIncrement;	
		}
	}
	
	// Spawn new divs
	if ((updates % divSpawnRate) === 0) {
		var div = new Div();
		divArray.push(div);
	}
}

function initGame() {
	// Show title header
	$("#titleHeader").css({"left": CANVAS_LEFT_OFFSET + (CANVAS_WIDTH / 2)
		- ($("#titleHeader").width() / 2) + "px",});
	console.log($("#titleHeader").width());
	
	// Initialize canvas
	$("#canvas").css({"width": CANVAS_WIDTH + "px", "height": CANVAS_HEIGHT + "px",
		"top": CANVAS_TOP_OFFSET + "px", "left": CANVAS_LEFT_OFFSET, "background-color": "white"});
	
	// Initialize game over progress bar
	$("#gameOverProgDiv").css({"top": CANVAS_TOP_OFFSET + CANVAS_HEIGHT + 20 + "px", 
		"left": CANVAS_LEFT_OFFSET + "px", "width": CANVAS_WIDTH + "px"});
	
	// Initialize score
	$("#score").css({"left": CANVAS_LEFT_OFFSET + "px", "top": 
		CANVAS_TOP_OFFSET - $("#score").height() - 40 + "px"});
	
	// Show start message
	$("#startMessage").css({"left": CANVAS_LEFT_OFFSET + $("#score").width() + 50 + "px",
		"top": CANVAS_TOP_OFFSET - $("#score").height() - 40 + "px", 
		"background-color": "#32BA36"});
}

function startGame() {
	gameRunning = true;
	
	$("#startMessage").fadeOut();
	
	// initialize variables
	divSpawnRate = 60; // number of updates between spawns
  score = 0;
	gameOverProg = 0;
	updates = 0;
	divArray = [];
	$("#canvas").css({"background-color": "white"});
	
	// Add first div
	divArray.push(new Div());
	
	// start intervals for calling update and draw functions
	updateInterval = setInterval(updateGame, (1000/60));  // (1000/60 = 60fps)
	drawScreenInterval = setInterval(drawScreen, (1000/60));
}

// Load the game once the document is finished loading
$(document).ready(function() {
	initGame();
	
	// Test controls
	$(document).keydown(function(event) {
		//console.log("Handler for .keydown() called. " + event.keyCode); // test
		switch (event.keyCode) {
			case 17: // Ctrl
					divArray.push(new Div());
					break;
		}
	});
	
	// Get keyup events and delete corresponding div in array if it exists
	$(document).keyup(function(event) {
		if (event.keyCode === 16) {
			if (!gameRunning) {
				startGame();
			}
		}
		//console.log("Handler for .keyup() called. " + event.keyCode); // test
		for (i = 0; i < divArray.length; i++) {
			if (event.keyCode === divArray[i].content.charCodeAt(0)) {
				divArray.splice(i, 1);
				score++;
				if (score % 10 === 0) {
					divSpawnRate -= 2; // number of updates between spawns
				}
				/* break to prevent deletion of more than one element of array
				   in case of multiple same characters on canvas at once */
				break;  
			}
		}
	});
});
