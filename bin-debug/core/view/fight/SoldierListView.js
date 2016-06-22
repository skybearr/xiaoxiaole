/**
 *
 * @author
 *
 */
var SoldierListView = (function (_super) {
    __extends(SoldierListView, _super);
    function SoldierListView(v) {
        _super.call(this);
        this.vo = v;
        this.touchEnabled = true;
        if (this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG) {
            var s = new SoldierView(this.vo.gem_type);
            s.scaleX = s.scaleY = 2;
            this.addChild(s);
        }
        else {
            for (var i = 0; i < this.vo.data.length; i++) {
                var s = new SoldierView(this.vo.gem_type);
                if (this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_HORIZONTAL) {
                    s.x = (s.width_set + 2) * i;
                }
                else {
                    s.y = (s.height_set + 10) * i;
                }
                this.addChild(s);
            }
        }
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    }
    var d = __define,c=SoldierListView,p=c.prototype;
    p.change = function () {
        this.removeChildren();
        this.fly = FightLogic.getInstance().getMovieClip("fly");
        if (this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG) {
            this.fly.scaleX = this.scaleY = 2;
        }
        this.fly.frameRate = 12;
        this.fly.play(-1);
        this.addChild(this.fly);
    };
    p.click = function () {
        FightLogic.getInstance().soldierFight(this.vo);
    };
    p.clear = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        this.removeChildren();
        if (this.fly != null) {
            this.fly.stop();
            this.fly = null;
        }
    };
    return SoldierListView;
}(egret.Sprite));
egret.registerClass(SoldierListView,'SoldierListView');
//# sourceMappingURL=SoldierListView.js.map