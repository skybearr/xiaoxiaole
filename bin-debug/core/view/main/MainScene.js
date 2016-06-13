/**
 *
 * @author
 *
 */
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        _super.call(this);
        //        this.skinName = "resource/assets/skins/MainSceneSkin.exml";
        this.once(egret.Event.ADDED_TO_STAGE, this.onStage, this);
    }
    var d = __define,c=MainScene,p=c.prototype;
    p.onStage = function (e) {
        this.initData();
        this.initUI();
        this.initEvent();
    };
    p.initData = function () {
    };
    p.initUI = function () {
    };
    p.initEvent = function () {
    };
    p.clear = function () {
    };
    return MainScene;
}(eui.Component));
egret.registerClass(MainScene,'MainScene');
//# sourceMappingURL=MainScene.js.map