export default class {
    loaded = false;
    image;
    spriteCount = 1;//колво кадров в текстуре (по горизонтали)
    spriteFrameIDMax = 1;//колво кадров в текстуре (по горизонтали)
    animaSpeed = 100;
    imageWidthSprite = 128;
    imageHeight = 128;
    src;
    constructor(fileName, spriteCount, animaSpeed){
        //после загрузки картинки отметить готовность
        this.image = new Image();
        this.spriteCount = spriteCount;
        this.spriteFrameIDMax = spriteCount - 1;        
        var obj = this;
        this.image.addEventListener("load", function () {
            obj.imageWidthSprite = obj.image.width / obj.spriteCount;
            obj.imageHeight = obj.image.height;
            obj.loaded = true;
        });
        this.image.src = this.src = fileName;
    }
    
}