var CANVAS_WIDTH = 850;
var CANVAS_HEIGHT = 200;
var CANVAS_TOP_OFFSET = 50;
var CANVAS_LEFT_OFFSET = 50;
var updates = 0;
var divArray = [];
var charSet = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var divSpawnRate = 60; // number of updates between spawns
var score = 0;
var gameOverProg = 0;
var gameOverIncrement = 10; // percent toward game over when div hits bottom
var updateInterval;
var drawScreenInterval;

// Gets a random character from the character set
function getRandomChar() {
	var c = charSet[Math.floor(Math.random() * charSet.length)];
	return c;
}

// Javascript "OOP" implementationzz
var DivBlock = function() {
	this.width = 30;
	this.height = 35;
	this.topOffset = 0;
	this.leftOffset = Math.floor(Math.random() * (CANVAS_WIDTH - this.width));
	this.speed = 1; // pixels per update
	this.content = getRandomChar();
};
DivBlock.prototype.draw = function () {
	$("#canvas").append("<div class='divBlock' style='left:"
	+ this.leftOffset + "px;top:" + this.topOffset + "px;'><span class='divContent'>"
	+ this.content + "</span></div>");
};

function clearCanvas() {
	$("#canvas").empty();
}

function clearScreen() {
	divArray = [];
	gameOverProg = 0;
}

function initCanvas() {
	$("#canvas").css({"width": CANVAS_WIDTH + "px", "height": CANVAS_HEIGHT + "px",
		"top": CANVAS_TOP_OFFSET + "px", "left": CANVAS_LEFT_OFFSET});
}

function initGameOverProgDiv() {
	$("#gameOverProgDiv").css({"top": CANVAS_TOP_OFFSET + CANVAS_HEIGHT + 20 + "px", 
		"left": CANVAS_LEFT_OFFSET + "px", "width": CANVAS_WIDTH + "px"});
}

function drawDivArray() {
	clearCanvas();
	for (i = 0; i < divArray.length; i++) {
		divArray[i].draw();
	}
}

function drawStats() {
	$("#updates").text("Updates: " + updates);
	$("#numDivs").text("# divs: " + divArray.length);
	$("#score").text("Score: " + score);
}

function drawGameOverProg() {
	$("#gameOverProg").css({"width": gameOverProg + "%"});
}

function drawScreen() {
	drawStats();
	drawDivArray();
	drawGameOverProg();
}

function gameOver() {
	$("#canvas").append("<div id='gameOverMessage'>Game Over</div>");
}

// test: updates needs to be changed to avoid memory overflow from high number
function updateGame() {
	/* If game over progress is at 100% or more then stop updating 
	  and drawing and call game over function */
	if (gameOverProg >= 100) {
		clearInterval(updateInterval);
		clearInterval(drawScreenInterval);
		gameOver();
	}
	
	// Update stats
	updates++;
	
	// Update divs
	for (i = 0; i < divArray.length; i++) {
		divArray[i].topOffset += divArray[i].speed;
		if ((divArray[i].topOffset + (divArray[i].height - 2)) > CANVAS_HEIGHT) {
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
		var div = new DivBlock();
		divArray.push(div);
	}
}

// This is called in $(document).ready
function startGame() {
	initCanvas();
	initGameOverProgDiv();
	
	// start intervals for calling update and draw functions
	updateInterval = setInterval(updateGame, (1000/60));  // (1000/60 = 60fps)
	drawScreenInterval = setInterval(drawScreen, (1000/60));
	
	// Get mouse X and Y coordinates within the canvas
	// This is pointless for now...
	$("#canvas").mousemove(function(event) {
		var parentOffset = $(this).offset();
		var relX = event.pageX - parentOffset.left;
		var relY = event.pageY - parentOffset.top;
		$("#coordinates").text("Mouse (x, y): (" + relX + ", " + relY + ")");
	});
}

// Load the game once the document is finished loading
$(document).ready(function() {
	startGame();
	
	// Test controls
	$(document).keydown(function(event) {
		//console.log("Handler for .keydown() called. " + event.keyCode); // test
		switch (event.keyCode) {
			case 17: // Ctrl
					divArray.push(new DivBlock());
					break;
			case 16: // Shift
					clearScreen();
					break;
		}
	});
	
	// Get keyup events and delete corresponding div in array if it exists
	$(document).keyup(function(event) {
		//console.log("Handler for .keyup() called. " + event.keyCode); // test
		for (i = 0; i < divArray.length; i++) {
			if (event.keyCode === divArray[i].content.charCodeAt(0)) {
				divArray.splice(i, 1);
				score++;
				/* break to prevent deletion of more than one element of array
				   in case of multiple same characters on canvas at once */
				break;  
			}
		}
	});
});
