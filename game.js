console.log(window.navigator.userAgent); // узнать инфо о устройстве пользователя
//получим элемент со страницы///////////////////////////
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");//вытащим из него холст для рисования


//Canvas на весь размер экрана
Resize();
window.addEventListener("resize", Resize);//при смене размера экрана
function Resize() {//меняем и размер элемента Canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.screenScale = canvas.height / 1400;
	window.screenshiftY = 0;
}


// управление стрелками
const top = document.getElementById('top');
const right = document.getElementById('right');
const bottom = document.getElementById('bottom');
const left = document.getElementById('left');
const shoot = document.getElementById('shoot');
const health = document.getElementById('health');
const score = document.getElementById('score');
const pause = document.getElementById('pause');
const pauseMenu = document.getElementById('pauseMenu1');

//переменные для игры //////////////////////////////////
const UPDATE_TIME = 1000 / 60;
var timer = null;
window.widthBox = 100;

//import MapBack from './Class/MapBack.js';//class героя
import Textures from './Class/Textures.js';//для загрузки всех текстур 1 раз
import Map from './Class/Map.js';//class карты
import Hero from './Class/Hero.js';//class героя

// var mapBack = new MapBack();//создание заднего фона
var textures = new Textures();//для загрузки всех текстур 1 раз
var map;//карта
var hero;// гг

restartGame();
function restartGame() {
	map = new Map(30, 10, textures);//карта
	hero = new Hero(health, 200 / window.screenScale, 400, "images/rubicAsep.png", textures);// гг
}

//запускаем GamePlay
Start();

document.addEventListener("keydown", function Move(e) {
	if (e.keyCode == '38') { // up arrow
		hero.Jump();
		Pressed();
	}
	else if (e.keyCode == '39') { // right arrow
		hero.Right();
		Pressed();

	}
	else if (e.keyCode == '37') { // left arrow
		hero.Left();
		Pressed();
	}
	else if (e.keyCode == '40') { // down arrow
		hero.antiJump();
		Pressed();

	}
})
// top.onclick = function(event){
// 	hero.Jump();	//shoot.innerHTML = 
// }
// right.onclick = function(event){
// 	hero.Right();
// }
// bottom.onclick = function(event){
// 	hero.antiJump();
// }
// left.onclick = function(event){
// 	hero.Left();
// }

//выстрел
shoot.onclick = function (event) {
	hero.Shot(map);
}
function Pressed() {

}
// пауза
var isPause = false;//
pauseMenu.style.visibility = "hidden";
pause.onclick = () => {
	isPause = !isPause;
	if (isPause)
		pauseMenu.style.visibility = "visible";
	else
		pauseMenu.style.visibility = "hidden";
}
/////////////////////////////////////////////////
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
	if (isPause)
		return;
	Lifes();
	Draws();
}
//даем пожить каждому обьекту игры
function Lifes() {
	//mapBack
	//mapBack.Life();
	//карта
	map.Life(hero);
	//живем героя
	hero.Life(map, score);
	//рестарт игры
	if (hero.health < 0)
		restartGame();
}
//рисование всех обьектов игры
function Draws() {
	//очистка экрана
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//цвет фона
	ctx.beginPath();
	ctx.fillStyle = '#FFF';
	// ctx.fillStyle = '#20F';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//рисуем mapBack
	//mapBack.Draw(ctx, map);

	//рисуем карту
	map.Draw(ctx);

	//рисуем гг
	hero.Draw(ctx, map);
}

// start game 

const welcomePlayBtn = document.getElementById('welcomePlayBtn');
const metricscontrolspause = document.getElementById('metricscontrolspause');
const welcomeContainer = document.getElementById('welcomeContainer');

welcomePlayBtn.onclick = () => {
	canvas.classList.remove('off');
	metricscontrolspause.classList.remove('off');
	welcomeContainer.classList.add('off');
}

// customization

const customization = document.getElementById('customization');

customization.onclick = () => {
	welcomeContainer.classList.add('off');
}

// shop

const shop = document.getElementById('shop');

shop.onclick = () => {
	welcomeContainer.classList.add('off');
}

// top

const topContainer = document.getElementById('topContainer');
const topbtn = document.getElementById('topbtn');

//получим данные
getDataTop();
function getDataTop() {
	//получение Топ с сервера
	let playerID = getPlayerID();
	let url = 'https://map3dpro.infobox.vip/score.php?pid=' + playerID;
	fetch(url, {
		method: 'POST'//,
		//body: data,
	}).then(function (response) {
		response.text().then(function (text) {
			//poemDisplay.textContent = text;
			console.log(text);
		});
	});
	//.then(console.log)
}
// localstorage
function getPlayerID() {

	// localStorage.getItem('PlayerID', playerID);
	let playerID = localStorage.getItem('PlayerID', 0);
	if (playerID == null) {
		let date = new Date();
		playerID = date.getTime();
		localStorage.setItem('PlayerID', playerID);
	}
	return playerID;

	// localStorage.setItem('Time', output);
	//const output = String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0') + date.getFullYear() + "|" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
	//localStorage.getItem('ID', output);
}

topbtn.onclick = () => {
	topContainer.classList.remove('off');
	welcomeContainer.classList.add('off');

}

// top id

// nick

const playerTop1Nick = document.getElementById('playerTop1Nick');
const playerTop2Nick = document.getElementById('playerTop2Nick');
const playerTop3Nick = document.getElementById('playerTop3Nick');
const playerTop4Nick = document.getElementById('playerTop4Nick');
const playerTop5Nick = document.getElementById('playerTop5Nick');
const playerTop6Nick = document.getElementById('playerTop6Nick');
const playerTop7Nick = document.getElementById('playerTop7Nick');
const playerTop8Nick = document.getElementById('playerTop8Nick');
const playerTop9Nick = document.getElementById('playerTop9Nick');
const playerTop10Nick = document.getElementById('playerTop10Nick');
const playerNick = document.getElementById('playerNick');

// score

const top1Score = document.getElementById('top1Score');
const top2Score = document.getElementById('top2Score');
const top3Score = document.getElementById('top3Score');
const top4Score = document.getElementById('top4Score');
const top5Score = document.getElementById('top5Score');
const top6Score = document.getElementById('top6Score');
const top7Score = document.getElementById('top7Score');
const top8Score = document.getElementById('top8Score');
const top9Score = document.getElementById('top9Score');
const top10Score = document.getElementById('top10Score');
const playerTopScore = document.getElementById('playerTopScore');

// 

