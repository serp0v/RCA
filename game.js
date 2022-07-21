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
import Hero from './Class/Hero.js';//class героя
const UPDATE_TIME = 1000 / 60;
var timer = null;
window.widthBox = 100;

//запускаем GamePlay
Start();

//главный игровой таймер
var map = new Map(15, 10);
var hero = new Hero(300, 300, "images/rubicAsep.png");
window.onclick = function(event){
	hero.Jump();
}
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
	Lifes();
	Draws();
}
//даем пожить каждому обьекту игры
function Lifes() {
	//карта
	map.Life(this);
	//живем героя
	hero.Life(map);
}
//рисование всех обьектов игры
function Draws() {
	//очистка экрана
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//цвет фона
	ctx.beginPath();
	ctx.fillStyle = '#20F';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//рисуем карту
	map.Draw(ctx);

	//рисуем гг
	hero.Draw(ctx);
}
