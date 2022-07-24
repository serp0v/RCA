import Texture from './Texture.js';//class для хранения Teкстур
export default class {

  //координаты обьекта устанавливаются при генерации карты
  xy1 = [0, 0];  
  xy2 = [300, 0];  
  texture1;//текстура с параметрами
  texture2;//текстура с параметрами

  //для создания обьекта с параметрами
  constructor() {  
    this.texture1 = new Texture("images/back2.png", 1); 
    this.texture2 = new Texture("images/back1.png", 1); 
    this.loaded = false;//готов          
  }

  // Life
  Life() {
  
  }

  //Draw
  Draw(ctx, map) {
    ctx.drawImage
      (
        this.texture1.image, //Image

        0, //First X on image
        0, //First Y on image
        this.texture1.imageWidthSprite, //End X on image
        this.texture1.imageHeight, //End Y on image

        -map.xyShift[0] * 0.25 + this.xy1[0],//X on canvas
        -map.xyShift[1] * 0.25 + this.xy1[1],//Y on canvas /* window.screenshift */
        window.innerWidth, //Width on canvas
        window.innerHeight //He ight on canvas
      );
    ctx.drawImage
      (
        this.texture1.image, //Image

        0, //First X on image
        0, //First Y on image
        this.texture1.imageWidthSprite, //End X on image
        this.texture1.imageHeight, //End Y on image

        window.innerWidth -map.xyShift[0] * 0.25 + this.xy1[0],//X on canvas
        -map.xyShift[1] * 0.25 + this.xy1[1],//Y on canvas /* window.screenshift */
        window.innerWidth * 2, //Width on canvas
        window.innerHeight //He ight on canvas
      );
    ctx.drawImage
      (
        this.texture2.image, //Image

        0, //First X on image
        0, //First Y on image
        this.texture2.imageWidthSprite, //End X on image
        this.texture2.imageHeight, //End Y on image

        -map.xyShift[0] * 0.5 + this.xy2[0],//X on canvas
        -map.xyShift[1] * 0.5 + this.xy2[1],//Y on canvas /* window.screenshift */
        window.innerWidth, //Width on canvas
        window.innerHeight //Height on canvas
      );
      ctx.drawImage
      (
        this.texture2.image, //Image

        0, //First X on image
        0, //First Y on image
        this.texture2.imageWidthSprite, //End X on image
        this.texture2.imageHeight, //End Y on image

        window.innerWidth -map.xyShift[0] * 0.5 + this.xy2[0],//X on canvas
        -map.xyShift[1] * 0.5 + this.xy2[1],//Y on canvas /* window.screenshift */
        window.innerWidth * 2, //Width on canvas
        window.innerHeight //Height on canvas
      );
  }  
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}