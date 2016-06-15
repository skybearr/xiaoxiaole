/**
 *
 * @author
 *
 */
var MenuUI = (function (_super) {
    __extends(MenuUI, _super);
    function MenuUI() {
        _super.call(this);
        this.skinName = "MainMenuSkin";
    }
    var d = __define,c=MenuUI,p=c.prototype;
    p.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.back_btn = new BaseButton("menubtnbg_png");
        this.back_btn.x = 0;
        this.back_btn.y = -30;
        var bmp = new egret.Bitmap(RES.getRes("fanhui_png"));
        bmp.x = (this.back_btn.bg.width - bmp.width) / 2;
        bmp.y = 238;
        this.back_btn.bg.addChild(bmp);
        this.addChild(this.back_btn);
        this.back_btn.startTween();
        this.back_btn.once(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
        var tw = egret.Tween.get(this.shop_bg, { loop: true });
        tw.to({ rotation: this.rotation + 1000 }, 3000);
    };
    p.clickBack = function (e) {
        var tw = egret.Tween.get(this);
        tw.to({ x: -this.width }, 300).call(this.tweenFinish, this);
    };
    p.tweenFinish = function () {
        if (this.parent != null) {
            this.parent.removeChild(this);
            StoryLogic.getInstance().dispatchEvent(new MyUIEvent(MyUIEvent.CLOSE_MENU));
        }
    };
    p.clear = function (e) {
    };
    return MenuUI;
}(BasePopUI));
egret.registerClass(MenuUI,'MenuUI');
//# sourceMappingURL=MenuUI.js.map