export default class {

  //координаты обьекта устанавливаются при генерации карты
  xy = [0, 0];  
  wh = [window.WHBeton[0],window.WHBeton[1]];  
  needRemove = false;//удаление не требуется
  spriteFrameID = 0;//текущий кадр анимации
  spriteTimeNext = 0;//таймер следующей анимации
  phisicTransparent = false;//true - можно проходить насквозь 
  texture;//текстура с параметрами
  typeid = 0;//тип обьекта(стена, оружие, здоровье)

  //для создания обьекта с параметрами
  constructor(name, value, texture, typeid) {
    this.name = name;
    this.value = value;//возможное значение
    this.loaded = false;//готов  
    this.texture = texture;          
    this.typeid = typeid;
  }
  getName() {
    return 'i am ' + this.name;
  }
  isNeedRemove(map) {
    //удаление по причине выхода за карту
    if (this.xy[0] < map.xyShift[0])
      return true;
    //по другой причине
    return this.needRemove;
  }

  // Life
  Life() {
    //переход на следующий кадр Sprite анимации
    if (this.texture.spriteFrameIDMax > 0) {
      var now = new Date();
      let millis = now.getTime();
      if (this.spriteTimeNext < millis) {
        this.spriteTimeNext = millis + this.texture.animaSpeed + getRandomInt(50);
        this.spriteFrameID++;
        if (this.texture.spriteFrameIDMax < this.spriteFrameID)
          this.spriteFrameID = 0;
      }
    }
  }

  //Draw
  Draw(ctx, mapX, mapY) {
    //рисуем обьект карты
    let xS = this.spriteFrameID * this.texture.imageWidthSprite; //First X on image
    let xE = this.texture.imageWidthSprite; //End X on image

    ctx.drawImage
      (
        this.texture.image, //Image

        xS, //First X on image
        0, //First Y on image
        xE, //End X on image
        this.texture.imageHeight, //End Y on image

        window.screenScale * (mapX + this.xy[0]),//X on canvas
        window.screenScale * (mapY + this.xy[1]),//Y on canvas /* window.screenshift */
        window.screenScale * (this.wh[0]), //Width on canvas
        window.screenScale * (this.wh[1]) //Height on canvas
      );
  }  
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}