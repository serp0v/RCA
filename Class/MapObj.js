export default class {

  //координаты обьекта устанавливаются при генерации карты
  xy = [0, 0];
  imageWidthSprite = 50;
  needRemove = false;//удаление не требуется
  spriteFrameID = 0;//текущий кадр анимации
  spriteTimeNext =0;//таймер следующей анимации
  phisicTransparent = false;//true - можно проходить насквозь 

  //для создания обьекта с параметрами
  constructor(name, antidamage, image, sprite) {
    this.name = name;
    this.antidamage = antidamage;//устойчивость к повреждению
    this.loaded = false;//готов
    this.image = new Image();
    this.spriteCount = sprite;//колво кадров в текстуре (по горизонтали)
    this.spriteFrameIDMax = sprite - 1;
    var obj = this;
    //после загрузки картинки отметить готовность
    this.image.addEventListener("load", function () {
      obj.loaded = true;
      obj.imageWidthSprite = obj.image.width / obj.spriteCount;
    });
    this.image.src = image;
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
    if (this.spriteFrameIDMax > 0) {
      var now = new Date();
      let millis = now.getTime();
      if (this.spriteTimeNext < millis) {
        this.spriteTimeNext = millis + 100 + getRandomInt(50);
        this.spriteFrameID++;
        if (this.spriteFrameIDMax < this.spriteFrameID)
          this.spriteFrameID = 0;
      }
    }
  }

  //Draw
  Draw(ctx, map) {
    //рисуем обьект карты
    if (this.spriteCount > 1)
      if (this.spriteFrameID == 0)
        var x = 0;
      else
        var x = 1;

    let xS = this.spriteFrameID * this.imageWidthSprite; //First X on image
    let xE = this.imageWidthSprite; //End X on image

    ctx.drawImage
      (
        this.image, //Image

        xS, //First X on image
        0, //First Y on image
        xE, //End X on image
        this.image.height, //End Y on image

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