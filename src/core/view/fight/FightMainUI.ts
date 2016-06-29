/**
 *
 * @author 
 *
 */
class FightMainUI extends eui.Component {
    private pause_btn: eui.Image;
    private prop_btn_arr: eui.Image[];
    private prop_num_arr: eui.Label[];
    private enemy_arr: EnemyView[];
    private wall_arr: WallView[];
    private gem_arr: GemView[];
    private soldier_arr: SoldierListView[] = [];
    private wall_con: egret.Sprite;
    private enemy_con: egret.Sprite;
    private gem_con: egret.Sprite;

    private last_gem: GemView;
    private target_gem: GemView;
    private gem_move_time: number = 300;
    private enemy_start_y: number = -65;
    private enemy_end_y: number = 235;
    private max_enemy: number = 132;//正常6*20，最后12格为城墙破了以后走2步则算战斗失败

    public constructor() {
        super();
        this.skinName = "resource/assets/skins/FightBgSkin.exml";
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.init();
    }

    private init(): void {
        this.prop_btn_arr = [];
        this.prop_num_arr = [];
        this.wall_arr = [];
        this.gem_arr = [];
        this.enemy_arr = new Array(this.max_enemy);

        this.enemy_con = new egret.Sprite();
        this.enemy_con.y = 0;
        this.addChildAt(this.enemy_con,2);

        this.wall_con = new egret.Sprite();
        this.wall_con.y = 430;
        this.addChild(this.wall_con);

        this.gem_con = new egret.Sprite();
        this.gem_con.y = 450;
        this.addChild(this.gem_con);

        this.initWall();
        this.initGem();
        this.addEnemyOnFirstRow();

        this.initEvent();

        FightLogic.getInstance().checkAllGemCompose();

    }

    private initWall(): void {
        var arr:WallVO[] = FightLogic.getInstance().getWalls()
        var w:number = 100;
        for(var i: number = 0;i < arr.length;i++) {
            var wall: WallView = new WallView(i,arr[i]);
            w = wall.width_set;
            wall.x = wall.width_set * i;
            wall.y = -wall.height_set;
            this.wall_arr.push(wall);
            this.wall_con.addChild(wall);
        }
        this.wall_con.x = (this.width - w * arr.length) / 2;
    }

    private initGem(): void {
        var arr: number[] = FightLogic.getInstance().getGemArr();
        for(var i: number = 0;i < arr.length;i++) {
            var vo: GemVO = new GemVO();
            vo.index = i;
            vo.type = arr[i];
            var gem: GemView = new GemView(vo);
            gem.x = (gem.width_set + 2) * (i % 6);
            gem.y = (gem.height_set + 10) * Math.floor(i / 6);
            this.gem_arr.push(gem);
            this.gem_con.addChild(gem);
        }
        this.gem_con.x = (this.width - this.gem_con.width) / 2;
    }

    /**生成最上面一排的敌人*/
    private addEnemyOnFirstRow(): void {
        var arr: EnemyVO[] = FightLogic.getInstance().birthOneRowEnemys();
        for(var i: number = 0;i < arr.length;i++) {
            var vo: EnemyVO = arr[i];
            if(this.enemy_arr[vo.position] != null) {//如果初始位置上因为某些原因(一排就被冰封住了，那这个敌人就出不来了)
                continue;
            }
            var enemy: EnemyView = new EnemyView(i,vo);
            enemy.x = enemy.width_set * (vo.position % 6);
            enemy.y = this.enemy_start_y + FightLogic.getInstance().step_height * Math.ceil(vo.position / 6);
            this.enemy_arr[vo.position] = enemy;
            this.enemy_con.addChildAt(enemy,0);
        }
        this.enemy_con.x = (this.width - this.enemy_con.width) / 2 - 5;
    }

    /**敌人行动*/
    private enemysAction(): void {
        console.log("enemysAction");
        //所有行动从最下面开始走起
        for(var i: number = this.enemy_arr.length - 1;i >= 0;i--) {
            var enemy: EnemyView = this.enemy_arr[i];
            if(enemy != null) {
                if(enemy.vo.has_dot)//如果中毒了，优先扣血
                {
                    if(enemy.dotRound(11))//如果扣血以后死亡，移除这个敌人
                    {
                        this.enemy_arr[i] = null;
                        if(enemy.parent != null) {
                            enemy.parent.removeChild(enemy);
                            enemy = null;
                        }
                        continue;
                    }
                    else//扣完血没死，移动
                    {
                        if(!enemy.vo.has_freeze) {
                            this.enemyAction(i);
                        }
                    }
                }
                else if(enemy.vo.has_freeze)//如果被冰封了，原地待命，并且冰封回合-1
                {
                    enemy.freezeRound();
                }
                else if(enemy.vo.is_dead) {
                    this.enemy_arr[i] = null;
                    if(enemy.parent != null) {
                        enemy.parent.removeChild(enemy);
                        enemy = null;
                    }
                }
                else {
                    this.enemyAction(i);
                }

            }
        }
        this.addEnemyOnFirstRow();
    }

