export default class {
    xy = [0, 0];
    constructor(x, y, imageFileName) {
        this.xy[0] = x;
        this.xy[1] = y;
        this.image = new Image();
        this.image.scr = imageFileName;
    }

    Draw(ctx){
        ctx.drawImage(
            this.image,
    
            0,
            0,
            this.image.width, //Image
            this.image.height, //End Y on image

            this.xy[0],//X on canvas
            this.xy[1],//Y on canvas
            window.widthBox, //Width on canvas
            window.widthBox //Height on canvas
        );
    };
}