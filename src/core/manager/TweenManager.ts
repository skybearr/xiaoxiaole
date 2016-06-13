/**
 *
 * @author 
 *
 */
class TweenManager {
	public constructor() {
	}
	
    private static instance: TweenManager;
    public static getInstance(): TweenManager {
        if(this.instance == null) {
            this.instance = new TweenManager();
        }
        return this.instance;
    }
    
    /**随机取 非0的任意一种*/
    public static TWEEN_UI_RANDOM:          number = -1;
    public static TWEEN_UI_NONE:            number = 0;
    public static TWEEN_UI_MOVE:            number = 1;
    public static TWEEN_UI_SCALE:           number = 2;
    public static TWEEN_UI_SCALE_ROTATION:  number = 3;

    private tween_ui_time: number = 500;
    
    public uiDisappearTween(ui:egret.DisplayObject,type:number,extra:number,callback:Function,thisObj:any):void
    {
        var tw = egret.Tween.get(ui);
        var xx: number = 0;
        var yy: number = 0;
        if(type == TweenManager.TWEEN_UI_MOVE)//平移
        {
            if(extra == 0)//向右平移
            {
                xx = GlobalData.GameStage_width;
            }
            else if(extra == 1) //向下平移
            {
                yy = GlobalData.GameStage_height;
            }
            else if(extra == 2)//向左平移
            {
                xx = -GlobalData.GameStage_width;
            }
            else //向上平移
            {
                yy = -GlobalData.GameStage_height;
            }
            if(callback == null)
            {
                tw.to({ x: xx,y: yy },this.tween_ui_time);
            }else
            {
                tw.to({ x: xx,y: yy },this.tween_ui_time).call(callback,thisObj);
            }
        }
        else if(type == TweenManager.TWEEN_UI_SCALE)//缩放：缩放完成以后原来界面才消失
        {
            tw.to({ alpha: 0 },this.tween_ui_time);
            if(callback == null) 
            {
                tw.to({ alpha: 0 },this.tween_ui_time);
            } else {
                tw.to({ alpha: 0 },this.tween_ui_time).call(callback,thisObj);
            }
        }
        else if(type == TweenManager.TWEEN_UI_SCALE_ROTATION) {
            if(extra == 0)//向右上角
            {
                xx = GlobalData.GameStage_width;
                yy = -GlobalData.GameStage_height;
            }
            else if(extra == 1) //向右下平移
            {
                xx = GlobalData.GameStage_width;
                yy = GlobalData.GameStage_height;
            }
            else if(extra == 2)//向左下平移
            {
                xx = -GlobalData.GameStage_width;
                yy = GlobalData.GameStage_height;
            }
            else //向左上平移
            {
                xx = -GlobalData.GameStage_width;
                yy = -GlobalData.GameStage_height;
            }
           
            if(callback == null) {
                tw.to({ x: xx,y: yy,scaleX: 0.01,scaleY: 0.01,rotation: 720 },this.tween_ui_time);
            } else {
                tw.to({ x: xx,y: yy,scaleX: 0.01,scaleY: 0.01,rotation: 720 },this.tween_ui_time).call(callback,thisObj);
            }
        }
    }
    
    public uiAppearTween(ui:egret.DisplayObject,type:number,extra:number,callback:Function,thisObj:any):void
    {
        var tw = egret.Tween.get(ui);
        //先根据类型初始化状态 
        if(type == TweenManager.TWEEN_UI_MOVE)//平移
        {
            if(extra == 0)//向右平移
            {
                ui.x = -GlobalData.GameStage_width;
            }
            else if(extra == 1) //向下平移
            {
                ui.y = -GlobalData.GameStage_height;
            }
            else if(extra == 2)//向左平移
            {
                ui.x = GlobalData.GameStage_width;
            }
            else //向上平移
            {
                ui.y = GlobalData.GameStage_height;
            }
            if(callback == null) {
                tw.to({ x: 0,y: 0 },this.tween_ui_time);
            } else {
                tw.to({ x: 0,y: 0 },this.tween_ui_time).call(callback,thisObj);
            }
            
        }
        else if(type == TweenManager.TWEEN_UI_SCALE)//缩放：缩放完成以后原来界面才消失
        {
            if(extra == 0)//从正中间出来
            {
                //中间坐标不用变
            }
            else if(extra == 1) {//从右方出来
                ui.x = GlobalData.GameStage_height / 2;
            }
            else if(extra == 2)//从下方出来
            {
                ui.y = GlobalData.GameStage_width / 2;
            }
            else if(extra == 2)//从左方出来
            {
                ui.x = -GlobalData.GameStage_width / 2;
            }
            else {//从上方出来
                ui.y = -GlobalData.GameStage_height / 2;
            }
            ui.scaleX = ui.scaleY = 0.01;
            if(callback == null) {
                tw.to({ x: 0,y: 0,scaleX: 1,scaleY: 1,alpha: 1 },this.tween_ui_time);
            } else {
                tw.to({ x: 0,y: 0,scaleX: 1,scaleY: 1,alpha: 1 },this.tween_ui_time).call(callback,thisObj);
            }
           
        }
        else if(type == TweenManager.TWEEN_UI_SCALE_ROTATION)//旋转
        {
            ui.alpha = 0;
            
            if(callback == null) {
                tw.to({ alpha: 1 },this.tween_ui_time);
            } else {
                tw.to({ alpha: 1 },this.tween_ui_time).call(callback,thisObj);
            }
        }

    }
}
