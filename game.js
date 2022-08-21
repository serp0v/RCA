console.log(window.navigator.userAgent); // узнать инфо о устройстве пользователя
//получим элемент со страницы///////////////////////////
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d",{ alpha: false });//вытащим из него холст для рисования
////фоновый канвас
var canvasTmp = document.createElement('canvas');
var ctxTmp = canvasTmp.getContext("2d",{ alpha: false });//вытащим из него холст для рисования
//Canvas на весь размер экрана
Resize();
window.addEventListener("resize", Resize);//при смене размера экрана
function Resize() {//меняем и размер элемента Canvas
	let w = window.innerWidth;
	let h = window.innerHeight;
	
	//ширина больше высоты
	if(window.innerWidth >= window.innerHeight){
		w = window.innerHeight * 16 / 9;
		if(window.innerWidth < w)
			w = window.innerWidth;
	}
	else{
		//высота больше ширины
		h = window.innerWidth * 9 / 16;
		if(window.innerHeight < h)
			h = window.innerHeight;
	} 

	canvasTmp.width = canvas.width = 	w;
	canvasTmp.height = canvas.height = 	h;
	window.screenScale = canvas.height / 1400;
	window.screenshiftY = 0;
}
///audioFon
var audioFon = new Audio();
audioFon.preload = 'auto';
audioFon.src = './sound/music1.mp3';
audioFon.isplay = false;
audioFon.addEventListener("canplaythrough",function(){
	audioFon.ready = true;
},false);
audioFon.addEventListener('ended', (event) => {
	audioFon.play();
  });

// start game 
const welcomePlayBtn = document.getElementById('welcomePlayBtn');
const metricscontrolspause = document.getElementById('metricscontrolspause');
const welcomeContainer = document.getElementById('welcomeContainer');
const finishGameWrapper = document.getElementById('finishGameWrapper');

// управление стрелками
const top = document.getElementById('top');
const bottom = document.getElementById('bottom');
const shoot = document.getElementById('shoot');
const health = document.getElementById('health');
const score = document.getElementById('score');
const pause = document.getElementById('pause');
const pauseMenu = document.getElementById('pauseMenu');

