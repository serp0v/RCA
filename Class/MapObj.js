export default class {
  xy = [0,0];
  //для создания обьекта с параметрами
  constructor(name, antidamage) {
    this.name = name;
    this.antidamage = antidamage;//устойчивость к повреждению
  }
  getName() {
    return 'i am ' + this.name;
  }
}