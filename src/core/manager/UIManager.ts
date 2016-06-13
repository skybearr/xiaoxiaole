/**
 *
 * @author 
 *
 */
class UIManager extends egret.EventDispatcher{
	public constructor() {
    	super();
	}
	
	private static instance:UIManager;
	public static getInstance():UIManager
	{
        if(this.instance == null)
        {
            this.instance = new UIManager();
        }
        return this.instance;
	}
	
	private ui_class_arr:Array<any> = null;
    public static CLASS_UI_INDEX_LOGOANIMATION: number = 0;
    public static CLASS_UI_INDEX_LOGINMAIN:     number = 1;
    public static CLASS_UI_INDEX_STORY:         number = 2;
    public static CLASS_UI_INDEX_FIGHT:         number = 3;
    
	
	/**主容器*/
    public mainCon: egret.DisplayObjectContainer;
	
	/**全屏剧情/战斗*/
	public storyCon:egret.DisplayObjectContainer;
	
	/***/
	
	/**世界公告*/
	public broadcastCon:egret.DisplayObjectContainer;
	
	/**网络请求loading*/
	public loadingCon:egret.DisplayObjectContainer;
	
	
	/**正在进行UI打开关闭动画，不能操作*/
	private is_ui_tween:boolean;
	
    public startGame():void
	{
    	  this.initUIClass();  
    	
	    this.mainCon = new egret.DisplayObjectContainer();
	    this.broadcastCon = new egret.DisplayObjectContainer();
        this.storyCon = new egret.DisplayObjectContainer();
	    this.loadingCon = new egret.DisplayObjectContainer();
	    
	    if(GlobalData.GameStage != null)
        {  
            GlobalData.GameStage.addChild(this.mainCon);
            GlobalData.GameStage.addChild(this.broadcastCon);
            GlobalData.GameStage.addChild(this.storyCon);
            GlobalData.GameStage.addChild(this.loadingCon);
            
            this.openFirstUI(UIManager.CLASS_UI_INDEX_LOGOANIMATION);
	    }
	}
	
	private initUIClass():void
	{
        this.ui_class_arr = [LogoAnimation,LoginMain,StoryUI];
	}

	
	/**打开一级界面
	 * @param index 界面的索引
	 * @param tweenType 界面进出的动画类型
	 * */
    public openFirstUI(index: number,tweenType:number=0):void{
        
        if(this.is_ui_tween)
        {
            console.log("正在打开界面，禁止操作");
            return;
        }
        this.is_ui_tween = true;
        //只接受一个一级界面存在，所以当大于一个的时候，先移除底下多余的
        while(this.mainCon.numChildren > 1) {
            this.mainCon.removeChildAt(0);
        }
        
        /**如果选择随机动画，则选择一种非0的类型*/
        if(tweenType == TweenManager.TWEEN_UI_RANDOM) {
            tweenType = 1 + Math.floor(Math.random()) * 3;
        }
        
        //如果第一次添加 没有其他界面，直接加上UI
        if(this.mainCon.numChildren == 0)
        {
            this.realOpenFirst(index,tweenType);
        }
        else
        {
            var extra:number = Math.ceil(Math.random() * 5);
            var last_ui = this.mainCon.getChildAt(0);
            TweenManager.getInstance().uiDisappearTween(last_ui,tweenType,extra,null,this);
            this.realOpenFirst(index,tweenType,extra);
        }
	}
	
	/**
	 * 
	 * @param extra 二级tween的类型，需与消失一致*/
    private realOpenFirst(index:number,type:number,extra:number=0):void
	{
        if(this.ui_class_arr[index] != null)
        {
            var ui = new this.ui_class_arr[index]() as eui.Component;
            this.mainCon.addChild(ui);
            if(type == TweenManager.TWEEN_UI_NONE)
            {
                this.openFirstUIFinish();
            }
            else
            {
                this.openFirstUIFinish.bind(this);
                TweenManager.getInstance().uiAppearTween(ui,type,extra,this.openFirstUIFinish,this);
            }
        }
	    else
	    {
	        console.log("ui索引错误");
	    }
	}
	
	private openFirstUIFinish():void
	{
    	//移除之前的UI
        while(this.mainCon.numChildren > 1) {
            this.mainCon.removeChildAt(0);
        }
	    this.is_ui_tween = false;
	}
	
	
    public openPopUI():void
    {
        
    }
	
	/**系统提示 
	 * @param str
	 * @param type 类型 0悬浮提示  1弹出窗  2不再提示*/
	public popMessage(str:string,type:number=1):void
	{
	    console.log(str);
	}
}
