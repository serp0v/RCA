window.NOTHING = 0;
window.BETON = 1;
window.KIRPICH = 2;
window.HEALTH = 3;
window.BULLET = 4;
window.X2 = 5;
import MapObj from './MapObj.js';//class для работы с обьектами карты
export default class {

  //координаты левого верхнего края карты
  xyShift = [0, 0];
  nexttestX = 0;//когда проверять  
  speedMap = 5;//10;
  speedBullet = 5;//10;
  textures; //хранилище текстур карты
  healthLastShift = 2;//для генерации здоровья
  healthDistancePeriod = 3000;//каждые 3 метра генерим здоровье
  x2LastShift = 10000;//для генерации x2
  x2DistancePeriod = 10000;//каждые 3 метра генерим x2
  speedMapUpNextShift = 1000;
  speedMapAutoMax = 10;
  
  //текущий план расстановки блоков
  floor3 = [0, 5, window.NOTHING];
  floor2 = [0, 2, window.BETON];
  floor1 = [0, 3, window.NOTHING];

  //при создании новой карты
  constructor(sizeX, sizeY, textures) {
    this.textures = textures;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    //генерация новой карты
    this.mapArray = this.getMapNew();
  }
  //Life
  roundShiftLast = 0;
  Life(hero) {
    //auto speedUp
    this.autoSpeedUp();
    //смещаем карту
    this.xyShift[0] += this.speedMap;
    //this.xyShift[1] = hero.xy[1];//следование за картой
    //для скорости проверяем координаты не каждый тик 
    if (this.isNeedtest()) {
      //удалим box слева которые вышли за карту      
      this.removeBackBox();
      //добавим новые справа
      let roundShift = Math.floor(this.xyShift[0] / window.WHBeton[0]);//иначе пробелы между блоками      
      //при скорости может быть пропущено место
      if (roundShift - this.roundShiftLast > 1) {
        //и требуется установка пропущеных блоков 
        this.putMapRight((roundShift - 1) * window.WHBeton[0] + this.sizeX * window.WHBeton[0], hero);
      }
      this.roundShiftLast = roundShift;
      this.putMapRight(roundShift * window.WHBeton[0] + this.sizeX * window.WHBeton[0], hero);
      
      //увеличение максимальной скорости
      if(this.xyShift[0] > 10000) 
        this.speedMapAutoMax += 1;
      else if(this.xyShift[0] > 20000) 
        this.speedMapAutoMax = 20;
    }
    //даем пожить каждому элементу
    this.mapArray.forEach(function (item, index, array) {
      //если отметка об удалении, то не используем
      if (!item.needRemove)
        item.Life();
    });
  }
  autoSpeedUp() {
    if (this.xyShift[0] < this.speedMapUpNextShift)
      return;
    if (this.speedMap > this.speedMapAutoMax)
      return;
    this.speedMapUpNextShift += 2000;//каждый метр повышаем скорость
    this.speedMap += 1;
  }

  //переодичность проверки элементов
  isNeedtest() {
    let need = this.nexttestX <= this.xyShift[0];
    if (need)
      this.nexttestX = this.xyShift[0] + window.WHBeton[0];
    return need;
  }

  //удалим все элементы карты которые вышли за границу
  removeBackBox() {
    let map = this;
    for (let index = this.mapArray.length - 1; index >= 0; index--) {
      if (this.mapArray[index].isNeedRemove(map)) {
        this.mapArray.splice(index, 1);
      }
    }
  }

  //Draw
  Draw(ctx) {
    let map = this;

    //рисуем все активные элементы карты      
    this.mapArray.forEach(function (item, index, array) {
      let mapX = -map.xyShift[0];
      let mapY = window.screenshiftY - map.xyShift[1];
      //если отметка об удалении, то не показываем
      if (!item.needRemove)
        item.Draw(ctx, mapX, mapY);
    });

  }

  //генерация новой карты
  getMapNew() {
    let arr = [];
    let Y = 13;
    for (let x = 0; x < this.sizeX; x++) {
      //бетонное начало
      if (x == 0) {
        let box = new MapObj("Бетон", 10, this.textures.getBeton(0), window.BETON);
        box.xy = [x * window.WHBeton[0], Y * window.WHBeton[1]];//самый низ
        arr.push(box);
        continue;
      }
      if (x < this.sizeX - 1) {
        let box = new MapObj("Бетон", 10, this.textures.getBeton(1), window.BETON);
        box.xy = [x * window.WHBeton[0], Y * window.WHBeton[1]];//самый низ
        arr.push(box);
        continue;
      }
      let box = new MapObj("Бетон", 10, this.textures.getBeton(2), window.BETON);
      box.xy = [x * window.WHBeton[0], Y * window.WHBeton[1]];//самый низ
      arr.push(box);
    }
    return arr;
  }

