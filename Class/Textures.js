import Texture from './Texture.js';//class для хранения Teкстур
export default class {
    //загрузим сразу все текстуры
    constructor() {
        this.arrBeton = this.loadImagesBeton();
        this.arrKirpich = this.loadImagesKirpich();
        this.arrGameFactor = this.loadImagesGamesFactor();
        this.arrTechno = this.loadImagesTechno();
        this.arrHealth = this.loadImagesHealth();
        this.arrBullet = this.loadImagesBullet();
        this.arrTextureHero = this.loadTextureHero();
    }
    loadTextureHero() {
        let arr = [];
        arr.push(this.loadTexture("images/hps/rubicAsep1hp.png", 1));
        arr.push(this.loadTexture("images/hps/rubicAsep2hp.png", 1));
        arr.push(this.loadTexture("images/hps/rubicAsep3hp.png", 1));
        arr.push(this.loadTexture("images/hps/rubicAsep4hp.png", 1));
        arr.push(this.loadTexture("images/hps/rubicAsep6hp.png", 1));
        return arr;
    }
    loadTexture(fileName, spriteCount) {
        return new Texture(fileName, spriteCount);
    }
    loadTexture(fileName, spriteCount, animaSpeed) {
        let texture = new Texture(fileName, spriteCount);
        texture.animaSpeed = animaSpeed;
        return texture; 
    }
    loadImagesBeton() {
        let arr = [];
        /* arr.push(this.loadTexture("images/box_red.png", 1));
        arr.push(this.loadTexture("images/box_green.png", 1));
        arr.push(this.loadTexture("images/box_yellow.png", 1));
        arr.push(this.loadTexture("images/box_blue.png", 1)); */
        arr.push(this.loadTexture("images/blocks/start-block.png", 1));
        arr.push(this.loadTexture("images/blocks/mid-block.png", 1));
        arr.push(this.loadTexture("images/blocks/end-block.png", 1));
        return arr;
    }
    loadImagesGamesFactor() {
        let arr = [];
        arr.push(this.loadTexture("images/x2.png", 4, 100));
        return arr;
    }
    loadImagesKirpich() {
        let arr = [];
        arr.push(this.loadTexture("images/blocks/whiteblockwowall100p.png", 1));
        return arr;
    }
    loadImagesTechno() {
        let arr = [];
        arr.push(this.loadTexture("images/box_tehno3.png", 3, 100));
        return arr;
    }
    loadImagesHealth() {
        let arr = [];        
        arr.push(this.loadTexture("images/health n ammo.png", 1));
        return arr;
    }
    loadImagesBullet() {
        let arr = [];        
        arr.push(this.loadTexture("images/bullet_red.png", 4, 30));
        return arr;
    }
    getBeton(id) {
        //если индекс не указан то выбираем любой
        if (id == -1)
            id = getRandomInt(this.arrBeton.length);
        return this.arrBeton[id];
    }
    getKirpich(id) {
        //если индекс не указан то выбираем любой
        if (id == -1)
            id = getRandomInt(this.arrKirpich.length);
        return this.arrKirpich[id];
    }
    getTechno(id) {
        //если индекс не указан то выбираем любой
        if (id == -1)
            id = getRandomInt(this.arrTechno.length);
        return this.arrTechno[id];
    }
    getHealth(id) {
        //если индекс не указан то выбираем любой
        if (id == -1)
            id = getRandomInt(this.arrHealth.length);
        return this.arrHealth[id];
    }
    getGameFactor(id) {
        //если индекс не указан то выбираем любой
        if (id == -1)
            id = getRandomInt(this.arrGameFactor.length);
        return this.arrGameFactor[id];
    }
    getBullet(id) {
        //если индекс не указан то выбираем любой
        if (id == -1)
            id = getRandomInt(this.arrBullet.length);
        return this.arrBullet[id];
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}