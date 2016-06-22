/**
 *
 * @author
 *
 */
var WallView = (function (_super) {
    __extends(WallView, _super);
    function WallView(i, v) {
        _super.call(this);
        this.width_set = 100;
        this.height_set = 100;
        this.index = i;
        this.vo = v;
        this.level_src = Math.floor(v.lv / 5) + 1;
        this.updateHp(1000);
    }
    var d = __define,c=WallView,p=c.prototype;
    p.updateHp = function (n) {
        this.hp = n;
        var s = n * 4 / this.vo.max_hp;
        var src = "wall_wall" + this.level_src + "_" + s;
        src = "wall_wall1_1";
        if (this.bg == null || this.bg_src != src) {
            this.bg_src = src;
            this.changeBg();
        }
    };
    p.changeBg = function () {
        if (this.bg != null && this.bg.parent != null) {
            this.bg.parent.removeChild(this.bg);
        }
        this.bg = new egret.Bitmap(RES.getRes(this.bg_src));
        this.bg.scaleX = this.bg.scaleY = 2;
        this.addChild(this.bg);
    };
    return WallView;
}(egret.Sprite));
egret.registerClass(WallView,'WallView');
//# sourceMappingURL=WallView.js.map