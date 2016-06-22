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
            var gem:GemView = new GemView(i,vo);
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
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
	}
	
    private soldierAttack(e:MyUIEvent):void
    {
        var self = this;
        var soldier = this.getSoldier(e.data);
        var tw = egret.Tween.get(soldier);
        var f = function():void
        {
            if(soldier != null && soldier.parent != null)
            {
                soldier.parent.removeChild(soldier);
            }
        }
        var a = function(): void {
            soldier.change();
            var tw = egret.Tween.get(soldier);
            tw.to({y:0},1000).call(f,self);
        }
        var t:number = (soldier.y - 330) * 2;
        tw.to({y:330},t).call(a,self);
    }
    
    private getSoldier(vo:SoldierVO):SoldierListView
    {
        for(var i: number = 0;i < this.soldier_arr.length;i++)
        {
             var soldier = this.soldier_arr[i];   
             if(soldier.vo.id == vo.id)
             {
                 return soldier;
             }
        }
        return null;
    }
	
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
            }
            if(this.target_gem != null) {
                this.target_gem.startTween(true);
            }
        }
    }
    
    private gem_move_time:number = 300;
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
	
	private clear():void
	{
        this.pause_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.pauseClick,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_CLOSEUI,this.closeUI,this);
        FightLogic.getInstance().removeEventListener(MyUIEvent.FIGHT_GEM_OPERATOR,this.operatorGem,this);
	}
}
