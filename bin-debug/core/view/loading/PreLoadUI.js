/**
 *
 * @author
 *
 */
var PreLoadUI = (function (_super) {
    __extends(PreLoadUI, _super);
    function PreLoadUI() {
        _super.call(this);
        this.createView();
    }
    var d = __define,c=PreLoadUI,p=c.prototype;
    p.createView = function () {
        this.bg = new egret.Bitmap();
        this.bg.texture = RES.getRes("logo_png");
        this.addChild(this.bg);
        ViewUtil.setCenter(this.bg);
    };
    return PreLoadUI;
}(egret.Sprite));
egret.registerClass(PreLoadUI,'PreLoadUI');
//# sourceMappingURL=PreLoadUI.js.map