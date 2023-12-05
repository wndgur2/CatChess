import SimpleCats from './SimpleCats.js';

export class SimpleCat{
    static catTypes = Object.values(SimpleCats);
    constructor(id){
        const type = SimpleCat.catTypes[id];

        this.name = type.name;
        this.ad = type.ad;
        this.speed = type.speed;
        this.hp = type.hp;
        this.armor = type.armor;

        this.delay = 0;
    }
    
    /**
     * @param {SimpleCat} target 
     */
    attack(target){
        if(this.delay > 0) this.prepAttack();
        target.hp -= this.ad - target.armor;
        this.delay = 100;
    }

    prepAttack(){
        this.delay -= this.speed;
    }
}