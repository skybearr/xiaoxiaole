/**
 *
 * @author 
 *
 */
class EnemyView extends eui.Group{
    private wait_bg: egret.Bitmap;
    private walk_bg: egret.Bitmap;
    private bar:MyProgressBar;
    
    public width_set: number = 100;
    public height_set: number = 100;
    public vo: EnemyVO;
    
	public constructor(i:number,v:EnemyVO) {
    	  super();
    	  this.vo = v;
    }

    protected childrenCreated():void{
        super.childrenCreated();
        this.bar = new MyProgressBar("EnemyBarSkin",10,90);
        this.bar.x = (this.width_set - 90)/2 - 5;
        this.addChild(this.bar);
        this.wait();
        this.setHp(this.vo.energy);
    }
    
    public wait():void
    {
        if(this.walk_bg != null && this.walk_bg.parent != null)
        {
            this.walk_bg.parent.removeChild(this.walk_bg);
        }
        if(this.wait_bg == null)
        {
            this.wait_bg = new egret.Bitmap(RES.getRes("def_wait" + this.vo.img + "_1"));
            this.wait_bg.x = (this.width_set - this.wait_bg.texture.textureWidth)/2;
            this.wait_bg.y = this.bar.height;
        }
        this.addChild(this.wait_bg);
    }
    
    public walk():void
    {
        if(this.wait_bg != null && this.walk_bg.parent != null) {
            this.wait_bg.parent.removeChild(this.wait_bg);
        }
        if(this.walk_bg == null) {
            this.walk_bg = new egret.Bitmap(RES.getRes("def_walk" + this.vo.img + "_1"));
            this.walk_bg.x = (this.width_set - this.walk_bg.texture.textureWidth) / 2;
            this.walk_bg.y = this.bar.height;
        }
        this.addChild(this.walk_bg);
    }
    
    public setHp(n:number):void
    {
        this.bar.setProgress(n,this.vo.energy);
    }
}
