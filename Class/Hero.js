//гравитация земли
const gravityEarth = 2.3;
import MapObj from './MapObj.js';//class для работы с пулями
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
    bullets = [];
    bulletSpeed = 7;
    constructor(healthDom, x, y, imageFileName, textures) {
        this.textures = textures;
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

        this.audioBooh = new Audio();
        this.audioBooh.preload = 'auto';
        this.audioBooh.src = './sound/booh.mp3';

    }
    //прыгнуть
    Jump() {
        this.gravityCur = -45;
    }
    antiJump() {
        this.gravityCur = +45;
        if (this.xy[1] < 100)
            this.xy[1] = 110;

    }
    Right(map) {
        if (window.testGameMode)
            map.speedMap += 10;
        else
            if (map.speedMap + 5 <= 20)
                map.speedMap += 5;
            else
                map.speedMap = 20;
    }
    Left(map) {
        if (window.testGameMode)
            map.speedMap -= 10;
        else
            if (map.speedMap - 5 >= 5)
                map.speedMap -= 5;
            else
                map.speedMap = 1;
    }
    //выстрел
    Shot(map) {
        //выстрел если есть здоровье
        if(this.health > 0){
            this.editHealth(-1);
            let bullet = new MapObj("Bullet", 1, this.textures.getBullet(-1), window.BULLET);
            bullet.xy = [this.xy[0] + map.xyShift[0] + this.widthBox / 2, this.xy[1] + map.xyShift[1]];
            this.bullets.push(bullet);
        }
    }
    editHealth(delta){
        this.health += delta;//отнимаем
        this.healthDom.innerHTML = this.health;
    }
    //Life
    Life(map, score) {
        //удар об верхний край карты
        if (this.xy[1] < 100) {
            this.xy[1] = 110;
            this.gravityCur = 0;
        }
        //упал вниз
        if (this.xy[1] > 1400)
            this.health = -1;
        //ушел за левый край
        if (this.xy[0] < 0)
            this.health = -1;
        //возвращает элементы карты которые пересекаются с героем
        let colArr = this.doCollisionMObjs(map);
        //далее обработка обьектов(оружие, здоровье, огонь и тд)
        colArr.forEach(box => {
            if (box.typeid == window.HEALTH) {
                this.editHealth(box.value);
                box.needRemove = true;
                this.audioStar.play();
            }
        });
        //score        
        this.score += 0.01;
        score.innerHTML = Math.round(this.score);

        //bullets
        this.bulletsLife(map);
    }
    //жизнь пулек
    bulletsLife(map) {
 
        if (this.bullets.length == 0)
            return;
        this.bullets.forEach(bul => {
            //двигаем пулю
            bul.xy[0] += map.speedMap + this.bulletSpeed;

            //обработка столкновений
            let colArr = this.doCollisionMObjs_bullet(map, bul);

            //далее обработка обьектов(оружие, здоровье, огонь и тд)
            colArr.forEach(box => {
                if (box.typeid == window.KIRPICH) {

                    //пуля для удаления
                    bul.needRemove = true;

                    //удалим кирпич
                    box.needRemove = true;
                    //удалим все связаные кирпичи
                    box.linkedBox[0].needRemove = true;
                    box.linkedBox[1].needRemove = true;
                    box.linkedBox[2].needRemove = true;
                    this.audioBooh.play();
                    this.score += 10;//добавим очков
                } else if (box.typeid == window.BETON) {
                    bul.needRemove = true;//пуля для удаления
                    this.audioBooh.play();
                }
            });
            //анимация
            bul.Life();
        });

        //удалим пулю (анимации нет)
        for (let index = this.bullets.length - 1; index >= 0; index--) {
            let bul = this.bullets[index];
            //надо удалить или вылетела за карту
            if (bul.needRemove || bul.xy[0] > map.xyShift[0] + map.sizeX * window.widthBox)
                this.bullets.splice(index, 1);
        }
    }
    //обработка пересечения Bullet
    doCollisionMObjs_bullet(map, bul) {

        //проверим все элементы на карте по новым данным
        let colArr = [];
        for (let id = 0; id < map.mapArray.length; id++) {
            let box = map.mapArray[id];

            //если отметка об удалении, то не обрабатываем
            if (box.needRemove)
                continue;

            //с какой стороны пересекается с обьектом
            this.getCollisionType_Bullet(colArr, bul.xy, box);

        };

        return colArr;//с чем пересекались 
    }
    getCollisionType_Bullet(colArr, xyBullet, box) {

        let herox = [xyBullet[0], xyBullet[0] + this.widthBox, xyBullet[0] + this.widthBox * 0.5];
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

        let heroy = [xyBullet[1], xyBullet[1] + this.widthBox, xyBullet[1] + this.widthBox * 0.5];
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
    }
    //обработка пересечения
    doCollisionMObjs(map) {

        //новые xy для тестирования коллизии с ГГ
        if (!window.testGameMode)
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

        //левыйКрай, правыйКрай, центр 
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
            //препятствие слева 
            collisionX = boxx[1] - herox[0];
            vecX = 0;//1;//0 чтобы не бежал вперед
        }

        //далеко x
        if (collisionX <= 0)
            return;

        //верхнийКрай, нижнийКрай, центр 
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
    Draw(ctx, map) {
        //bullets
        let mapX = -map.xyShift[0];
        let mapY = window.screenshiftY - map.xyShift[1];
        this.bullets.forEach(bul => {
            bul.Draw(ctx, mapX, mapY);
        });

        //hero
        ctx.drawImage(
            this.image, //Image

            0, //First X on image
            0, //First Y on image
            this.image.width, //End X on image
            this.image.height, //End Y on image

            Math.floor(window.screenScale * this.xy[0]),//X on canvas
            Math.floor(window.screenScale * (window.screenshiftY + this.xy[1])),//Y on canvas
            Math.floor(window.screenScale * this.widthBox), //Width on canvas
            Math.floor(window.screenScale * this.widthBox) //Height on canvas
            // window.widthBox, //Width on canvas
            // window.widthBox //Height on canvas
        );
    }
}