var canvas = document.getElementById("canvas"); //Getting the canvas from DOM
var ctx = canvas.getContext("2d"); //Getting the context to work with the canvas

Resize(); //Changing the canvas size on startup
window.addEventListener("resize", Resize); //Change the canvas size with the window size

function Resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function Draw() //Working with graphics
{
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas    
}