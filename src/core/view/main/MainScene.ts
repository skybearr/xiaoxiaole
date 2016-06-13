/**
 *
 * @author 
 *
 */
class MainScene extends eui.Component{
    private sceneCon:eui.Group;
	public constructor() {
    	  super();
//        this.skinName = "resource/assets/skins/MainSceneSkin.exml";
        this.once(egret.Event.ADDED_TO_STAGE,this.onStage,this);
	}
	
	
	private onStage(e:egret.Event):void
	{
    	  this.initData();
	    this.initUI();
	    this.initEvent();
	}
	
	private initData():void
	{
	    
	}
	
	private initUI():void
	{
        
    	 
	}
	
	private initEvent():void
	{
	    
	}
	
	protected clear():void
	{
	    
	}
	
}