    /**单个敌人行动：移动或者攻击*/
    private enemyAction(i: number): void {
        var enemy: EnemyView = this.enemy_arr[i];
        if(this.checkWallDestory(i%6))//城墙已破，可以移动，不会攻击
        {
            this.enemyMove(i,true);
        }
        else {
            if(enemy.canAttack()) {
                //攻击
                this.enemyAttack(i);
            }
            else {
                this.enemyMove(i);
            }
        }
    }
    /**检测这个位置的敌人是否可以移动*/
    private checkEnemyCanWalk(i: number): boolean {
        if(this.enemy_arr[i + 6] != null)//前面有人挡住着 不能走
        {
            return false;
        }
        else if(this.enemy_arr[i].canAttack())//到达攻击距离
        {
            return false;
        }
        else {
            return true;
        }
    }

    /**敌人攻击*/
    private enemyAttack(i: number): void {
        this.enemy_arr[i].attack();
        if(this.enemy_arr[i].vo.type != FightLogic.ENEMY_TYPE_TREATER) {
            this.damageWall(i % 6,this.enemy_arr[i].vo.attack);
        }
    }

    /**敌人移动*/
    private enemyMove(i: number,wallDestroy:boolean=false): void {
        //检测能否移动
        if(wallDestroy || this.checkEnemyCanWalk(i)) {
            //真正的移动
            var enemy:EnemyView = this.enemy_arr[i];
            var move_step:number = enemy.vo.speed * 6;
            while(i + move_step > this.max_enemy)//如果速度太快，最后一步直接走到尽头越界了，则固定为城墙口
            {
                move_step -= 6;
            }
            enemy.setPosition(enemy.vo.position + move_step)
            this.enemy_arr[i] = null;
            this.enemy_arr[i + move_step] = enemy;
            var tw = egret.Tween.get(enemy);
            var tarY: number = enemy.y + enemy.vo.speed * FightLogic.getInstance().step_height;
            tw.to({ y: tarY },this.gem_move_time).call(this.enemyMoveFinish,this,[i + move_step]);
        }
    }

    private enemyMoveFinish(i: number): void {
        //检测是否到达我方基地，是-->战斗结束
        if(this.checkEnemyBeatMe(i)) {
            this.gameOver(false);
        }
    }
    
    /**检测是否胜利（每次攻击完毕或者dot减伤以后检测）*/
    private checkWin():void
    {
        for(var i:number=0;i<this.enemy_arr.length;i++){
            if(this.enemy_arr[i] != null){
                return ;//只要还有一个敌人 就不算赢
            }
        }
        this.gameOver(true);
    }

    /**判断敌人是否到达我放基地*/
    private checkEnemyBeatMe(i: number): boolean {
        return i >= (FightLogic.getInstance().total_step + 1) * 6
    }

    /**判断城墙是否已破*/
    private checkWallDestory(i: number): boolean {
        return this.wall_arr[i].vo.hp <= 0;
    }
    
    /**城墙伤害计算*/
    private damageWall(i:number,damange:number)
    {
        this.wall_arr[i].damageDeal(damange);
    }

    /**战斗结束*/
    private gameOver(win:boolean): void {
        this.stopActions();
        console.log("战斗结束："+win);
        UIManager.getInstance().openSecondUI(new FightResult(win));
    }

    private initEvent(): void {
        this.pause_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.pauseClick,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_CLOSEUI,this.closeUI,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_GEM_OPERATOR,this.operatorGem,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_COMPOSE,this.soldierCompose,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_ATTACK,this.soldierAttack,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_GEM_COMPLEMENT,this.gemComplement,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_COMBO,this.soldierCombo,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }

    /**连击*/
    private soldierCombo(e: MyUIEvent): void {
        var arr: SoldierVO[] = e.data;
        this.soldierComposeReal(arr);

        //合成以后等待上面攻击完成后调用，现模拟
        setTimeout(this.soldierComboReal,2000,arr);
    }
    private soldierComboReal(arr: SoldierVO[]): void {
        FightLogic.getInstance().attack_combo_num++;//一次检测只能算一次连击
        for(var i: number = 0;i < arr.length;i++) {
            FightLogic.getInstance().soldierFight(arr[i]);
        }
    }

