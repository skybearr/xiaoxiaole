/**
 *
 * @author 
 *
 */
class SoldierVO {
	public constructor() {
        FightLogic.getInstance().soldier_max_id ++;
    	  this.id = FightLogic.getInstance().soldier_max_id;
	}
	
	public id:number;
	/**战士的类型*/
	public derection:number;
	/**合成的位置索引数组*/
	public data:number[];
	/**宝石类型*/
	public gem_type:number;
	
	public index_in_arr:number;
}
