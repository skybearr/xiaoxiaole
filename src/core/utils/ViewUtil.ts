/**
 *
 * @author 
 *
 */
class ViewUtil {
	public constructor() {
	}
	
	public static setCenter(view:egret.DisplayObject):void
	{
	    view.x = (GlobalData.GameStage.stageWidth - view.width)/2;
	    view.y = (GlobalData.GameStage.stageHeight - view.height)/2;
	}
	
    public static getShape(width: number = 640,height: number = 960,color: number = 0x000000,alpha:number=0.7):egret.Shape
	{
        var shp: egret.Shape = new egret.Shape();
        shp.graphics.beginFill(color,alpha);
        shp.graphics.drawRect(0,0,width,height);
        shp.graphics.endFill();
        return shp;
	}
	
	public static getArtNum(art_src:string,src:string):egret.Sprite
	{
        var con: egret.Sprite = new egret.Sprite();
	    var i:number = 0;
	    while(i < src.length)
        {
             var texture:egret.Texture = RES.getRes(art_src + src.charAt(i));
             var bmp:egret.Bitmap = new egret.Bitmap(texture);
             bmp.x = con.width + 1;
             bmp.y = -texture.textureHeight/2;
             con.addChild(bmp);
        }
	    
	    return con;
	}
}
