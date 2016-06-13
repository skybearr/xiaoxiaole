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
        if (color === void 0) { color = 0x888888; }
        if (alpha === void 0) { alpha = 0.2; }
        var shp = new egret.Shape();
        shp.graphics.beginFill(color, alpha);
        shp.graphics.drawRect(0, 0, width, height);
        shp.graphics.endFill();
        return shp;
    };
    return ViewUtil;
}());
egret.registerClass(ViewUtil,'ViewUtil');
//# sourceMappingURL=ViewUtil.js.map