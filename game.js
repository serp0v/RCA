//получим элемент со страницы///////////////////////////
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");//вытащим из него холст для рисования

//Canvas на весь размер экрана
Resize(); 
window.addEventListener("resize", Resize);//при смене размера экрана
function Resize() {//меняем и размер элемента Canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}


//таймер игры (запуск таймера ниже)//////////////////////////////////
const UPDATE_TIME = 1000 / 60;
var timer = null;
function Start() {	
	timer = setInterval(Update, UPDATE_TIME); 	
}

//для остановки игры 
function Stop() {
	clearInterval(timer); 
	timer = null;
}

//обновление и рисование всех обьектов
function Update() {	
	//даем пожить каждому обьекту игры
	Lifes();

	//рисование всех обьектов игры
	Draws();
}
//////////////////////////////////////////////////

//запускаем GamePlay
Start();