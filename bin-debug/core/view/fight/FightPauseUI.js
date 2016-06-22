/**
 *
 * @author
 *
 */
var FightPauseUI = (function (_super) {
    __extends(FightPauseUI, _super);
    function FightPauseUI() {
        _super.call(this);
        this.skinName = "resource/assets/skins/FightPauseSkin.exml";
    }
    var d = __define,c=FightPauseUI,p=c.prototype;
    p.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.init();
    };
    p.init = function () {
        this.resume_btn = new BaseButton("goback_btn_png");
        this.resume_btn.anchorOffsetX = this.resume_btn.bg.width / 2;
        this.resume_btn.x = GlobalData.GameStage_width / 2;
        this.resume_btn.verticalCenter = 60;
        this.addChild(this.resume_btn);
        this.resume_btn.startTween();
        this.initEvent();
    };
    p.initEvent = function () {
        this.resume_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resumeClick, this);
        this.back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backClick, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    p.backClick = function () {
        UIManager.getInstance().closeSecondUI(true);
        FightLogic.getInstance().dispatchEvent(new MyUIEvent(MyUIEvent.FIGHT_CLOSEUI));
    };
    p.resumeClick = function () {
        UIManager.getInstance().closeSecondUI();
    };
    p.clear = function () {
        this.resume_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.resumeClick, this);
        this.back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backClick, this);
    };
    return FightPauseUI;
}(BaseSecondUI));
egret.registerClass(FightPauseUI,'FightPauseUI');
//# sourceMappingURL=FightPauseUI.js.map