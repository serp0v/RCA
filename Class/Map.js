import MapObj from './MapObj.js';//class для работы с обьектами карты
export default class {

  //координаты левого верхнего края карты
  xyShift = [0, 0];
  nexttestX = 0;//когда проверять  
  speedMap = 2;

  //при создании новой карты
  constructor(sizeX, sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    //генерация новой карты
    this.mapArray = getMapNew(this);
  }

  //Life
  Life(hero) {
    //смещаем карту
    this.xyShift[0] += this.speedMap;
    this.xyShift[1] = hero.xy[1];
    //для скорости проверяем координаты не каждый тик 
    if (this.isNeedtest()) {
      //удалим box слева которые вышли за карту      
      this.removeBackBox();
      //добавим новые справа      
      putMapRight(this, this.xyShift[0] + this.sizeX * window.widthBox);
    }

    //даем пожить каждому элементу
    this.mapArray.forEach(function (item, index, array) {
      item.Life();
    });
  }

  //переодичность проверки элементов
  isNeedtest() {
    let need = this.nexttestX < this.xyShift[0];
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
      item.Draw(ctx, map);
    });
  }

}

//генерация новой карты
function getMapNew(map) {
  let arr = [];
  for (let x = 0; x < map.sizeX; x++) {
    //бетонное начало
    if (x == 7) {
      let box = new MapObj("Бетон", 10, "images/beton-export.png", 1);
      box.xy = [x * window.widthBox, 9 * window.widthBox];//самый низ
      arr.push(box);
    }
    // if (x == 6)
    //   continue;
    //бетонное начало
    if (x < 10) {
      let box = new MapObj("Бетон", 10, "images/beton-export.png", 1);
      box.xy = [x * window.widthBox, 10 * window.widthBox];//самый низ
      arr.push(box);
      continue;
    }
    for (let y = 0; y < map.sizeY; y++) {
      //пусто или блок
      if (getRandomInt(3) == 0) {//3 - сложность карты по Количеству блоков
        //элементы карты          
        var box = getRandomBox();
        box.xy = [x * window.widthBox, y * window.widthBox];
        arr.push(box);
      }
    }
  }
  return arr;
}

//генерация карты справа
function putMapRight(map, xShift) {
  let arr = map.mapArray;
  for (let y = 0; y < map.sizeY; y++) {
    //пусто или блок
    if (getRandomInt(5) == 0) {//3 - сложность карты по Количеству блоков
      //элементы карты          
      var blok = getRandomBox();
      blok.xy = [xShift, y * window.widthBox];
      arr.push(blok);
    }
  }
}

//генерация блока
function getRandomBox(params) {
  //можно сделать сложность карты по Типу блоков
  let typeid = getRandomInt(3);
  if (typeid == 0)
    return new MapObj("Бетон", 10, "images/beton-export.png", 1);
  else if (typeid == 1)
    return new MapObj("Кирпич", 2, "images/bricks.png", 1);
  else if (typeid == 2)
    return new MapObj("Техно", 2, "images/box_tehno3.png", 3);
  else
    return new MapObj();// и тд.

}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}