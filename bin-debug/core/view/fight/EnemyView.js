/**
 *
 * @author
 *
 */
var EnemyView = (function (_super) {
    __extends(EnemyView, _super);
    function EnemyView(i, v) {
        _super.call(this);
        this.width_set = 100;
        this.height_set = 100;
        this.bottom = 0;
        this.init();
    }
    var d = __define,c=EnemyView,p=c.prototype;
    p.init = function () {
        this.bg = new eui.Image(RES.getRes("def_wait0_1"));
        this.addChild(this.bg);
    };
    return EnemyView;
}(eui.Group));
egret.registerClass(EnemyView,'EnemyView');
//# sourceMappingURL=EnemyView.js.map