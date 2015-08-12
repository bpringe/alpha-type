var CANVAS_WIDTH = 1200;
var CANVAS_HEIGHT = 760;
var timer = 0;

function initializeCanvas() {
	$("#canvas").width(CANVAS_WIDTH);
	$("#canvas").height(CANVAS_HEIGHT);
}

// test: timer needs to be changed to avoid memory overflow from high number
function updateTimer() {
	$("#time").text(timer);
	timer++;
	if (timer > 50000) {
		timer = 0;
	}
}

// This is called in $(document).ready
function startGame() {
	initializeCanvas();
	setInterval(updateTimer, (1000/60));  // (1000/60 = 60fps)
	$("#canvas").mousemove(function(event) {
		var parentOffset = $(this).offset();
		var relX = event.pageX - parentOffset.left;
		var relY = event.pageY - parentOffset.top;
		$("#coordinates").text("(" + relX + ", " + relY + ")");
	});
}

function clearCanvas() {
	$("#canvas").empty();
}

function spawnDiv() {
	$("#canvas").append("<div>Another div</div>");
}

// Load the game once the document is finished loading
$(document).ready(function() {
	startGame();
	$(document).keydown(function(event) {
		console.log("Handler for .keydown() called. " + event.keyCode); // test
		// to-do: add switch statement for keyCodes
		if (event.keyCode === 90) {
			spawnDiv();
		}
		if (event.keyCode === 67) {
			clearCanvas();
		}
	});
});
