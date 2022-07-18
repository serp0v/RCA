export default class {
  xy = [0, 0];

  //для создания обьекта с параметрами
  constructor(name, antidamage, image) {
    this.name = name;
    this.antidamage = antidamage;//устойчивость к повреждению
    this.width = 100;//размер блока
    this.loaded = false;//готов
    this.image = new Image();
    var obj = this;
    //после загрузки каринки отметить готовность
    this.image.addEventListener("load", function () {
      obj.loaded = true;
    });
    this.image.src = image;
  }
  getName() {
    return 'i am ' + this.name;
  }
  //Draw
  Draw(ctx) {
    //рисуем обьект карты
    ctx.drawImage
      (
        this.image, //Image
        0, //First X on image
        0, //First Y on image
        this.image.width, //End X on image
        this.image.height, //End Y on image
        this.xy[0] * this.width, //X on canvas
        this.xy[1] * this.width, //Y on canvas
        this.width, //Width on canvas
        this.width //Height on canvas
      );
  }
}