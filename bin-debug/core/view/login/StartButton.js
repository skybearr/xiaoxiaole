/**
 *
 * @author
 *
 */
var StartButton = (function (_super) {
    __extends(StartButton, _super);
    function StartButton(src_str) {
        _super.call(this, src_str);
    }
    var d = __define,c=StartButton,p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.anchorOffsetX = this.bg.width / 2;
        this.anchorOffsetY = this.bg.height;
        this.bottom = 50;
        this.horizontalCenter = 0;
    };
    return StartButton;
}(BaseButton));
egret.registerClass(StartButton,'StartButton');
//# sourceMappingURL=StartButton.js.map