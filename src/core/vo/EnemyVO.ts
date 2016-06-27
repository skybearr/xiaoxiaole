/**
 *
 * @author 
 *
 */
class EnemyVO {
	public constructor() {
        FightLogic.getInstance().soldier_max_id++;
        this.uuid = FightLogic.getInstance().soldier_max_id;
	}
	
	public id:string;
    public uuid:number;
	public lv:number;
	public name:string;
	/***/
	public type:number;
	/**血量*/
	public energy:number;
	public img:number;
	public attacktype:number;
	public dropjb:number;
	public exp:number;
	public speed:number;
	/**攻击力*/
	public attack:number;
	
	/**当前剩余的生命值*/
	public hp:number;
	/**距离城墙的距离，单位：步*/
	public dis_step:number;
	/**位置 1-6*/
	public position:number;
	/**自身状态 0正常，可以走  1被冰封，无法移动3回合 2中毒（持续少血）4前方有天使拦住无法走动*/
	public state:number = 0;
}