    /**战士攻击以后，原来的宝石消失，后面的往前补充,补充结束后再次检测是否可以连击*/
    private gemComplement(e: MyUIEvent): void {
        //e.data = { disappear: arr_disappear,move: arr_move_up,complement:arr_complement,cancel:arr_cancel,movegrid:grid_num};
        //下面顺序不能乱，否则数据会错
        this.soldierCancel(e.data.cancel);
        this.soldierMove(e.data.move_soldiers,e.data.movegrid);
        this.gemDisappear(e.data.disappear);
        this.gemMoveUp(e.data.move,e.data.movegrid);
        this.gemBelowComplement(e.data.complement,e.data.movegrid);
        //补充完成后，要重新检测下面是否合成战士,
        var lag: number = this.gem_move_time * e.data.movegrid + 500;
        setTimeout(this.checkCombo,lag,e.data.disappear);
    }

    private checkCombo(arr: number[]): void {
        FightLogic.getInstance().checkAttackCombo(arr);
    }

    /**战士攻击后，原来位置上的宝石销毁*/
    private gemDisappear(arr: number[]): void {
        for(var i: number = 0;i < arr.length;i++) {
            var gem: GemView = this.gem_arr[arr[i]];
            if(gem != null && gem.parent != null) {
                gem.parent.removeChild(gem);
            }
            this.gem_arr[arr[i]] = null;
        }
    }
    /**战士攻击后，战士下面的宝石移动上来*/
    private gemMoveUp(arr: number[],grid: number): void {
        for(var i: number = 0;i < arr.length;i++) {
            var gem: GemView = this.gem_arr[arr[i]];
            var tw = egret.Tween.get(gem);
            tw.to({ y: gem.y - (gem.height_set + 10) * grid },this.gem_move_time * grid).call(this.gemMoveUpFinish,this,[gem,gem.vo.index - grid * 6]);
        }
    }
    private gemMoveUpFinish(gem: GemView,index: number): void {
        gem.setIndex(index);
        this.gem_arr[index] = gem;
    }

    /**战士攻击后并且宝石移动以后，空缺的地方补充宝石*/
    private gemBelowComplement(arr: GemVO[],grid: number): void {
        for(var i: number = 0;i < arr.length;i++) {
            var gem: GemView = new GemView(arr[i]);
            gem.x = (gem.width_set + 2) * (arr[i].index % 6);
            gem.y = (gem.height_set + 10) * (Math.floor(arr[i].index / 6) + grid);
            this.gem_con.addChild(gem);
            var tw = egret.Tween.get(gem);
            tw.to({ y: gem.y - (gem.height_set + 10) * grid },this.gem_move_time * grid).call(this.gemMoveUpFinish,this,[gem,gem.vo.index]);
        }
    }
    /**战士攻击后并且宝石移动以后，原来的战士可能会不满足合成，所以取消*/
    private soldierCancel(ids: number[]) {
        for(var i: number = 0;i < ids.length;i++) {
            var soldier: SoldierListView = this.getSoldier(ids[i]);
            if(soldier != null) {
                var arr: number[] = soldier.vo.data;
                //战士对应宝石显示
                for(var j: number = 0;j < arr.length;j++) {
                    var gem: GemView = this.gem_arr[arr[j]];
                    gem.setAppear(true);
                }
                //销毁战士
                this.removeSoldier(soldier.vo.id);
                if(soldier.parent != null) {
                    soldier.parent.removeChild(soldier);
                }

            }
        }
    }

    private removeSoldier(id: number): void {
        for(var i: number = 0;i < this.soldier_arr.length;i++) {
            if(this.soldier_arr[i].vo.id == id) {
                this.soldier_arr.splice(i,1);
            }
        }
    }

    /**战士攻击后并且宝石移动以后，原来的完整战士，往上移动*/
    private soldierMove(ids: number[],step: number) {
        for(var i: number = 0;i < ids.length;i++) {
            var soldier: SoldierListView = this.getSoldier(ids[i]);
            if(soldier != null) {
                var tw = egret.Tween.get(soldier);
                tw.to({ y: soldier.y - 100 * step },this.gem_move_time * step);
                //战士的data也要随之改变
                for(var j: number = 0;j < soldier.vo.data.length;j++) {
                    soldier.vo.data[j] = soldier.vo.data[j] - step * 6;
                }
            }
        }
    }

    /**战士攻击*/
    private soldierAttack(e: MyUIEvent): void {
        var self = this;
        if(e.data == null) {
            console.log("soldierAttack错误");
        }
        var soldier = this.getSoldier(e.data.id);
        var tw = egret.Tween.get(soldier);
        var f = function(): void {
            if(soldier != null && soldier.parent != null) {
                self.removeSoldier(soldier.vo.id);
                soldier.parent.removeChild(soldier);
                FightLogic.getInstance().is_gem_move = false;
            }
        }
        var a = function(): void {
            soldier.change();
            var tw = egret.Tween.get(soldier);
            tw.to({ y: 0 },1000).call(f,self);
        }
        var t: number = (soldier.y - 330) * 2;
        tw.to({ y: 330 },t).call(a,self);

        FightLogic.getInstance().gemComplement(soldier.vo);
    }

