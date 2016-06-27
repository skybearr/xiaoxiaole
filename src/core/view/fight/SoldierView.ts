/**
 *
 * @author 
 *
 */
class SoldierView extends egret.Sprite{
    
    private skill:egret.MovieClip;
    private soldier:egret.MovieClip;
    private fly: egret.MovieClip;
    
    public width_set:number = 100;
    public height_set:number = 90;
    
	public constructor(gem:number) {
    	super();
    	this.init();
    	this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
	}
	
    
	public changeFly():void
	{
        this.removeChildren();
        this.soldier.stop();
        
        this.fly = FightLogic.getInstance().getMovieClip("fly");
        this.fly.frameRate = 12;
        this.fly.play(-1);
        this.addChild(this.fly);
	}
	
	private init():void
	{
//        this.skill = FightLogic.getInstance().getMovieClip("skill");
//        this.skill.gotoAndStop(4);
//        this.skill.x = (this.width_set - this.skill.width)/2;
//        this.skill.y = (this.height_set - this.skill.height)/2;
        this.soldier = FightLogic.getInstance().getMovieClip("soldier");
        this.soldier.x = (this.width_set - this.soldier.width)/2;
        this.soldier.y = (this.height_set - this.soldier.height)/2;
        this.soldier.frameRate = 12;
        
//        this.skill.play(-1);
        this.soldier.play(-1);
//        this.addChild(this.skill);
        this.addChild(this.soldier);
	}
	
	private clear():void
	{
    	this.removeChildren();
	    this.soldier.stop();
	    if(this.skill != null){
	        this.skill.stop();
	    }
	    if(this.fly != null){
	        this.fly.stop();
	    }
	    this.fly = null;
	    this.skill = null;
	    this.soldier = null;
	}
}
