/**
 *
 * @author 
 *
 */
class MenuUI extends BasePopUI{
    private back_btn: BaseButton;
    private shop_bg:eui.Image;
    
	public constructor() {
    	  super();
        this.skinName = "MainMenuSkin";
	}
	
    protected childrenCreated():void{
	    super.childrenCreated();
	    
        this.back_btn = new BaseButton("menubtnbg_png");
        this.back_btn.x = 0;
        this.back_btn.y = -30;
        var bmp = new egret.Bitmap(RES.getRes("fanhui_png"));
        bmp.x = (this.back_btn.bg.width - bmp.width) / 2;
        bmp.y = 238;
        this.back_btn.bg.addChild(bmp);
        this.addChild(this.back_btn);
        this.back_btn.startTween();
        this.back_btn.once(egret.TouchEvent.TOUCH_TAP,this.clickBack,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
        
        var tw = egret.Tween.get(this.shop_bg,{loop:true});
        tw.to({rotation:this.rotation + 1000},3000);
	}
	
	private clickBack(e:egret.TouchEvent):void
	{
	     var tw = egret.Tween.get(this);
	     tw.to({x:-this.width},300).call(this.tweenFinish,this);
	}
	
	private tweenFinish():void
	{
	    if(this.parent != null)
        {
            this.parent.removeChild(this);
            StoryLogic.getInstance().dispatchEvent(new MyUIEvent(MyUIEvent.CLOSE_MENU));
        }
	}
	
	public clear(e:egret.Event):void
	{
	    
	}
}
