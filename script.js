var CANVAS_WIDTH = 850;
var CANVAS_HEIGHT = 400;
var updates = 0;
var divArray = [];

var DivBlock = function() {
	this.width = 30;
	this.height = 35;
	this.topOffset = 0;
	this.leftOffset = Math.floor(Math.random() * (CANVAS_WIDTH - this.width));
	this.content = "C";
};
DivBlock.prototype.draw = function () {
	$("#canvas").append("<div class='divBlock' style='left:"
	+ this.leftOffset + "px;top:" + this.topOffset + "px;'><span class='divContent'>C</span></div>");
};

function clearCanvas() {
	$("#canvas").empty();
}

function clearDivArray() {
	divArray = [];
}

function initializeCanvas() {
	$("#canvas").width(CANVAS_WIDTH);
	$("#canvas").height(CANVAS_HEIGHT);
}

function drawDivArray() {
	clearCanvas();
	for (i = 0; i < divArray.length; i++) {
		divArray[i].topOffset += 1;
		divArray[i].draw();
		if ((divArray[i].topOffset + divArray[i].height) >= CANVAS_HEIGHT) {
			divArray.splice(i, 1);
			drawDivArray();
		}
	}
}

// test: updates needs to be changed to avoid memory overflow from high number
function updateGame() {
	$("#updates").text("Updates: " + updates);
	updates++;
	$("#numDivs").text("# divs: " + $(".divBlock").length);
	drawDivArray();
}

// This is called in $(document).ready
function startGame() {
	initializeCanvas();
	setInterval(updateGame, (1000/60));  // (1000/60 = 60fps)
	
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
	
	$(document).keydown(function(event) {
		console.log("Handler for .keydown() called. " + event.keyCode); // test
		switch (event.keyCode) {
			case 90: // z
					var divBlock = new DivBlock();
					divArray.push(divBlock);
					break;
			case 67: // c
					clearDivArray();
					break;
		}
	});
});
