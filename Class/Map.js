const NOTHING = 0;
const BETON = 1;
const KIRPICH = 2;
import Textures from './Textures.js';//для загрузки всех текстур 1 раз
import MapObj from './MapObj.js';//class для работы с обьектами карты
export default class {

  //координаты левого верхнего края карты
  xyShift = [0, 0];
  nexttestX = 0;//когда проверять  
  speedMap = 10;
  textures; //хранилище текстур карты

  //текущий план расстановки блоков
  floor3 = [0, 5, NOTHING];
  floor2 = [0, 2, BETON];
  floor1 = [0, 3, NOTHING];

  //при создании новой карты
  constructor(sizeX, sizeY) {
    this.textures = new Textures();
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    //генерация новой карты
    this.mapArray = this.getMapNew();
  }

  //Life
  Life(hero) {
    //смещаем карту
    this.xyShift[0] += this.speedMap;
    //this.xyShift[1] = hero.xy[1];//следование за картой
    //для скорости проверяем координаты не каждый тик 
    if (this.isNeedtest()) {
      //удалим box слева которые вышли за карту      
      this.removeBackBox();
      //добавим новые справа      
      this.putMapRight(this.xyShift[0] + this.sizeX * window.widthBox);
    }

    //даем пожить каждому элементу
    this.mapArray.forEach(function (item, index, array) {
      //если отметка об удалении, то не используем
      if (!item.needRemove)
        item.Life();
    });
  }

  //переодичность проверки элементов
  isNeedtest() {
    let need = this.nexttestX <= this.xyShift[0];
    if (need)
      this.nexttestX = this.xyShift[0] + window.widthBox;
    return need;
  }

  //удалим все элементы карты которые вышли за границу
  removeBackBox() {
    let map = this;
    for (let index = this.mapArray.length - 1; index >= 0; index--) {
      if (this.mapArray[index].isNeedRemove(map))
        this.mapArray.splice[index, 1];
    }
  }

  //Draw
  Draw(ctx) {
    let map = this;

    //рисуем все активные элементы карты      
    this.mapArray.forEach(function (item, index, array) {
      //если отметка об удалении, то не показываем
      if (!item.needRemove)
        item.Draw(ctx, map);
    });

  }

  //генерация новой карты
  getMapNew() {
    let arr = [];
    let Y = 13;
    for (let x = 0; x < this.sizeX; x++) {
      //бетонное начало
      if (x == 0) {
        let box = new MapObj("Бетон", 10, this.textures.getBeton(0), BETON);
        box.xy = [x * window.widthBox, Y * window.widthBox];//самый низ
        arr.push(box);
        continue;
      }
      if (x < this.sizeX - 1) {
        let box = new MapObj("Бетон", 10, this.textures.getBeton(1), BETON);
        box.xy = [x * window.widthBox, Y * window.widthBox];//самый низ
        arr.push(box);
        continue;
      }
      let box = new MapObj("Бетон", 10, this.textures.getBeton(2), BETON);
      box.xy = [x * window.widthBox, Y * window.widthBox];//самый низ
      arr.push(box);
    }
    return arr;
  }
  //генерация карты справа
  putMapRight(xShift) {
    let arr = this.mapArray;
    var now = new Date();
    let millis = now.getTime();

    //1 этаж [0, 3, BETON];
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
    if (this.lasttimegenfloar3 < millis && this.floor3[2] == BETON) {
      if (this.floor3[0] > 2) {
        this.trySetKirpich(arr, Y3, xShift);
        this.lasttimegenfloar3 = millis + getRandomInt(5000) + 2000;
      }
    }
    //стена на 2 этаже
    if (this.lasttimegenfloar2 < millis && this.floor2[2] == BETON && this.floor3[2] == BETON) {
      if (this.floor2[0] > 2 && this.floor3[0] > 2) {
        this.trySetKirpich(arr, Y2, xShift);
        this.lasttimegenfloar2 = millis + getRandomInt(5000) + 2000;
      }
    }
    //стена на 1 этаже
    if (this.lasttimegenfloar1 < millis && this.floor1[2] == BETON && this.floor2[2] == BETON) {
      if (this.floor2[0] > 2 && this.floor1[0] > 2) {
        this.trySetKirpich(arr, Y1, xShift);
        this.lasttimegenfloar1 = millis + getRandomInt(5000) + 2000;
      }
    }
  }
  lasttimegenfloar3 = 0;
  lasttimegenfloar2 = 0;
  lasttimegenfloar1 = 0;
  trySetKirpich(arr, Y, xShift) {
    let box = new MapObj("Кирпич", 1, this.textures.getKirpich(-1), KIRPICH);
    box.xy = [xShift, (Y - 1) * window.widthBox];
    arr.push(box);
    box = new MapObj("Кирпич", 1, this.textures.getKirpich(-1), KIRPICH);
    box.xy = [xShift, (Y - 2) * window.widthBox];
    arr.push(box);
    box = new MapObj("Кирпич", 1, this.textures.getKirpich(-1), KIRPICH);
    box.xy = [xShift, (Y - 3) * window.widthBox];
    arr.push(box);
  }
  //[0, 3, BETON];
  putPlanBox(arr, f, xShift, Y) {
    //мотаем план дальше
    f[0]++;
    //если ничего ставить не надо
    if (f[2] == NOTHING)
      return;

    var blok;
    if (f[0] == 1) //слева
      blok = new MapObj("Бетон", 10, this.textures.getBeton(0), BETON);
    else if (f[0] < f[1])//середина
      blok = new MapObj("Бетон", 10, this.textures.getBeton(1), BETON);
    else if (f[0] == f[1]) //справа
      blok = new MapObj("Бетон", 10, this.textures.getBeton(2), BETON);

    blok.xy = [xShift, Y * window.widthBox];
    arr.push(blok);
  }
  setNextPlan(f) {
    f[0] = 0;//счетчик плана
    if (f[2] == NOTHING) {
      f[2] = BETON;
      f[1] = getRandomInt(7) + 3;//3-10 длина бетона
    }
    else {
      f[2] = NOTHING;
      f[1] = getRandomInt(5) + 3;//3-8 длина пустоты
    }
  }

  //генерация блока
  getBox() {
    //можно сделать сложность карты по Типу блоков
    let typeid = getRandomInt(7);
    if (typeid <= 3)
      return this.getBoxBeton(typeid);
    else if (typeid == 4)
      return this.getBoxKirpich(typeid);
    else if (typeid == 5)
      return this.getBoxTechno(typeid);
    else if (typeid == 6)//Health
      return this.getBoxHealth(typeid);

  }

  getBoxBeton(typeid) {
    return new MapObj("Бетон", 10, this.textures.getBeton(1), typeid);
  }
  getBoxKirpich(typeid) {
    return new MapObj("Кирпич", 1, this.textures.getKirpich(-1), typeid);
  }
  getBoxTechno(typeid) {
    return new MapObj("Техно", 100, this.textures.getTechno(-1), typeid);
  }
  getBoxHealth(typeid) {
    let box = new MapObj("Жизнь", 30, this.textures.getHealth(-1), typeid);
    box.phisicTransparent = true;
    return box;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}