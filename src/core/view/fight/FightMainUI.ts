/**
 *
 * @author 
 *
 */
class FightMainUI extends eui.Component{
    private pause_btn:eui.Image;
    private prop_btn_arr:eui.Image[];
    private prop_num_arr:eui.Label[];
    private enemy_arr:EnemyView[];
    private wall_arr:WallView[];
    private gem_arr:GemView[];
    private wall_con: egret.Sprite;
    private enemy_con: egret.Sprite;
    private gem_con: egret.Sprite;
    
    private soldier_arr:SoldierListView[];
    private last_gem:GemView;
    private target_gem:GemView;
    private gem_move_time: number = 300;
    
	public constructor() {
    	super();
        this.skinName = "resource/assets/skins/FightBgSkin.exml";
	}
	
    protected childrenCreated():void
	{
	    super.childrenCreated();
	    this.init();
	}
	
	private init():void
	{
	    this.prop_btn_arr = [];
	    this.prop_num_arr = [];
	    this.wall_arr = [];
	    this.gem_arr = [];
	    this.enemy_arr = [];
	    
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
        this.initEnemy();
        
    	  this.initEvent();
    	  
    	  FightLogic.getInstance().checkAllGemCompose();
        	  
	}
	
	private initWall():void
	{
        for(var i: number = 0;i < 6;i++) {
            var wall: WallView = new WallView(i,new WallVO());
            wall.x = wall.width_set * i;
            wall.y = -wall.height_set;
            this.wall_arr.push(wall);
            this.wall_con.addChild(wall);
        }
        this.wall_con.x = (this.width - this.wall_con.width)/2;
	}
	
	private initGem():void
	{
    	  var arr:number[] = FightLogic.getInstance().getGemArr();
          for(var i: number = 0;i < arr.length;i++) {
            var vo:GemVO = new GemVO();
            vo.index = i;
            vo.type = arr[i];
            var gem:GemView = new GemView(vo);
            gem.x = (gem.width_set + 2) * (i%6);
            gem.y = (gem.height_set + 10) * Math.floor(i/6);
            this.gem_arr.push(gem);
            this.gem_con.addChild(gem);
        }
          this.gem_con.x = (this.width - this.gem_con.width) / 2;
	}
	
	private initEnemy():void
	{
        for(var i: number = 0;i < 120;i++) {
            var enemy: EnemyView = new EnemyView(i,new EnemyVO());
            enemy.x = enemy.width_set * (i % 6);
            enemy.y = 60 - FightLogic.getInstance().step_height * Math.floor(i / 6);
            this.enemy_arr.push(enemy);
            this.enemy_con.addChild(enemy);
        }
	}
	
	private initEvent():void
	{
        this.pause_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.pauseClick,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_CLOSEUI,this.closeUI,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_GEM_OPERATOR,this.operatorGem,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_COMPOSE,this.soldierCompose,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_SOLDIER_ATTACK,this.soldierAttack,this);
        FightLogic.getInstance().addEventListener(MyUIEvent.FIGHT_GEM_COMPLEMENT,this.gemComplement,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
	}
	
	/**战士攻击以后，原来的宝石消失，后面的往前补充,补充结束后再次检测是否可以连击*/
	private gemComplement(e:MyUIEvent):void
	{
	    //e.data = { disappear: arr_disappear,move: arr_move_up,complement:arr_complement,cancel:arr_cancel,movegrid:grid_num};
    	  //下面顺序不能乱，否则数据会错
        this.soldierCancel(e.data.cancel);
        this.soldierMove(e.data.move_soldiers,e.data.movegrid);
        this.gemDisappear(e.data.disappear);
        this.gemMoveUp(e.data.move,e.data.movegrid);
        this.gemBelowComplement(e.data.complement,e.data.movegrid);
        //补充完成后，要重新检测下面是否合成战士,
        var lag:number = this.gem_move_time * e.data.movegrid + 500;
        setTimeout(FightLogic.getInstance().checkAttackCombo,lag,[e.data.disappear]);
	}
	