    /**根据vo寻找当前图上的战士*/
    private getSoldier(id: number): SoldierListView {
        for(var i: number = 0;i < this.soldier_arr.length;i++) {
            var soldier = this.soldier_arr[i];
            if(soldier.vo.id == id) {
                return soldier;
            }
        }
        return null;
    }

    /**合成战士*/
    private soldierCompose(e: MyUIEvent): void {
        var arr: SoldierVO[] = e.data;
        this.soldierComposeReal(e.data);

    }
    private soldierComposeReal(arr: SoldierVO[]): void {
        if(this.soldier_arr == null) {
            this.soldier_arr = [];
        }
        for(var i: number = 0;i < arr.length;i++) {
            var vo: SoldierVO = arr[i];
            var soldier: SoldierListView = new SoldierListView(vo);
            soldier.x = this.gem_con.x + this.gem_arr[vo.data[0]].x;
            soldier.y = this.gem_con.y + this.gem_arr[vo.data[0]].y;
            this.addChild(soldier);
            this.soldier_arr.push(soldier);
            this.setGemDisappear(vo.data);
        }
    }

    /**合成战士以后原来位置的宝石暂时消失*/
    private setGemDisappear(arr: number[]): void {
        for(var i: number = 0;i < arr.length;i++) {
            this.gem_arr[arr[i]].setAppear(false);
        }
    }

    /**宝石操作*/
    private operatorGem(e: MyUIEvent): void {
        var type: number = e.data.type;
        var last: number = e.data.last;
        var target: number = e.data.target;
        if(last > -1) {
            this.last_gem = this.gem_arr[last];
        }
        if(target > -1) {
            this.target_gem = this.gem_arr[target];
        }
        if(type == FightLogic.GEM_OPERATOR_CLICK) {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
            if(this.target_gem != null) {
                this.target_gem.startTween(true);
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_CLICK_CANCEL) {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_MOVE) {
            if(this.last_gem != null && this.target_gem != null) {
                this.gemMove();
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_NEW_CLICK) {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
            if(this.target_gem != null) {
                this.target_gem.startTween(true);
            }
        }
    }

    private gemMove(): void {
        this.last_gem.startTween(false);
        var lastX: number = this.last_gem.x;
        var lastY: number = this.last_gem.y;
        var tarX: number = this.target_gem.x;
        var tarY: number = this.target_gem.y;
        var t1 = egret.Tween.get(this.last_gem);
        var t2 = egret.Tween.get(this.target_gem);
        FightLogic.getInstance().is_gem_move = true;
        t1.to({ x: tarX,y: tarY },this.gem_move_time).call(this.gemMoveFinish,this);
        t2.to({ x: lastX,y: lastY },this.gem_move_time);

        this.enemysAction();
    }

    private gemMoveFinish(): void {
        FightLogic.getInstance().is_gem_move = false;

        //宝石数组2个交换
        this.gem_arr[this.last_gem.vo.index] = this.target_gem;
        this.gem_arr[this.target_gem.vo.index] = this.last_gem;

        //2个宝石的索引交换
        var i: number = this.last_gem.vo.index;
        this.last_gem.setIndex(this.target_gem.vo.index);
        this.target_gem.setIndex(i);

        //因为已经交换过了，这里要填原来的
        FightLogic.getInstance().changeGem(this.target_gem.vo.index,this.last_gem.vo.index);
        this.last_gem = null;
        this.target_gem = null;
    }

    private pauseClick(): void {
        UIManager.getInstance().openSecondUI(new FightPauseUI());
    }

    private closeUI(): void {
        if(this.parent != null) {
            this.parent.removeChild(this);
        }
    }

    private clearGems(): void {

    }

    private clearLastTargetGem() {
        if(this.last_gem != null) {
            if(this.last_gem.parent != null) {
                this.last_gem.parent.removeChild(this.last_gem);
            }
            this.last_gem.clear();
            this.last_gem = null;
        }
        if(this.target_gem != null) {
            if(this.target_gem.parent != null) {
                this.target_gem.parent.removeChild(this.target_gem);
            }
            this.target_gem.clear();
            this.target_gem = null;
        }
    }
    
    private stopActions():void
    {
        egret.Tween.removeTweens(this);
    }

    private clear(): void {
        this.pause_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.pauseClick,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_CLOSEUI,this.closeUI,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_GEM_OPERATOR,this.operatorGem,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_SOLDIER_COMPOSE,this.soldierCompose,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_SOLDIER_ATTACK,this.soldierAttack,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_GEM_COMPLEMENT,this.gemComplement,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_SOLDIER_COMBO,this.soldierCombo,this);
    }
}
