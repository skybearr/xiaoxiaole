/**
 *
 * @author
 *
 */
var BaseButton = (function (_super) {
    __extends(BaseButton, _super);
    function BaseButton(srcstr) {
        _super.call(this);
        this.src_str = srcstr;
        this.init();
    }
    var d = __define,c=BaseButton,p=c.prototype;
    p.init = function () {
        this.bg = new egret.Sprite();
        this.addChild(this.bg);
        var img = RES.getRes(this.src_str);
        this.src = new egret.Bitmap(img);
        this.bg.addChild(this.src);
    };
    p.startTween = function () {
        var oldY = this.bg.y;
        var tw = egret.Tween.get(this.bg, { loop: true });
        tw.to({ y: this.bg.y + 20 }, 500)
            .to({ y: oldY }, 500).wait(100);
    };
    p.clear = function () {
        egret.Tween.removeTweens(this.bg);
        this.removeChildren();
        this.src_str = null;
        this.src = null;
    };
    return BaseButton;
}(eui.Group));
egret.registerClass(BaseButton,'BaseButton');
//# sourceMappingURL=BaseButton.js.map