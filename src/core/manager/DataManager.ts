/**
 *
 * @author 
 *
 */
class DataManager extends egret.EventDispatcher {
    public constructor() {
        super();
    }

    private static instance: DataManager;
    public static getInstance(): DataManager {
        if(this.instance == null) {
            this.instance = new DataManager();
        }
        return this.instance;
    }
    
    private enemy_arr:Object[];
    
    public initJsonData():void
    {
        RES.getResByUrl("Definfos_json",this.DefinfosCompelte,this,RES.ResourceItem.TYPE_JSON);
    }
    
    public getEnemyVOByID(id:number):EnemyVO
    {
        var vo:EnemyVO = new EnemyVO();
        var i:number = Math.floor(Math.random() * this.enemy_arr.length);
        var o:Object = this.enemy_arr[i];
        vo.id = i+"";
        vo.lv = parseInt(o['lv']);
        vo.name = o['name'];
        vo.hp = vo.energy = parseInt(o['energy']);
        vo.type = parseInt(o['type']);
        vo.img = parseInt(o['img']);
        vo.attacktype = parseInt(o['attacktype']);
        vo.dropjb = parseInt(o['dropjb']);
        vo.exp = parseInt(o['exp']);
        vo.speed = parseInt(o['speed']);
        vo.attack = parseInt(o['attack']);
        vo.dis_step = parseInt(o['dropjb']);
        vo.position = id%6;
        return vo;
    }
    
    public getJsonData(src:string):any
    {
        switch(src){
            case "Definfos_json":
                this.enemy_arr;
            break;
        }
        return null;
    }
    
    private DefinfosCompelte(e:any):void
    {
        this.enemy_arr = e;
    }
}
