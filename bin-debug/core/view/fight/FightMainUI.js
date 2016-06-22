/**
 *
 * @author
 *
 */
var FightMainUI = (function (_super) {
    __extends(FightMainUI, _super);
    function FightMainUI() {
        _super.call(this);
        this.gem_move_time = 300;
        this.skinName = "resource/assets/skins/FightBgSkin.exml";
    }
    var d = __define,c=FightMainUI,p=c.prototype;
    p.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.init();
    };
    p.init = function () {
        this.prop_btn_arr = [];
        this.prop_num_arr = [];
        this.wall_arr = [];
        this.gem_arr = [];
        this.enemy_arr = [];
        this.enemy_con = new egret.Sprite();
        this.enemy_con.y = 0;
        this.addChildAt(this.enemy_con, 2);
        this.wall_con = new egret.Sprite();
        this.wall_con.y = 430;
        this.addChild(this.wall_con);
        this.gem_con = new egret.Sprite();
        this.gem_con.y = 450;
        this.addChild(this.gem_con);
        this.initWall();
        this.initGem();
        this.initEnemy();
        this.initEvent();
        FightLogic.getInstance().checkAllGemCompose();
    };
    p.initWall = function () {
        for (var i = 0; i < 6; i++) {
            var wall = new WallView(i, new WallVO());
            wall.x = wall.width_set * i;
            wall.y = -wall.height_set;
            this.wall_arr.push(wall);
            this.wall_con.addChild(wall);
        }
        this.wall_con.x = (this.width - this.wall_con.width) / 2;
    };
    p.initGem = function () {
        var arr = FightLogic.getInstance().getGemArr();
        for (var i = 0; i < arr.length; i++) {
            var vo = new GemVO();
            vo.index = i;
            vo.type = arr[i];
            var gem = new GemView(i, vo);
            gem.x = (gem.width_set + 2) * (i % 6);
            gem.y = (gem.height_set + 10) * Math.floor(i / 6);
            this.gem_arr.push(gem);
            this.gem_con.addChild(gem);
        }
        this.gem_con.x = (this.width - this.gem_con.width) / 2;
    };
    p.initEnemy = function () {
        for (var i = 0; i < 120; i++) {
            var enemy = new EnemyView(i, new EnemyVO());
            enemy.x = enemy.width_set * (i % 6);
            enemy.y = 60 - FightLogic.getInstance().step_height * Math.floor(i / 6);
            this.enemy_arr.push(enemy);
            this.enemy_con.addChild(enemy);
        }
    };
    p.initEvent = function () {
        this.pause_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pauseClick, this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_CLOSEUI, this.closeUI, this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_GEM_OPERATOR, this.operatorGem, this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_COMPOSE, this.soldierCompose, this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_ATTACK, this.soldierAttack, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    p.soldierAttack = function (e) {
        var self = this;
        var soldier = this.getSoldier(e.data);
        var tw = egret.Tween.get(soldier);
        var f = function () {
            if (soldier != null && soldier.parent != null) {
                soldier.parent.removeChild(soldier);
            }
        };
        var a = function () {
            soldier.change();
            var tw = egret.Tween.get(soldier);
            tw.to({ y: 0 }, 1000).call(f, self);
        };
        var t = (soldier.y - 330) * 2;
        tw.to({ y: 330 }, t).call(a, self);
    };
    p.getSoldier = function (vo) {
        for (var i = 0; i < this.soldier_arr.length; i++) {
            var soldier = this.soldier_arr[i];
            if (soldier.vo.id == vo.id) {
                return soldier;
            }
        }
        return null;
    };
    p.soldierCompose = function (e) {
        if (this.soldier_arr == null) {
            this.soldier_arr = [];
        }
        var arr = e.data;
        for (var i = 0; i < arr.length; i++) {
            var vo = arr[i];
            var soldier = new SoldierListView(vo);
            soldier.x = this.gem_con.x + this.gem_arr[vo.data[0]].x;
            soldier.y = this.gem_con.y + this.gem_arr[vo.data[0]].y;
            this.addChild(soldier);
            this.soldier_arr.push(soldier);
            this.setGemDisappear(vo.data);
        }
    };
    /**合成战士以后原来位置的宝石暂时消失*/
    p.setGemDisappear = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            this.gem_arr[arr[i]].setAppear(false);
        }
    };
    /**宝石操作*/
    p.operatorGem = function (e) {
        var type = e.data.type;
        var last = e.data.last;
        var target = e.data.target;
        if (last > -1) {
            this.last_gem = this.gem_arr[last];
        }
        if (target > -1) {
            this.target_gem = this.gem_arr[target];
        }
        if (type == FightLogic.GEM_OPERATOR_CLICK) {
            if (this.last_gem != null) {
                this.last_gem.startTween(false);
            }
            if (this.target_gem != null) {
                this.target_gem.startTween(true);
            }
        }
        else if (type == FightLogic.GEM_OPERATOR_CLICK_CANCEL) {
            if (this.last_gem != null) {
                this.last_gem.startTween(false);
            }
        }
        else if (type == FightLogic.GEM_OPERATOR_MOVE) {
            if (this.last_gem != null && this.target_gem != null) {
                this.gemMove();
            }
        }
        else if (type == FightLogic.GEM_OPERATOR_NEW_CLICK) {
            if (this.last_gem != null) {
                this.last_gem.startTween(false);
            }
            if (this.target_gem != null) {
                this.target_gem.startTween(true);
            }
        }
    };
    p.gemMove = function () {
        this.last_gem.startTween(false);
        var lastX = this.last_gem.x;
        var lastY = this.last_gem.y;
        var tarX = this.target_gem.x;
        var tarY = this.target_gem.y;
        var t1 = egret.Tween.get(this.last_gem);
        var t2 = egret.Tween.get(this.target_gem);
        FightLogic.getInstance().is_gem_move = true;
        t1.to({ x: tarX, y: tarY }, this.gem_move_time).call(this.gemMoveFinish, this);
        t2.to({ x: lastX, y: lastY }, this.gem_move_time);
    };
    p.gemMoveFinish = function () {
        FightLogic.getInstance().is_gem_move = false;
        //宝石数组2个交换
        this.gem_arr[this.last_gem.vo.index] = this.target_gem;
        this.gem_arr[this.target_gem.vo.index] = this.last_gem;
        //2个宝石的索引交换
        var i = this.last_gem.vo.index;
        this.last_gem.setIndex(this.target_gem.vo.index);
        this.target_gem.setIndex(i);
        //因为已经交换过了，这里要填原来的
        FightLogic.getInstance().changeGem(this.target_gem.vo.index, this.last_gem.vo.index);
    };
    p.pauseClick = function () {
        UIManager.getInstance().openSecondUI(new FightPauseUI());
    };
    p.closeUI = function () {
        if (this.parent != null) {
            this.parent.removeChild(this);
        }
    };
    p.clearGems = function () {
    };
    p.clear = function () {
        this.pause_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.pauseClick, this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_CLOSEUI, this.closeUI, this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_GEM_OPERATOR, this.operatorGem, this);
    };
    return FightMainUI;
}(eui.Component));
egret.registerClass(FightMainUI,'FightMainUI');
//# sourceMappingURL=FightMainUI.js.map