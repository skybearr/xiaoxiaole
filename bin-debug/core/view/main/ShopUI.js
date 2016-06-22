/**
 *
 * @author
 *
 */
var ShopUI = (function (_super) {
    __extends(ShopUI, _super);
    function ShopUI() {
        _super.call(this);
        this.skinName = "resource/assets/skins/ShopSkin.exml";
    }
    var d = __define,c=ShopUI,p=c.prototype;
    p.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.back_btn = new BaseButton("goback_btn_png");
        this.back_btn.anchorOffsetX = this.back_btn.bg.width / 2;
        this.back_btn.x = GlobalData.GameStage_width / 2;
        this.back_btn.y = GlobalData.GameStage_height - 300; //this.back_btn.bg.height;
        this.addChild(this.back_btn);
        this.back_btn.startTween();
        this.initEvent();
    };
    p.initEvent = function () {
        this.back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    p.clickBack = function () {
        SoundManager.getInstance().playEffectSound();
        UIManager.getInstance().closeSecondUI();
    };
    p.clear = function () {
        this.back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
    };
    return ShopUI;
}(BaseSecondUI));
egret.registerClass(ShopUI,'ShopUI');
//# sourceMappingURL=ShopUI.js.map