import Textures from './Textures.js';//для загрузки всех текстур 1 раз
import MapObj from './MapObj.js';//class для работы с обьектами карты
export default class {

  //координаты левого верхнего края карты
  xyShift = [0, 0];
  nexttestX = 0;//когда проверять  
  speedMap = 2;
  textures; //хранилище текстур карты

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
    this.xyShift[1] = hero.xy[1];
    //для скорости проверяем координаты не каждый тик 
    if (this.isNeedtest()) {
      //удалим box слева которые вышли за карту      
      this.removeBackBox();
      //добавим новые справа      
      this.putMapRight(this.xyShift[0] + this.sizeX * window.widthBox);
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

  //генерация новой карты
  getMapNew() {
    let arr = [];
    for (let x = 0; x < this.sizeX; x++) {
      //бетонное начало
      if (x == 7) {
        let box = this.getBoxBeton(this.textures);
        box.xy = [x * window.widthBox, 9 * window.widthBox];//самый низ
        arr.push(box);
      }
      // if (x == 6)
      //   continue;
      //бетонное начало
      if (x < 10) {
        let box = this.getBoxBeton(this.textures);
        box.xy = [x * window.widthBox, 10 * window.widthBox];//самый низ
        arr.push(box);
        continue;
      }
      for (let y = 0; y < this.sizeY; y++) {
        //пусто или блок
        if (getRandomInt(3) == 0) {//3 - сложность карты по Количеству блоков
          //элементы карты          
          var box = this.getRandomBox(this.textures);
          box.xy = [x * window.widthBox, y * window.widthBox];
          arr.push(box);
        }
      }
    }
    return arr;
  }
  //генерация карты справа
  putMapRight(xShift) {
    let arr = this.mapArray;
    for (let y = 0; y < this.sizeY; y++) {
      //пусто или блок
      if (getRandomInt(5) == 0) {//3 - сложность карты по Количеству блоков
        //элементы карты          
        var blok = this.getRandomBox(this.textures);
        blok.xy = [xShift, y * window.widthBox];
        arr.push(blok);
      }
    }
  }

  //генерация блока
  getRandomBox() {
    //можно сделать сложность карты по Типу блоков
    let typeid = getRandomInt(3);
    if (typeid == 0)
      return this.getBoxBeton(this.textures);
    else if (typeid == 1)
      return this.getBoxKirpich(this.textures);
    else if (typeid == 2)
      return this.getBoxTechno(this.textures);
    else
      return new MapObj();// и тд.  
  }

  getBoxBeton() {
    return new MapObj("Бетон", 10, this.textures.getBeton(-1));
  }
  getBoxKirpich() {
    return new MapObj("Кирпич", 1, this.textures.getKirpich(-1));
  }
  getBoxTechno() {
    return new MapObj("Техно", 100, this.textures.getTechno(-1))
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}