//гравитация земли
const gravityEarth = 2.3;

export default class {
    xy = [0, 0];
    gravityCur = 0;//гравитация действующая на героя    
    widthBox = 180;
    speedReturn = 1;
    Xmax = 0;
    Ymax = 0;
    health = 3;
    score = 0;
    healthDom;
    constructor(healthDom, x, y, imageFileName) {
        this.healthDom = healthDom;
        this.xy[0] = this.Xmax = x;
        this.xy[1] = this.Ymax = y;
        this.image = new Image();
        this.image.src = imageFileName;

        this.audioStep = new Audio();
        this.audioStep.preload = 'auto';
        this.audioStep.src = './sound/step.mp3';

        this.audioHead = new Audio();
        this.audioHead.preload = 'auto';
        this.audioHead.src = './sound/head.mp3';

        let audio = new Audio();
        audio.preload = 'auto';
        audio.src = './sound/piu.mp3';
        this.audioStar = audio;
    }
    //прыгнуть
    Jump() {
        this.gravityCur = -45;
    }
    antiJump() {
        this.gravityCur = +20;
    }
    Right() {

    }
    Left() {

    }
    //Life
    Life(map, score) {
        //удар об верхний край карты
        if (this.xy[1] < 100)
            this.gravityCur = 0;
        //упал вниз
        if (this.xy[1] > 1300)
            this.health = -1;
        //ушел за левый край
        if (this.xy[0] < 0)
            this.health = -1;
        //возвращает элементы карты которые пересекаются с героем
        let colArr = this.doCollisionMObjs(map);
        //далее обработка обьектов(оружие, здоровье, огонь и тд)
        colArr.forEach(box => {
            if (box.typeid == window.HEALTH) {
                this.health += box.value;
                box.needRemove = true;
                this.audioStar.play();
                this.healthDom.innerHTML = this.health;
            }
        });
        //score        
        this.score += 0.01;
        score.innerHTML = Math.round(this.score);                
    }
    //обработка пересечения
    doCollisionMObjs(map) {

        //новые xy для тестирования коллизии с ГГ
        this.gravityCur += gravityEarth;//прибавим гравитацию        
        let xyHero = [
            this.xy[0] + (this.xy[0] < this.Xmax ? this.speedReturn : 0),
            this.xy[1] + this.gravityCur
        ];

        //текущее смещение карты
        let xyShiftMap = map.xyShift;

        //проверим все элементы на карте по новым данным
        let colArr = [];
        for (let id = 0; id < map.mapArray.length; id++) {
            let box = map.mapArray[id];

            //если отметка об удалении, то не обрабатываем
            if (box.needRemove)
                continue;

            //с какой стороны пересекается с обьектом
            this.getCollisionType(colArr, xyHero, box, xyShiftMap);

        };

        //изменяем xy игрока если 
        this.xy[0] = xyHero[0];
        this.xy[1] = xyHero[1];

        return colArr;//с чем пересекались 
    }
    //с какой стороны ГГ пересекается с обьектом
    getCollisionType(colArr, xyHero, box, xyShiftMap) {

        let herox = [xyHero[0] + xyShiftMap[0], xyHero[0] + xyShiftMap[0] + this.widthBox, xyHero[0] + xyShiftMap[0] + this.widthBox * 0.5];
        let boxx = [box.xy[0], box.xy[0] + window.widthBox];

        //препятствие справа
        let collisionX;
        let vecX;
        if (herox[2] < boxx[0]) {
            collisionX = herox[1] - boxx[0];
            vecX = -1;
        }
        else {
            collisionX = boxx[1] - herox[0];//препятствие слева
            vecX = 1;
        }

        //далеко x
        if (collisionX <= 0)
            return;

        let heroy = [xyHero[1] + xyShiftMap[1], xyHero[1] + xyShiftMap[1] + this.widthBox, xyHero[1] + xyShiftMap[1] + this.widthBox * 0.5];
        let boxy = [box.xy[1], box.xy[1] + window.widthBox];

        //препятствие снизу
        let collisionY;
        let vecY;
        if (heroy[2] < boxy[0]) {
            collisionY = heroy[1] - boxy[0];
            vecY = -1;
        }
        else {
            collisionY = boxy[1] - heroy[0]; //препятствие сверху
            vecY = 1;
        }

        //далеко y
        if (collisionY <= 0)
            return;

        //запишем обьект с которым был контакт
        colArr.push(box);

        //если физически прозрачный то контакта с физикой не показываем
        if (box.phisicTransparent)
            return;

        //box отталкивает
        if (collisionX < collisionY)
            xyHero[0] += collisionX * vecX;
        else {
            xyHero[1] += collisionY * vecY;
            //звук приземления и удара головой             
            if (gravityEarth < Math.abs(this.gravityCur)) {
                if (vecY < 0)
                    //приземление
                    // this.audioStep.play();
                    console.log("problem")
                else
                    //удар головой
                    this.audioHead.play();
            }
            this.gravityCur = 0;//сброс скорости падения
        }
    }

    //Draw
    Draw(ctx) {
        ctx.drawImage(
            this.image, //Image

            0, //First X on image
            0, //First Y on image
            this.image.width, //End X on image
            this.image.height, //End Y on image

            window.screenScale * this.xy[0],//X on canvas
            window.screenScale * (window.screenshiftY + this.xy[1]),//Y on canvas
            window.screenScale * this.widthBox, //Width on canvas
            window.screenScale * this.widthBox //Height on canvas
            // window.widthBox, //Width on canvas
            // window.widthBox //Height on canvas
        );
    }
}