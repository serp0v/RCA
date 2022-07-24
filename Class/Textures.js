import Texture from './Texture.js';//class для хранения Teкстур
export default class {
    //загрузим сразу все текстуры
    constructor() {
        this.arrBeton = this.loadImagesBeton();
        this.arrKirpich = this.loadImagesKirpich();
        this.arrTechno = this.loadImagesTechno();
    }
    loadTexture(fileName, spriteCount) {
        return new Texture(fileName, spriteCount);
    }
    loadImagesBeton() {
        let arr = [];
        arr.push(this.loadTexture("images/box_red.png", 1));
        arr.push(this.loadTexture("images/box_green.png", 1));
        arr.push(this.loadTexture("images/box_yellow.png", 1));
        arr.push(this.loadTexture("images/box_blue.png", 1));
        return arr;
    }
    loadImagesKirpich() {
        let arr = [];
        arr.push(this.loadTexture("images/bricks.png", 1));
        return arr;
    }
    loadImagesTechno() {
        let arr = [];
        arr.push(this.loadTexture("images/box_tehno3.png", 3));
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
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}