	/**战士攻击后，原来位置上的宝石销毁*/
	private gemDisappear(arr:number[]):void
	{
	    for(var i:number=0;i<arr.length;i++){
            var gem: GemView = this.gem_arr[arr[i]];
            if(gem != null && gem.parent != null)
            {
                gem.parent.removeChild(gem);
            }
            this.gem_arr[arr[i]] = null;
	    }
	}
	/**战士攻击后，战士下面的宝石移动上来*/
	private gemMoveUp(arr:number[],grid:number):void
    {
	    for(var i: number = 0; i < arr.length; i++){
            var gem: GemView = this.gem_arr[arr[i]];
            var tw = egret.Tween.get(gem);
            tw.to({ y: gem.y - (gem.height_set + 10) * grid },this.gem_move_time*grid).call(this.gemMoveUpFinish,this,[gem,gem.vo.index-grid*6]);
        }
	}
	private gemMoveUpFinish(gem:GemView,index:number):void
	{
	    gem.setIndex(index);
	    this.gem_arr[index] = gem;
	}
	
	/**战士攻击后并且宝石移动以后，空缺的地方补充宝石*/
	private gemBelowComplement(arr:GemVO[],grid:number):void
	{
        for(var i: number = 0;i < arr.length;i++) {
            var gem:GemView = new GemView(arr[i]);
            gem.x = (gem.width_set + 2) * (arr[i].index % 6);
            gem.y = (gem.height_set + 10) * (Math.floor(arr[i].index / 6) + grid);
            this.gem_con.addChild(gem);
            var tw = egret.Tween.get(gem);
            tw.to({ y: gem.y - (gem.height_set + 10) * grid },this.gem_move_time*grid).call(this.gemMoveUpFinish,this,[gem,gem.vo.index]);
        }
	}
	/**战士攻击后并且宝石移动以后，原来的战士可能会不满足合成，所以取消*/
    private soldierCancel(ids:number[])
    {
        for(var i:number=0;i<ids.length;i++){
            var soldier: SoldierListView = this.getSoldier(ids[i]);
            if(soldier != null)
            {
                var arr: number[] = soldier.vo.data;
                //战士对应宝石显示
                for(var j: number = 0;j < arr.length;j++) {
                    var gem: GemView = this.gem_arr[arr[j]];
                    gem.setAppear(true);
                }
                //销毁战士
                if(soldier.parent != null) {
                    soldier.parent.removeChild(soldier);
                }
                this.soldier_arr.splice(soldier.index_in_arr,1);
            }
        }
    }
    
    /**战士攻击后并且宝石移动以后，原来的完整战士，往上移动*/
    private soldierMove(ids:number[],step:number)
    {
        for(var i: number = 0;i < ids.length;i++) {
            var soldier: SoldierListView = this.getSoldier(ids[i]);
            if(soldier != null) {
                var tw = egret.Tween.get(soldier);
                tw.to({ y: soldier.y - 100 * step },this.gem_move_time * step);
                //战士的data也要随之改变
                for(var j:number=0;j<soldier.vo.data.length;j++){
                    soldier.vo.data[j] = soldier.vo.data[j] - step * 6;
                }
            }
        }
    }
	
	/**战士攻击*/
    private soldierAttack(e:MyUIEvent):void
    {
        var self = this;
        var soldier = this.getSoldier(e.data.id);
        var tw = egret.Tween.get(soldier);
        var f = function():void
        {
            if(soldier != null && soldier.parent != null)
            {
                self.soldier_arr.splice(soldier.index_in_arr,1);
                soldier.parent.removeChild(soldier);
                FightLogic.getInstance().is_gem_move = false;
            }
        }
        var a = function(): void {
            soldier.change();
            var tw = egret.Tween.get(soldier);
            tw.to({y:0},1000).call(f,self);
        }
        var t:number = (soldier.y - 330) * 2;
        tw.to({y:330},t).call(a,self);
        
        FightLogic.getInstance().gemComplement(soldier.vo);
    }
    
