/**
 *
 * @author
 *
 */
var FightLogic = (function (_super) {
    __extends(FightLogic, _super);
    function FightLogic() {
        _super.call(this);
        /**怪物移动的最小距离*/
        this.step_height = 15;
        /**当前选中的宝石 -1表示没有点击*/
        this.current_select_gem = -1;
        /**宝石交换中*/
        this.is_gem_move = false;
        /**当前战士数组*/
        this.soldier_arr = [];
    }
    var d = __define,c=FightLogic,p=c.prototype;
    FightLogic.getInstance = function () {
        if (this.instance == null) {
            this.instance = new FightLogic();
        }
        return this.instance;
    };
    /**初始化检测所有宝石是否有合成*/
    p.checkAllGemCompose = function () {
        var arr = [];
        this.soldier_arr = [];
        for (var i = 0; i < this.gem_arr.length; i++) {
            var vo = this.checkCompose(i);
            if (vo != null) {
                arr.push(vo);
                console.log(vo.data);
            }
        }
        if (arr.length > 0) {
            var event = new MyUIEvent(MyUIEvent.FIGHT_SOLDIER_COMPOSE);
            event.data = arr;
            this.dispatchEvent(event);
        }
    };
    p.checkHasSoldier = function (arr) {
        if (arr == null) {
            return false;
        }
        for (var i = 0; i < this.soldier_arr.length; i++) {
            var data = this.soldier_arr[i].data;
            for (var j = 0; j < data.length; j++) {
                if (arr.indexOf(data[j]) != -1) {
                    return true;
                }
            }
        }
        return false;
    };
    /**宝石移动完成后位置互换*/
    p.changeGem = function (last, target) {
        var n = this.gem_arr[last];
        this.gem_arr[last] = this.gem_arr[target];
        this.gem_arr[target] = n;
        var v1 = this.checkCompose(last);
        var v2 = this.checkCompose(target);
        var arr = [];
        if (v1 != null) {
            arr.push(v1);
        }
        if (v2 != null) {
            arr.push(v2);
        }
        if (arr.length > 0) {
            var event = new MyUIEvent(MyUIEvent.FIGHT_SOLDIER_COMPOSE);
            event.data = arr;
            this.dispatchEvent(event);
        }
    };
    /**检测是否有合成战士，返回一个合成的数组*/
    p.checkCompose = function (index) {
        if (this.soldier_arr == null) {
            this.soldier_arr = [];
        }
        var vo = new SoldierVO();
        vo.id = index;
        var arr = [];
        //优先检测周围方块
        var arr1 = [index, index + 1, index + 6, index + 7]; //要检查4次 分别为包含当前索引的周围4组方块
        var index1 = 0;
        while (index1 < 4) {
            var k = arr1[index1];
            var a = this.gem_arr[k - 7];
            var b = this.gem_arr[k - 6];
            var c = this.gem_arr[k - 1];
            var d = this.gem_arr[k];
            if (a == b && b == c && c == d) {
                arr = [a, b, c, d];
                vo.data = [k - 7, k - 6, k - 1, k];
                vo.gem_type = a;
                vo.derection = FightLogic.SOLDIER_LIST_TYPE_BIG;
                break;
            }
            index1++;
        }
        if (arr.length < 4 || this.checkHasSoldier(vo.data)) {
            arr = [];
        }
        else {
            this.soldier_arr.push(vo);
            return vo;
        }
        //检测横排
        var count = index - index % 6;
        arr.push(count);
        while (count % 6 < 5) {
            if (this.gem_arr[count] == this.gem_arr[count + 1]) {
                arr.push(count + 1);
            }
            else {
                if (arr.length >= 4) {
                    break;
                }
                arr = [];
                arr.push(count + 1);
            }
            count++;
        }
        if (arr.length < 4 || arr.indexOf(index) == -1 || this.checkHasSoldier(arr)) {
            arr = [];
        }
        else {
            vo.derection = FightLogic.SOLDIER_LIST_TYPE_HORIZONTAL;
            vo.gem_type = this.gem_arr[arr[0]];
            vo.data = arr;
            this.soldier_arr.push(vo);
            return vo;
        }
        //检测竖排
        count = index % 6;
        arr.push(count);
        while (count < 24) {
            if (this.gem_arr[count] == this.gem_arr[count + 6]) {
                arr.push(count + 6);
            }
            else {
                if (arr.length >= 4) {
                    break;
                }
                arr = [];
                arr.push(count + 6);
            }
            count += 6;
        }
        if (arr.length < 4 || arr.indexOf(index) == -1 || this.checkHasSoldier(arr)) {
            return null;
        }
        else {
            vo.gem_type = this.gem_arr[arr[0]];
            vo.data = arr;
            vo.derection = FightLogic.SOLDIER_LIST_TYPE_VERTICAL;
            this.soldier_arr.push(vo);
            return vo;
        }
    };
    /**战士攻击*/
    p.soldierFight = function (vo) {
        var event = new MyUIEvent(MyUIEvent.FIGHT_SOLDIER_ATTACK);
        event.data = vo;
        this.dispatchEvent(event);
    };
    /**初始化动画工厂*/
    p.initMovieClipDataFactory = function () {
        if (this.mcFactory == null) {
            var data = RES.getRes("bomb_json");
            var txtr = RES.getRes("bomb_png");
            this.mcFactory = new egret.MovieClipDataFactory(data, txtr);
        }
    };
    /**获取动画*/
    p.getMovieClip = function (src) {
        return new egret.MovieClip(this.mcFactory.generateMovieClipData(src));
    };
    /**清理动画工厂*/
    p.clearMovicClip = function () {
        this.mcFactory = null;
    };
    /**获取一个初始宝石数组*/
    p.getGemArr = function () {
        this.gem_arr = [];
        for (var i = 0; i < 30; i++) {
            this.gem_arr.push(this.getRandomGemType());
        }
        this.gem_arr = [0, 2, 2, 2, 2, 0,
            2, 2, 2, 1, 0, 2,
            0, 1, 1, 1, 1, 3,
            1, 3, 3, 1, 1, 2,
            5, 3, 3, 1, 1, 2];
        for (var i = 0; i < 5; i++) {
            console.log(this.gem_arr[i * 6] + "," + this.gem_arr[i * 6 + 1] + "," + this.gem_arr[i * 6 + 2] + "," +
                this.gem_arr[i * 6 + 3] + "," + this.gem_arr[i * 6 + 4] + "," + this.gem_arr[i * 6 + 5]);
        }
        return this.gem_arr;
    };
    p.getRandomGemType = function () {
        var a = [20, 20, 20, 20, 12, 8]; //宝石出现的权值数组
        var b = Math.random() * 100;
        var final_num;
        var index = 0;
        while (true) {
            b -= a[index];
            if (b <= 0) {
                final_num = index;
                break;
            }
            else {
                index++;
            }
        }
        return final_num; //宝石类型0-5
    };
    /**开始战斗--战斗界面*/
    p.startFight = function (mission_id) {
        this.initMovieClipDataFactory();
        UIManager.getInstance().storyCon.addChild(new FightMainUI());
    };
    /***/
    /**选中某一个宝石，如果之前已经选中过了，则判断是否需要移动*/
    p.setSelectGem = function (index) {
        if (this.is_gem_move) {
            return;
        }
        var event = new MyUIEvent(MyUIEvent.FIGHT_GEM_OPERATOR);
        var last = this.current_select_gem;
        if (index == -1) {
            event.data = { last: this.current_select_gem, target: index, type: FightLogic.GEM_OPERATOR_CLICK_CANCEL };
            this.current_select_gem = -1;
        }
        else if (this.current_select_gem == -1) {
            event.data = { last: this.current_select_gem, target: index, type: FightLogic.GEM_OPERATOR_CLICK };
            this.current_select_gem = index;
        }
        else {
            if (this.checkNear(this.current_select_gem, index)) {
                event.data = { last: this.current_select_gem, target: index, type: FightLogic.GEM_OPERATOR_MOVE };
                this.current_select_gem = -1;
            }
            else {
                event.data = { last: this.current_select_gem, target: index, type: FightLogic.GEM_OPERATOR_NEW_CLICK };
                this.current_select_gem = index;
            }
        }
        if (event != null) {
            this.dispatchEvent(event);
        }
    };
    /**判断是否与上次点击的是相邻的*/
    p.checkNear = function (a, b) {
        var n = Math.abs(a - b);
        return n == 1 || n == 6;
    };
    /**宝石操作类型--初次点击，产生晃动效果*/
    FightLogic.GEM_OPERATOR_CLICK = 0;
    /**宝石操作类型--点击效果取消*/
    FightLogic.GEM_OPERATOR_CLICK_CANCEL = 1;
    /**宝石操作类型--移动*/
    FightLogic.GEM_OPERATOR_MOVE = 2;
    /**宝石操作类型--点击了一个不相邻的宝石*/
    FightLogic.GEM_OPERATOR_NEW_CLICK = 3;
    /**战士排列类型--横向*/
    FightLogic.SOLDIER_LIST_TYPE_HORIZONTAL = 0;
    /**战士排列类型--纵向*/
    FightLogic.SOLDIER_LIST_TYPE_VERTICAL = 1;
    /**战士排列类型--方块大战士*/
    FightLogic.SOLDIER_LIST_TYPE_BIG = 2;
    return FightLogic;
}(egret.EventDispatcher));
egret.registerClass(FightLogic,'FightLogic');
//# sourceMappingURL=FightLogic.js.map