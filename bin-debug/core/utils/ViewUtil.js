/**
 *
 * @author
 *
 */
var ViewUtil = (function () {
    function ViewUtil() {
    }
    var d = __define,c=ViewUtil,p=c.prototype;
    ViewUtil.setCenter = function (view) {
        view.x = (GlobalData.GameStage.stageWidth - view.width) / 2;
        view.y = (GlobalData.GameStage.stageHeight - view.height) / 2;
    };
    ViewUtil.getShape = function (width, height, color, alpha) {
        if (width === void 0) { width = 640; }
        if (height === void 0) { height = 960; }
        if (color === void 0) { color = 0x000000; }
        if (alpha === void 0) { alpha = 0.7; }
        var shp = new egret.Shape();
        shp.graphics.beginFill(color, alpha);
        shp.graphics.drawRect(0, 0, width, height);
        shp.graphics.endFill();
        return shp;
    };
    ViewUtil.getArtNum = function (art_src, src) {
        var con = new egret.Sprite();
        var i = 0;
        while (i < src.length) {
            var texture = RES.getRes(art_src + src.charAt(i));
            var bmp = new egret.Bitmap(texture);
            bmp.x = con.width + 1;
            bmp.y = -texture.textureHeight / 2;
            con.addChild(bmp);
        }
        return con;
    };
    return ViewUtil;
}());
egret.registerClass(ViewUtil,'ViewUtil');
//# sourceMappingURL=ViewUtil.js.map