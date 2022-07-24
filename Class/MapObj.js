export default class {

  //координаты обьекта устанавливаются при генерации карты
  xy = [0, 0];
  needRemove = false;//удаление не требуется
  spriteFrameID = 0;//текущий кадр анимации
  spriteTimeNext = 0;//таймер следующей анимации
  phisicTransparent = false;//true - можно проходить насквозь 
  texture;//текстура с параметрами

  //для создания обьекта с параметрами
  constructor(name, antidamage, texture) {
    this.name = name;
    this.antidamage = antidamage;//устойчивость к повреждению
    this.loaded = false;//готов  
    this.texture = texture;          
  }
  getName() {
    return 'i am ' + this.name;
  }
  isNeedRemove(map) {
    //удаление по причине выхода за карту
    if (this.xy[0] > map.xyShift[0])
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
        this.spriteTimeNext = millis + 100 + getRandomInt(50);
        this.spriteFrameID++;
        if (this.texture.spriteFrameIDMax < this.spriteFrameID)
          this.spriteFrameID = 0;
      }
    }
  }

  //Draw
  Draw(ctx, map) {
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

        -map.xyShift[0] + this.xy[0],//X on canvas
        window.screenshiftY -map.xyShift[1] + this.xy[1],//Y on canvas /* window.screenshift */
        window.widthBox, //Width on canvas
        window.widthBox //Height on canvas
      );
  }  
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}