  //генерация карты справа
  putMapRight(xShift, hero) {
    let arr = this.mapArray;
    //var now = new Date();
    let millis = this.xyShift[0];//now.getTime();

    //1 этаж [0, 3, window.BETON];
    let f = this.floor1;
    let Y1 = 13;
    this.putPlanBox(arr, f, xShift, Y1);
    if (f[0] == f[1])
      this.setNextPlan(f);

    //2 этаж
    f = this.floor2;
    let Y2 = 9;
    this.putPlanBox(arr, f, xShift, Y2);
    if (f[0] == f[1])
      this.setNextPlan(f);

    //3 этаж
    f = this.floor3;
    let Y3 = 5;
    this.putPlanBox(arr, f, xShift, Y3);
    if (f[0] == f[1])
      this.setNextPlan(f);


    //стена на 3 этаже
    let isSlotUsed = [false, false, false];
    let freqRandRange = 3000;//время между стен диапазон
    let freqMin = 1000;//время между стен минимум
    let stepLenMin = 1;//ступенька минимум
    if (this.lasttimegenfloar3 < millis && this.floor3[2] == window.BETON) {
      if (this.floor3[0] > stepLenMin) {
        this.setKirpichBox(arr, Y3, xShift);
        this.lasttimegenfloar3 = millis + getRandomInt(freqRandRange) + freqMin;
        isSlotUsed[0] = true;
      }
    }
    //стена на 2 этаже
    if (this.lasttimegenfloar2 < millis && this.floor2[2] == window.BETON && this.floor3[2] == window.BETON) {
      if (this.floor2[0] > stepLenMin && this.floor3[0] > 2) {
        this.setKirpichBox(arr, Y2, xShift);
        this.lasttimegenfloar2 = millis + getRandomInt(freqRandRange) + freqMin;
        isSlotUsed[1] = true;
      }
    }
    //стена на 1 этаже
    if (!window.testGameMode && this.lasttimegenfloar1 < millis && this.floor1[2] == window.BETON && this.floor2[2] == window.BETON) {
      if (this.floor2[0] > stepLenMin && this.floor1[0] > 2) {
        this.setKirpichBox(arr, Y1, xShift);
        this.lasttimegenfloar1 = millis + getRandomInt(freqRandRange) + freqMin;
        isSlotUsed[2] = true;
      }
    }

    //генерим здоровье после кирпичей!!
    this.setHealth(xShift, isSlotUsed, arr);

    //Extension GamesFactor
    this.setGamesFactor(xShift, isSlotUsed, arr);
  }
  //генерим здоровье после кирпичей!!
  setHealth(xShift, isSlotUsed, arr) {
    if (xShift > this.healthLastShift) {
      //выберем этаж для установки здоровья
      let id = getRandomInt(3)
      //проверим чтобы не было там кирпича
      if (!isSlotUsed[id]) {
        this.setHealthBox(arr, id * 4, xShift);
        this.healthLastShift = xShift + this.healthDistancePeriod;
        isSlotUsed[id] = true;
      }
    }
  }
  //Extension GamesFactor
  setGamesFactor(xShift, isSlotUsed, arr) {
    if (xShift > this.x2LastShift) {
      //выберем этаж для установки x2
      let id = 2;//getRandomInt(3)
      //проверим чтобы не было там кирпича
      if (!isSlotUsed[id]) {
        this.setGamesFactorBox(arr, id * 4, xShift);
        this.x2LastShift = xShift + this.x2DistancePeriod;//+ getRandomInt(1000)/1000
        isSlotUsed[id] = true;
      }
    }
  }

  lasttimegenfloar3 = 0;
  lasttimegenfloar2 = 0;
  lasttimegenfloar1 = 0;
  setKirpichBox(arr, Y, xShift) {
    let box1 = new MapObj("Кирпич", 1, this.textures.getKirpich(-1), window.KIRPICH);
    box1.xy = [xShift, (Y - 3) * window.WHBeton[1]];
    box1.wh[1] *= 3;// в высоту 3 
    arr.push(box1);
    // let box2 = new MapObj("Кирпич", 1, this.textures.getKirpich(-1), window.KIRPICH);
    // box2.xy = [xShift, (Y - 2) * window.WHBeton[1]];
    // arr.push(box2);
    // let box3 = new MapObj("Кирпич", 1, this.textures.getKirpich(-1), window.KIRPICH);
    // box3.xy = [xShift, (Y - 3) * window.WHBeton[1]];

    //arr.push(box3);
    //свяжем элементы 
    let linkedBox = [box1/* , box2, box3 */];
    box1.linkedBox = linkedBox;
    // box2.linkedBox = linkedBox;
    // box3.linkedBox = linkedBox;
  }
  setHealthBox(arr, Y, xShift) {
    let box = new MapObj("Патрон", 1, this.textures.getHealth(-1), window.HEALTH);
    box.phisicTransparent = true;
    box.xy = [xShift, (Y + 3) * window.WHBeton[1]];
    box.wh[0] *= 0.5;
    box.wh[1] *= 0.5;
    arr.push(box);
  }
  setGamesFactorBox(arr, Y, xShift) {
    let box = new MapObj("x2", 2, this.textures.getGameFactor(0), window.X2);
    box.phisicTransparent = true;
    box.xy = [xShift, (Y + 3) * window.WHBeton[1]];
    box.wh[0] *= 1.5;
    box.wh[1] *= 1.5;
    arr.push(box);
  }
  //[0, 3, BETON];
  putPlanBox(arr, f, xShift, Y) {
    //мотаем план дальше
    f[0]++;
    //если ничего ставить не надо
    if (f[2] == window.NOTHING)
      return;

    var blok;
    if (f[0] == 1) //слева
      blok = new MapObj("Бетон", 10, this.textures.getBeton(0), window.BETON);
    else if (f[0] < f[1])//середина
      blok = new MapObj("Бетон", 10, this.textures.getBeton(1), window.BETON);
    else if (f[0] == f[1]) //справа
      blok = new MapObj("Бетон", 10, this.textures.getBeton(2), window.BETON);

    //ставим блок на свое место1
    blok.xy = [xShift, Y * window.WHBeton[1]];
    arr.push(blok);
  }
  setNextPlan(f) {
    f[0] = 0;//счетчик плана
    if (f[2] == window.NOTHING) {
      f[2] = window.BETON;
      f[1] = getRandomInt(7) + 6;//6 - минимум длина бетона
    }
    else {
      f[2] = window.NOTHING;
      f[1] = getRandomInt(5) + 3;//3 - минимум пустоты
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}