/**
 *
 * @author 
 *
 */
class EnemyView extends eui.Group{
    private bg: eui.Image;
    
    public width_set: number = 100;
    public height_set: number = 100;
    public vo: EnemyVO;
    
	public constructor(i:number,v:EnemyVO) {
    	  super();
    	  this.bottom = 0;
        this.init();
    }

    private init(): void {
        this.bg = new eui.Image(RES.getRes("def_wait0_1"));
        this.addChild(this.bg);
    }
}