//переменные для игры //////////////////////////////////
const UPDATE_TIME = 1000 / 60;
var timer = null;
window.WHBeton = [100,100];//размер блока по умолчанию

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
	if(true && !audioFon.isplay){
		audioFon.isplay = true;
		audioFon.play();
	}
	Stop();
	timer = setInterval(Update, UPDATE_TIME);
	if (window.testGameMode)
	map = new Map(20, 10, textures);//карта
	else
	map = new Map(35, 10, textures);//карта
	hero = new Hero(health, 200 / window.screenScale, 400, "images/rubicAsep.png", textures);// гг
	isPause = false;
	//hide show form
	pause.classList.remove("off");
	canvas.classList.remove('off');
	finishGameWrapper.classList.add('off');
	welcomeContainer.classList.add('off');
	topContainer.classList.add('off');
}
///keyboard game event
document.addEventListener("keydown", function Move(e) {
	if (e.repeat)
	return;
	
	if(!finishGameWrapper.classList.contains("off")){
		if (e.key == ' ' || e.key == 'Escape')//Space		
			restartGame();
		if (e.key == 'Enter')//Enter		
			Form_Top_Show(finishGameWrapper);
		return;
	}

	if(!canvas.classList.contains("off")){
		if (e.key == 'ArrowUp')  // up arrow
		hero.Jump();	
		else if (e.key == 'ArrowRight')  // right arrow
		hero.Right(map);	
		else if (e.key == 'ArrowLeft')  // left arrow
		hero.Left(map);	
		else if (e.key == 'ArrowDown')  // down arrow
		hero.antiJump();	
		else if (e.key == ' ')  //' ' - Space
		hero.Shot(map);	
		else if (e.key == 'Escape'){//Escape
		clickPause(),	
		pause.classList.toggle("off");///переключает
		}	
	}
	
	if(!topContainer.classList.contains("off")){
		if (e.key == 'Enter'||e.key == 'Escape'||e.key == ' ')	//' ' - Space		
			Form_Top_Exit();
		return;
	}
	
	if(!welcomeContainer.classList.contains("off")){
		if (e.key == 'Enter'||e.key == 'Escape'||e.key == ' ')	//' ' - Space	
			restartGame();
		return;
	}
});
requestAnimationFrame
top.onclick = function (event) {
	hero.Jump();	//shoot.innerHTML = 
}
// right.onclick = function(event){
// 	hero.Right();
// }
bottom.onclick = function (event) {
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
pause.onclick = () => clickPause();
function clickPause() {
	isPause = !isPause;
	if (isPause)
		pauseMenu.style.visibility = "visible";
		// pause.classList.toggle("off");
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
	//карта
	map.Life(hero);
	//живем героя
	hero.Life(map, score);	
	// restartGame(),
	if (hero.health < 0){
		Stop();
		pause.classList.add("off");
		finishGameWrapper.classList.remove('off');
		sendScoreToServer(hero);		
		startAnima();
	}
}
/////// AnimaScore /////////////////////////////////////////////
let audioScoreAnima = new Audio();
audioScoreAnima.preload = 'auto';
audioScoreAnima.src = './sound/animScore.mp3';
const finishScore = document.getElementById('finishScore');
let currAnimaScore = 0;
let timerAnima;
function startAnima(){
	audioScoreAnima.play();
	let timestep = 1000 / hero.score;	
	currAnimaScore = 0;
	timerAnima = setInterval(UpdateAnima, timestep);
}
function UpdateAnima(){
	finishScore.innerHTML = ++currAnimaScore;	
	if(currAnimaScore >= hero.score){
		clearInterval(timerAnima);
		timerAnima = null;
	}
}
///////////////////////////////////////////////////////////////
const restart = document.getElementById('restart');
const home = document.getElementById('home');
home.onclick = () => {
	welcomeContainer.classList.remove('off');
	canvas.classList.add('off');
	metricscontrolspause.classList.add('off');
}
restart.onclick = () => {	
	restartGame();
}

//рисование всех обьектов игры в временный context//////////////////////////////
function Draws() {
	//очистка экрана
	ctxTmp.clearRect(0, 0, canvas.width, canvas.height);

	//цвет фона
	ctxTmp.beginPath();
	ctxTmp.fillStyle = '#FFF';
	// ctx.fillStyle = '#20F';
	ctxTmp.fillRect(0, 0, canvas.width, canvas.height);

	//рисуем mapBack
	//mapBack.Draw(ctx, map);

	//рисуем карту
	map.Draw(ctxTmp);

	//рисуем гг
	hero.Draw(ctxTmp, map);
	//canvas.getContext('2d').drawImage(canvasTmp, 0, 0);
}
requestAnimationFrame(render);
function render() {
	//очистка экрана
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(canvasTmp, 0, 0);
	requestAnimationFrame(render);
}



welcomePlayBtn.onclick = () => {
	canvas.classList.remove('off');
	metricscontrolspause.classList.remove('off');
	welcomeContainer.classList.add('off');
	pauseMenu.style.visibility = 'hidden';
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
//getDataTop();
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
			let color = "#CfC";
			let colorNotSelect = "#0000";
			for (let index = 0; index < 10; index++) {
				topScore[index].textContent = topArray[index][2];
				topNick[index].textContent = topArray[index][5];
				//подкрасим в топе себя
				if (playerID == topArray[index][1]) {
					topScore[index].style.background = color;
					topNick[index].style.background = color;					
				}else{
					topScore[index].style.background = colorNotSelect;
					topNick[index].style.background = colorNotSelect;
				}
			}
			//Если нет нас в топе напишем ниже себя 
			let index = 10;//десятой строкой идем мы
			let playerPlaceID = topArray[index][4];
			if (playerPlaceID > 10) {
				playertopNumber.textContent = topArray[index][4];
				topScore[index].textContent = topArray[index][2];
				topNick[index].textContent = topArray[index][5];
				topScore[index].style.background = color;
				topNick[index].style.background = color;
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

	let playerID = localStorage.getItem('PlayerID', 0);
	// let playerID = null;//localStorage.getItem('PlayerID', 0);
	if (playerID == null) {
		playerID = new Date().getTime();
		localStorage.setItem('PlayerID', playerID);
	}
	return playerID;

	// localStorage.setItem('Time', output);
	//const output = String(date.getDate()).padStart(2, '0') + String(date.getMonth() + 1).padStart(2, '0') + date.getFullYear() + "|" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
	//localStorage.getItem('ID', output);
}
function sendScoreToServer(hero){
	//получение playerID из браузера
	let playerID = getPlayerID();
	//получение Топ с сервера
	let url = 'https://map3dpro.infobox.vip/score.php?pid=' + playerID +
	"&time=" + hero.getTime();
	fetch(url, {
		method: 'POST'//,
		//body: data,
	}).then(function (response) {
		response.text().then(function (topArray) {
		// response.json().then(function (topArray) {
			topArray==topArray;	
		});
	});
	//.then(console.log)
}

// вернуться в главное меню
const backToWelcome = document.getElementById('backToWelcome');
const backToGame = document.getElementById('backToGame');

backToWelcome.onclick = () => {
	welcomeContainer.classList.remove('off');
	canvas.classList.add('off');
	metricscontrolspause.classList.add('off');

}
backToGame.onclick = () => {
	pauseMenu.style.visibility ="hidden";
	isPause = !isPause;
	// Start();
	// welcomeContainer.classList.remove('off');
	// canvas.classList.add('off');
	// metricscontrolspause.classList.add('off');
	// console.log(123)
	// Update()
}

////открытие топа из 3 разных кнопки/////////////
const topbtn = document.getElementById('topbtn');
const pauseTopBtn = document.getElementById('pauseTopBtn');
const fgw_btn_openTop = document.getElementById('fgw_btn_openTop');

topbtn.onclick = () => Form_Top_Show(welcomeContainer);
pauseTopBtn.onclick = () => Form_Top_Show(pauseMenu);
fgw_btn_openTop.onclick = () => Form_Top_Show(finishGameWrapper);
function Form_Top_Show(parentForm) {
	getDataTop();//get data top from server
	parentForm.classList.add("off");
	canvas.classList.add("off");
	metricscontrolspause.classList.add("off");
	
	topContainer.classList.remove("off");	
	topContainer.parentForm = parentForm;
}
//закрываем топ
let closeTopMenu = document.getElementById('closeTopMenu');
closeTopMenu.onclick=()=>Form_Top_Exit();
function Form_Top_Exit() {
	topContainer.parentForm.classList.remove("off");

	///
	if(topContainer.parentForm != welcomeContainer){
		metricscontrolspause.classList.remove("off");
		canvas.classList.remove("off");
	}

	topContainer.classList.add("off");

}
////////////////////////////////////////////////////

// fullscreen

document.addEventListener('click', function (event) {

	// Игнорируем клики, которые не относятся к нашей кнопке
	if (!event.target.hasAttribute('data-fullscreen')) return;
  
	// Если уже в полном, выйти
	// Иначе, снова открыть полный экран
	if (document.fullscreenElement) {
	  document.exitFullscreen();
	} else {
	  document.documentElement.requestFullscreen();
	}
  
  }, false);
  
// window.addEventListener('load', () => { /* Страница загружена, включая все ресурсы */
// const preloader = document.querySelector('.preloader') /* находим блок Preloader */
// preloader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */
// })