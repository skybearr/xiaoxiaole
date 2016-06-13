/**
 *
 * @author
 *
 */
var LoginMain = (function (_super) {
    __extends(LoginMain, _super);
    function LoginMain() {
        _super.call(this);
        this.skinName = "resource/assets/skins/LoginMainSkin.exml";
    }
    var d = __define,c=LoginMain,p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.btn = new StartButton("startgame_png");
        this.addChild(this.btn);
        this.btn.startTween();
        this.btn.once(egret.TouchEvent.TOUCH_TAP, this.click, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    p.click = function (e) {
        StoryLogic.getInstance().openStory();
    };
    p.clear = function () {
        if (this.btn.parent != null) {
            this.btn.parent.removeChild(this.btn);
        }
        this.btn.clear();
        this.btn = null;
    };
    return LoginMain;
}(eui.Component));
egret.registerClass(LoginMain,'LoginMain');
//# sourceMappingURL=LoginMain.js.map