/**
 *
 * @author 
 *
 */
class WallView extends egret.Sprite{
    public index:number;
    private vo:WallVO;
    private level_src:number;
    private hp:number;
    private bg_src:string;
    private bg:egret.Bitmap;
    public width_set:number = 100;
    public height_set:number = 100;
	public constructor(i:number,v:WallVO) {
        super();
        this.index = i;
        this.vo = v;
        this.level_src = Math.floor(v.lv/5) + 1;
        this.updateHp(1000);
	}
	
	public updateHp(n:number):void
	{
	    this.hp = n;
	    var s:number = n * 4 / this.vo.max_hp;
        var src: string = "wall_wall"+this.level_src+"_"+s;
        src = "wall_wall1_1";
	    if(this.bg == null || this.bg_src != src)
        {
            this.bg_src = src;
	        this.changeBg();
	    }
	}
	
	private changeBg():void
	{
	    if(this.bg != null && this.bg.parent != null){
	        this.bg.parent.removeChild(this.bg);
	    }
	    this.bg = new egret.Bitmap(RES.getRes(this.bg_src));
        this.bg.scaleX = this.bg.scaleY = 2;
	    this.addChild(this.bg);
	}
}
