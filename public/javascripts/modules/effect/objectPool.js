import { Effect } from "./Effect.js";

class objectPool {
    count;
    prefab = new Effect();
    pool = [];

    constructor(prefab, count = 20) {
        this.prefab = prefab;
        this.count = count;
        this.Init();
        this.activeCount = 0;
    }

    Init() {
        for (let i = 0; i < this.count; ++i)
            this.pool.push(new this.prefab(this));
    }

    GetObject(position) {
        for (let i = 0; i < this.count; ++i) {
            if (this.pool[i].GetActive()) continue;

            this.pool[i].SetPosition(position);
            this.pool[i].SetActive(true);
            this.activeCount++;
            console.log("GETOBJECT:", this.activeCount);

            return this.pool[i];
        }

        return null;
    }

    die() {
        console.log(this);
        this.activeCount--;
        console.log("die", this.activeCount);
    }

    Update(dt) {
        if (this.activeCount == 0) return;
        // console.log("activeCount: " + this.activeCount);
        let cnt = 0;
        for (let i = 0; i < this.count; ++i) {
            this.pool[i].Update(dt);
            if (this.pool[i].GetActive()) ++cnt;
        }
    }
}

export { objectPool };
