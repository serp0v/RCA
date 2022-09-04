console.log(window.navigator.userAgent); // узнать инфо о устройстве пользователя
window.mobileAndTabletCheck = function () {
	let check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};
//получим элемент со страницы///////////////////////////
const metrics = document.getElementById('metrics');
const movementHint = document.getElementById('movementHint');
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", { alpha: false });//вытащим из него холст для рисования
////фоновый канвас
var canvasTmp = document.createElement('canvas');
var ctxTmp = canvasTmp.getContext("2d", { alpha: false });//вытащим из него холст для рисования
//Canvas на весь размер экрана
Resize();
window.addEventListener("resize", Resize);//при смене размера экрана
function Resize() {//меняем и размер элемента Canvas
	let w = window.innerWidth;
	let h = window.innerHeight;
	// metrics.style.width = canvas.offsetWidth + 'px';


	//ширина больше высоты
	if (window.innerWidth >= window.innerHeight) {
		w = window.innerHeight * 16 / 9;
		if (window.innerWidth < w)
			w = window.innerWidth;
	}
	else {
		//высота больше ширины
		h = window.innerWidth * 9 / 16;
		if (window.innerHeight < h)
			h = window.innerHeight;
	}

	canvasTmp.width = canvas.width = w;
	canvasTmp.height = canvas.height = h;
	window.screenScale = canvas.height / 1400;
	window.screenshiftY = 0;
	window.startHeroX = Math.round(canvasTmp.width / 3.5) / window.screenScale;

	// metrics.style.width = canvas.offsetWidth + 'px';
	new ResizeObserver(() => metrics.style.width = canvas.offsetWidth + 'px').observe(canvas);
	new ResizeObserver(() => movementHint.style.width = canvas.offsetWidth + 'px').observe(canvas);
}
///music Web Audio API
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioSource;
getDataMusic();
function getDataMusic() {
	audioSource = audioCtx.createBufferSource();
	audioSource.isplay = false;
	var request = new XMLHttpRequest();  
	request.open('GET', './sound/music1.mp3', true);  
	request.responseType = 'arraybuffer';
	request.onload = function() {
	  var audioData = request.response;  
	  audioCtx.decodeAudioData(audioData, function(buffer) {
		  audioSource.buffer = buffer;  
		  audioSource.connect(audioCtx.destination);
		  audioSource.loop = true;
		},  
		function(e){
			"Error with decoding audio data" + e.err
		});  
	}  
	request.send();
  }
// btn_musicOn
const btn_musicOn = document.getElementById('btn_musicOn');
btn_musicOn.isOn = true;
btn_musicOn.src = "./images/music.png";
btn_musicOn.addEventListener('click', () => {
	btn_musicOn.isOn = !btn_musicOn.isOn;
	clickPauseSet(!btn_musicOn.isOn);
	if (btn_musicOn.isOn)
		btn_musicOn.src = "./images/music.png";
	else
		btn_musicOn.src = "./images/musicOff.png";
}, false);
//пауза при потере фокуса
window.onblur = function () {
	clickPauseSet(true);
};
function startMusic() {
	if (!audioSource.isplay && btn_musicOn.isOn) {
		getDataMusic(); //тут ставится audioSource.isplay = false;
		audioSource.start(0);			
		audioSource.isplay = true;
	}
}
function stopMusic() {
	audioSource.stop(0);
	audioSource.isplay = false;
}

// start game 
const welcomePlayBtn = document.getElementById('welcomePlayBtn');
const metricscontrolspause = document.getElementById('metricscontrolspause');
const welcomeContainer = document.getElementById('welcomeContainer');
const finishGameWrapper = document.getElementById('finishGameWrapper');
// управление стрелками
const top = document.getElementById('top');
const bottom = document.getElementById('bottom');
const div_speed_up = document.getElementById('div_speed_up');
const div_speed_down = document.getElementById('div_speed_down');
const shoot = document.getElementById('shoot');
const health = document.getElementById('health');
const score = document.getElementById('score');
const pause = document.getElementById('pause');
const pauseMenu = document.getElementById('pauseMenu');

//переменные для игры //////////////////////////////////
const div_speed = document.getElementById('div_speed');
const div_x2 = document.getElementById('div_x2');
const UPDATE_TIME = 1000 / 60;
var timer = null;
window.WHBeton = [100, 100];//размер блока по умолчанию

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
	let isMobile = window.mobileAndTabletCheck();
	if (!isMobile)
		movementHint.style.opacity = "0";


	startMusic();
	Stop();
	timer = setInterval(Update, UPDATE_TIME);
	if (window.testGameMode)
		map = new Map(20, 10, textures);//карта
	else
		map = new Map(35, 10, textures);//карта

	hero = new Hero(health, window.startHeroX /* / window.screenScale */, 400, textures);// гг
	hero.editHealth(0);

	isPause = false;
	//hide show form
	pause.classList.remove("off");
	canvas.classList.remove('off');
	finishGameWrapper.classList.add('off');
	welcomeContainer.classList.add('off');
	topContainer.classList.add('off');
	div_x2.classList.add("off");
}

