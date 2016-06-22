/**
 *
 * @author
 *
 */
var BaseFirstUI = (function (_super) {
    __extends(BaseFirstUI, _super);
    function BaseFirstUI() {
        _super.call(this);
        this.addChild(ViewUtil.getShape(GlobalData.GameStage_width, GlobalData.GameStage_height, 0x000000, 0));
        this.anchorOffsetX = GlobalData.GameStage_width / 2;
        this.anchorOffsetY = GlobalData.GameStage_height / 2;
        this.verticalCenter = this.horizontalCenter = 0;
    }
    var d = __define,c=BaseFirstUI,p=c.prototype;
    return BaseFirstUI;
}(eui.Component));
egret.registerClass(BaseFirstUI,'BaseFirstUI');
//# sourceMappingURL=BaseFirstUI.js.map