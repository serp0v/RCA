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


//переменные для игры //////////////////////////////////
import Map from './Class/Map.js';//class карты
const UPDATE_TIME = 1000 / 60;
var timer = null;

//запускаем GamePlay
Start();

//главный игровой таймер
function Start() {
	var map = new Map(10,10); 
	timer = setInterval(Update, UPDATE_TIME);
}
//для остановки игры 
function Stop() {
	clearInterval(timer);
	timer = null;
}

//обновление и рисование всех обьектов
function Update() {
	Lifes();
	Draws();
}
//даем пожить каждому обьекту игры
function Lifes() {
}
//рисование всех обьектов игры
function Draws() {
}


//////////////////////////////////////////////////