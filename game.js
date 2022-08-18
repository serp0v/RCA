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
const bottom = document.getElementById('bottom');
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

//startGame
var isPause = true;//
window.testGameMode = false;
function restartGame() {
	Stop();	
	timer = setInterval(Update, UPDATE_TIME);
	map = new Map(35, 10, textures);//карта
	hero = new Hero(health, 200 / window.screenScale, 400, "images/rubicAsep.png", textures);// гг
	isPause = false;
	document.addEventListener("keydown", function Move(e) {
		if(e.repeat)
			return;
		if (e.key == 'ArrowUp') { // up arrow
			hero.Jump();		
		}
		else if (e.key == 'ArrowRight') { // right arrow
			hero.Right(map);
		}
		else if (e.key == 'ArrowLeft') { // left arrow
			hero.Left(map);
			pauseMin = 100;
		}
		else if (e.key == 'ArrowDown') { // down arrow
			hero.antiJump();
		}
		else if (e.key == ' ') { // down arrow
			hero.Shot(map);
		}
	})
}

top.onclick = function(event){
	hero.Jump();	//shoot.innerHTML = 
}
// right.onclick = function(event){
// 	hero.Right();
// }
bottom.onclick = function(event){
	hero.antiJump();
}
// left.onclick = function(event){
// 	hero.Left();
// }

//выстрел
shoot.onclick = function (event) {
	hero.Shot(map);
}
// пауза
pauseMenu.style.visibility = "hidden";
pause.onclick = () => {
	isPause = !isPause;
	if (isPause)
		pauseMenu.style.visibility = "visible";
	else
		pauseMenu.style.visibility = "hidden";
}
/////////////////////////////////////////////////

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
var currentTime;
function Lifes() {
	//currentTime = new Date().getTime() + 30;
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
var pauseMin = 100;
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
	///start game
	restartGame();
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

// score
var topScore = [
	document.getElementById('top1Score'),
	document.getElementById('top2Score'),
	document.getElementById('top3Score'),
	document.getElementById('top4Score'),
	document.getElementById('top5Score'),
	document.getElementById('top6Score'),
	document.getElementById('top7Score'),
	document.getElementById('top8Score'),
	document.getElementById('top9Score'),
	document.getElementById('top10Score'),
	document.getElementById('playerTopScore'),
];
var topNick = [
	document.getElementById('playerTop1Nick'),
	document.getElementById('playerTop2Nick'),
	document.getElementById('playerTop3Nick'),
	document.getElementById('playerTop4Nick'),
	document.getElementById('playerTop5Nick'),
	document.getElementById('playerTop6Nick'),
	document.getElementById('playerTop7Nick'),
	document.getElementById('playerTop8Nick'),
	document.getElementById('playerTop9Nick'),
	document.getElementById('playerTop10Nick'),
	document.getElementById('playerNick'),
];
//получим данные
getDataTop();
function getDataTop() {
	//получение playerID из браузера
	let playerID = getPlayerID();
	//получение Топ с сервера
	let url = 'https://map3dpro.infobox.vip/score.php?pid=' + playerID;
	fetch(url, {
		method: 'POST'//,
		//body: data,
	}).then(function (response) {
		// response.text().then(function (topArray) {
		response.json().then(function (topArray) {

			let playertopNumber = document.getElementById('playertopNumber');
			//console.log(topArray);
			for (let index = 0; index < 10; index++) {
				topScore[index].textContent = topArray[index][2];
				topNick[index].textContent = "Игрок " + topArray[index][1];
				//подкрасим в топе себя
				if (playerID == topArray[index][1]) {
					topScore[index].style.background = "#00f";
					topNick[index].style.background = "#00f";					
				}
			}
			//Если нет нас в топе напишем ниже себя 
			let index = 10;//десятой строкой идем мы
			let playerPlaceID = topArray[index][4];
			if (playerPlaceID > 10) {
				playertopNumber.textContent = topArray[index][4];
				topScore[index].textContent = topArray[index][2];
				topNick[index].textContent = "Игрок " + topArray[index][1];
				topScore[index].style.background = "#00f";
				topNick[index].style.background = "#00f";
				playertopNumber.style.visibility = "visible";
				topScore[index].style.visibility = "visible";
				topNick[index].style.visibility = "visible";
			} else {
				playertopNumber.style.visibility = "hidden";
				topScore[index].style.visibility = "hidden";
				topNick[index].style.visibility = "hidden";
			}
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