///keyboard game event
document.addEventListener("keydown", function Move(e) {
	if (e.repeat)
		return;

	if (!finishGameWrapper.classList.contains("off")) {
		if (e.key == ' ' || e.key == 'Escape')//Space		
			restartGame();
		if (e.key == 'Enter')//Enter		
			Form_Top_Show(finishGameWrapper);
		return;
	}

	if (!canvas.classList.contains("off")) {
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
		else if (e.key == 'Escape') {//Escape
			clickPause();
			pause.classList.toggle("off");///переключает
		}
	}

	if (!topContainer.classList.contains("off")) {
		if (e.key == 'Enter' || e.key == 'Escape' || e.key == ' ')	//' ' - Space		
			Form_Top_Exit();
		return;
	}

	if (!welcomeContainer.classList.contains("off")) {
		if (e.key == 'Enter' || e.key == 'Escape' || e.key == ' ')	//' ' - Space	
			restartGame();
		return;
	}
});
requestAnimationFrame
top.onclick = function (event) {
	hero.Jump();	//shoot.innerHTML = 
}
bottom.onclick = function (event) {
	hero.antiJump();
}
div_speed_up.onclick = function (event) {
	hero.Right(map);
}
div_speed_down.onclick = function (event) {
	hero.Left(map);
}


//выстрел
shoot.onclick = function (event) {
	hero.Shot(map);
}
// пауза
pauseMenu.style.visibility = "hidden";
pause.onclick = () => clickPause();
function clickPauseSet(p) {
	isPause = !p;
	clickPause();
}
function clickPause() {
	isPause = !isPause;
	if (isPause) {
		pauseMenu.style.visibility = "visible";
		stopMusic();
	}
	else {
		startMusic();
		pauseMenu.style.visibility = "hidden";
	}
}
/////////////////////////////////////////////////
//для остановки игры 
function Stop() {
	clearInterval(timer);
	timer = null;
}
//обновление и рисование всех обьектов
function Update() {
	//во время паузы только пререрисовываются
	if (isPause) {
		//fix black render
		Draws();
		return;
	}
	Lifes();
	Draws();
}
//даем пожить каждому обьекту игры
var currentTime;
function Lifes() {
	//карта
	map.Life(hero);
	div_speed.innerText = map.speedMap;

	//живем героя
	hero.Life(map, div_x2);

	//герой die
	if (hero.health < 0) {
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
function startAnima() {
	audioScoreAnima.play();
	let timestep = 1000 / hero.score;
	currAnimaScore = 0;
	timerAnima = setInterval(UpdateAnima, timestep);
}
function UpdateAnima() {
	finishScore.innerHTML = ++currAnimaScore;
	if (currAnimaScore >= hero.score) {
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
// const customization = document.getElementById('customization');
// shop
// const shop = document.getElementById('shop');


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
const toploader = document.getElementById('toploader');
function getDataTop() {
	//show toploader
	toploader.classList.remove('preloader_hidden')
	//получение playerID из браузера
	let playerID = getPlayerID();
	//получение Топ с сервера
	let url = 'https://map3dpro.infobox.vip/score.php?pid=' + playerID;
	fetch(url, {
		method: 'POST'//,
		//body: data,
	}).catch((e) => {
		console.log('Error: ' + e.message);
		alert("Ошибка доступа к серверу PlayerTop. \nПроверте наличие интернета.");
		//hide toploader
		toploader.classList.add('preloader_hidden')
	}).then(function (response) {

		//ошибка доступа к серверу
		if (response == undefined)
			return;

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
				} else {
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

			//hide toploader
			toploader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */

		});
	});
	//.then(console.log)
}
// localstorage
function getPlayerID() {
	let playerID = localStorage.getItem('PlayerID', 0);
	if (playerID == null) {
		playerID = new Date().getTime();
		localStorage.setItem('PlayerID', playerID);
	}
	return playerID;
}
function sendScoreToServer(hero) {
	//получение playerID из браузера
	let playerID = getPlayerID();
	//получение Топ с сервера
	let url = 'https://map3dpro.infobox.vip/score.php?pid=' + playerID +
		"&time=" + hero.getTime();
	fetch(url, {
		method: 'POST'
	}).then(function (response) {
		response.text().then(function (topArray) {
			//ответ сервера
			console.log(topArray);
		});
	});
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
	pauseMenu.style.visibility = "hidden";
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
closeTopMenu.onclick = () => Form_Top_Exit();
function Form_Top_Exit() {
	topContainer.parentForm.classList.remove("off");

	///
	if (topContainer.parentForm != welcomeContainer) {
		metricscontrolspause.classList.remove("off");
		canvas.classList.remove("off");
	}

	topContainer.classList.add("off");

}
////////////////////////////////////////////////////

// fullscreen

// document.addEventListener('onclick', function (event) {

// 	// Игнорируем клики, которые не относятся к нашей кнопке
// 	if (!event.target.hasAttribute('data-fullscreen')) return;

// 	// Если уже в полном, выйти
// 	// Иначе, снова открыть полный экран
// 	if (document.fullscreenElement) {
// 		document.exitFullscreen();
// 	} else {
// 		document.documentElement.requestFullscreen();
// 	}

// }, false);

// window.addEventListener('load', () => { /* Страница загружена, включая все ресурсы */
// const preloader = document.querySelector('.preloader') /* находим блок Preloader */
// preloader.classList.add('preloader_hidden') /* добавляем ему класс для скрытия */
// })