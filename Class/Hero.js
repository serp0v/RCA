//гравитация земли
const gravityEarth = 0.25;
export default class {
    xy = [0, 0];
    gravityCur = 0;//гравитация действующая на героя    
    widthBox = 90;
    speedReturn = 1;    
    Xmax = 0;

    // top = document.getElementById('top');
    // right = document.getElementById('right');
    // bottom = document.getElementById('bottom');
    // left = document.getElementById('left');

    constructor(x, y, imageFileName) {
        this.xy[0] = this.Xmax = x;
        this.xy[1] = y;
        this.image = new Image();
        this.image.src = imageFileName;
    }
    //прыгнуть
    Jump() {
        this.gravityCur = -10;
    }
    //Life
    Life(map) {
        //возвращает элементы карты которые пересекаются с героем
        let colArr = this.doCollisionMObjs(map);
        //далее обработка обьектов(оружие, здоровье, огонь и тд)
        //
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

            //с какой стороны пересекается с обьектом
            let typeid = this.getCollisionType(colArr, xyHero, box, xyShiftMap);

            //typeid == 0 - пересечения нет, или обьект прозрачный
            if (typeid > 0)
                //правим влияние от коллизии
                this.correctInfluence(typeid, xyHero);
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
            vecX = 2;
        }
        else {
            collisionX = boxx[1] - herox[0];//препятствие слева
            vecX = 4;
        }

        //далеко x
        if (collisionX < 0)
            return 0;

        let heroy = [xyHero[1] + xyShiftMap[1], xyHero[1] + xyShiftMap[1] + this.widthBox, xyHero[1] + xyShiftMap[1] + this.widthBox * 0.5];
        let boxy = [box.xy[1], box.xy[1] + window.widthBox];

        //препятствие снизу
        let collisionY;
        let vecY;
        if (heroy[2] < boxy[0]) {
            collisionY = heroy[1] - boxy[0];
            vecY = 1;
        }
        else {
            collisionY = boxy[1] - heroy[0]; //препятствие сверху
            vecY = 3;
        }

        //далеко y
        if (collisionY < 0)
            return 0;


        //запишем обьект с которым был контакт
        colArr.push(box);

        //если физически прозрачный то контакта с физикой не показываем
        if (box.phisicTransparent)
            return 0;

        //возвращаем вектор
        if (collisionX < collisionY) {
            xyHero[0] -= collisionX; //box справа двигает ГГ влево и право
            return vecX;
        }
        else{
            xyHero[1] -= collisionY; //box отталкивакет ГГ вниз и верх
            return vecY;
        }
    }
    //правим влияние от коллизии
    correctInfluence(typeid, xyNew) {
        //пересечение снизу
        if (typeid == 1) {
            xyNew[1] = this.xy[1];  //вниз не падаем                
            this.gravityCur = 0;       //сброс скорости падения
        } else
            //пересечение справа
            if (typeid == 2) {
                //xyNew[0] = this.xy[0];  
                //box справа двигает ГГ влево в getCollisionType()
            } else
                //пересечение сверху
                if (typeid == 3) {
                    xyNew[1] = this.xy[1];  //вверх не летим
                    this.gravityCur = 0;       //сброс скорости падения
                } else
                    //пересечение слева
                    if (typeid == 4) {
                        xyNew[0] = this.xy[0];  //
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

            this.xy[0],//X on canvas
            this.xy[1],//Y on canvas
            this.widthBox, //Width on canvas
            this.widthBox //Height on canvas
        );
    }
}