    /**根据vo寻找当前图上的战士*/
    private getSoldier(id:number):SoldierListView
    {
        for(var i: number = 0;i < this.soldier_arr.length;i++)
        {
             var soldier = this.soldier_arr[i];   
             if(soldier.vo.id == id)
             {
                 soldier.index_in_arr = i;
                 return soldier;
             }
        }
        return null;
    }
	
    /**合成战士*/
    private soldierCompose(e:MyUIEvent):void
    {
        if(this.soldier_arr == null)
        {
            this.soldier_arr = [];
        }
        var arr:SoldierVO[] = e.data;
        for(var i:number=0;i<arr.length;i++)
        {
            var vo:SoldierVO = arr[i];
            var soldier: SoldierListView = new SoldierListView(vo);
            soldier.x = this.gem_con.x + this.gem_arr[vo.data[0]].x;
            soldier.y = this.gem_con.y + this.gem_arr[vo.data[0]].y;
            this.addChild(soldier);
            this.soldier_arr.push(soldier);
            this.setGemDisappear(vo.data);
        }
    }
    
    /**合成战士以后原来位置的宝石暂时消失*/
    private setGemDisappear(arr:number[]):void
    {
        for(var i:number=0;i<arr.length;i++)
        {
            this.gem_arr[arr[i]].setAppear(false);
        }
    }
	
    /**宝石操作*/
    private operatorGem(e: MyUIEvent): void {
        var type: number = e.data.type;
        var last: number = e.data.last;
        var target: number = e.data.target;
        if(last > -1)
        {
            this.last_gem = this.gem_arr[last];
        }
        if(target > -1)
        {
            this.target_gem = this.gem_arr[target];
        }
        if(type == FightLogic.GEM_OPERATOR_CLICK)
        {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
            if(this.target_gem != null)
            {
                this.target_gem.startTween(true);
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_CLICK_CANCEL)
        {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_MOVE)
        {
            if(this.last_gem != null && this.target_gem != null)
            {
                this.gemMove();
            }
        }
        else if(type == FightLogic.GEM_OPERATOR_NEW_CLICK)
        {
            if(this.last_gem != null) {
                this.last_gem.startTween(false);
                this.last_gem = null;
            }
            if(this.target_gem != null) {
                this.target_gem.startTween(true);
            }
        }
    }
    
    private gemMove():void
    {
        this.last_gem.startTween(false);
        var lastX: number = this.last_gem.x;
        var lastY: number = this.last_gem.y;
        var tarX:number = this.target_gem.x;
        var tarY: number = this.target_gem.y;
        var t1 = egret.Tween.get(this.last_gem);
        var t2 = egret.Tween.get(this.target_gem);
        FightLogic.getInstance().is_gem_move = true;
        t1.to({x:tarX,y:tarY},this.gem_move_time).call(this.gemMoveFinish,this);
        t2.to({ x:lastX,y: lastY },this.gem_move_time);
    }
    
    private gemMoveFinish():void
    {
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
	
	private pauseClick():void
	{
	    UIManager.getInstance().openSecondUI(new FightPauseUI());
	}
	
    private closeUI(): void {
        if(this.parent != null) {
            this.parent.removeChild(this);
        }
    }
	
	private clearGems():void
	{
	    
	}
	
    private clearLastTargetGem()
    {
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
	
	private clear():void
	{
        this.pause_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.pauseClick,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_CLOSEUI,this.closeUI,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_GEM_OPERATOR,this.operatorGem,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_SOLDIER_COMPOSE,this.soldierCompose,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_SOLDIER_ATTACK,this.soldierAttack,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_GEM_COMPLEMENT,this.gemComplement,this);
	}
}
