/**
 *
 * @author
 *
 */
var BaseSecondUI = (function (_super) {
    __extends(BaseSecondUI, _super);
    function BaseSecondUI() {
        _super.call(this);
        //动画需要
        this.anchorOffsetX = GlobalData.GameStage_width / 2;
        this.anchorOffsetY = GlobalData.GameStage_height / 2;
    }
    var d = __define,c=BaseSecondUI,p=c.prototype;
    return BaseSecondUI;
}(eui.Component));
egret.registerClass(BaseSecondUI,'BaseSecondUI');
//# sourceMappingURL=BaseSecondUI.js.map