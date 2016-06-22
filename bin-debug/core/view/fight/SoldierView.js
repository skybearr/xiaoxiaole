/**
 *
 * @author
 *
 */
var SoldierView = (function (_super) {
    __extends(SoldierView, _super);
    function SoldierView(gem) {
        _super.call(this);
        this.width_set = 100;
        this.height_set = 90;
        this.init();
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    }
    var d = __define,c=SoldierView,p=c.prototype;
    p.init = function () {
        //        this.skill = FightLogic.getInstance().getMovieClip("skill");
        //        this.skill.gotoAndStop(4);
        //        this.skill.x = (this.width_set - this.skill.width)/2;
        //        this.skill.y = (this.height_set - this.skill.height)/2;
        this.soldier = FightLogic.getInstance().getMovieClip("soldier");
        this.soldier.x = (this.width_set - this.soldier.width) / 2;
        this.soldier.y = (this.height_set - this.soldier.height) / 2;
        this.soldier.frameRate = 12;
        //        this.skill.play(-1);
        this.soldier.play(-1);
        //        this.addChild(this.skill);
        this.addChild(this.soldier);
    };
    p.clear = function () {
        this.removeChildren();
        this.soldier.stop();
        //	    this.skill.stop();
        this.skill = null;
        this.soldier = null;
    };
    return SoldierView;
}(egret.Sprite));
egret.registerClass(SoldierView,'SoldierView');
//# sourceMappingURL=SoldierView.js.map