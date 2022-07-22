export default class {
    xy = [0, 0];
    constructor(x, y, imageFileName) {
        this.xy[0] = x;
        this.xy[1] = y;
        this.image = new Image();
        this.image.src = imageFileName;
    }

    Draw(ctx) {
        ctx.drawImage(
            this.image, //Image

            0, //First X on image
            0, //First Y on image
            this.image.width, //End X on image
            this.image.height, //End Y on image

            this.xy[0],//X on canvas
            this.xy[1],//Y on canvas
            window.widthBox, //Width on canvas
            window.widthBox //Height on canvas
        );
    }
}