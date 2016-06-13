/**
 *
 * @author
 *
 */
var LoadingInGameUI = (function (_super) {
    __extends(LoadingInGameUI, _super);
    function LoadingInGameUI() {
        _super.call(this);
        this.bar_width_min = 50;
        this.bar_width_max = 338;
        this.skinName = "resource/assets/skins/LoadingSkin.exml";
    }
    var d = __define,c=LoadingInGameUI,p=c.prototype;
    p.childrenCreated = function () {
        this.reset();
    };
    p.reset = function () {
        this.progress_txt.text = "";
        this.progress_bar.width = this.bar_width_min;
        this.progress_bar.mask = this.progress_bar_mask;
    };
    p.setText = function (str) {
    };
    p.setProgress = function (current, total) {
        this.progress_bar.width = (current / total) * this.bar_width_max;
        this.progress_txt.text = "资源加载中..." + current + "/" + total;
    };
    p.clear = function () {
        this.reset();
    };
    return LoadingInGameUI;
}(eui.Component));
egret.registerClass(LoadingInGameUI,'LoadingInGameUI');
//# sourceMappingURL=LoadingInGameUI.js.map