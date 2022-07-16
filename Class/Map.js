import MapObj from './MapObj.js';//class для работы с обьектами карты
export default class {

  //при создании новой карты
  constructor(sizeX, sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    //генерация новой карты
    this.mapArray = getNewMap(this);
  }
   
}

//генерация новой карты
function getNewMap(map) {
  let arr = [];
  for (let x = 0; x < map.sizeX; x++) {
    for (let y = 0; y < map.sizeY; y++) {
      //пусто или блок
      if (getRandomInt(3) == 0) {//3 - сложность карты по Количеству блоков
        //элементы карты          
        var blok = getRandomBlock();
        blok.xy = [x,y];
        arr.push(blok);
      }
    }
  }
  return arr;
}

//генерация блока
function getRandomBlock(params) {
  //можно сделать сложность карты по Типу блоков
  let typeid = getRandomInt(2);
  if (typeid == 0)
    return new MapObj("Бетон", 10);//тут может быть бетон
  else if (typeid == 1)
    return new MapObj("Кирпич", 2);//тут может быть кирпич
  else 
    return new MapObj();// и тд.
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}



