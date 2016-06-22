/**
 *
 * @author 
 *
 */
class FightLogic extends egret.EventDispatcher{
	public constructor() {
    	super();
	}
	
    private static instance: FightLogic;
    public static getInstance(): FightLogic {
        if(this.instance == null) {
            this.instance = new FightLogic();
        }
        return this.instance;
    }
    
    /**宝石操作类型--初次点击，产生晃动效果*/
    public static GEM_OPERATOR_CLICK: number = 0;
    /**宝石操作类型--点击效果取消*/
    public static GEM_OPERATOR_CLICK_CANCEL: number = 1;
    /**宝石操作类型--移动*/
    public static GEM_OPERATOR_MOVE: number = 2;
    /**宝石操作类型--点击了一个不相邻的宝石*/
    public static GEM_OPERATOR_NEW_CLICK: number = 3;
    horizontal
    /**战士排列类型--横向*/
    public static SOLDIER_LIST_TYPE_HORIZONTAL:number = 0;
    /**战士排列类型--纵向*/
    public static SOLDIER_LIST_TYPE_VERTICAL: number = 1;
    /**战士排列类型--方块大战士*/
    public static SOLDIER_LIST_TYPE_BIG: number = 2;
    
    
    /**怪物移动的最小距离*/
    public step_height:number = 15;
    /**当前选中的宝石 -1表示没有点击*/
    private current_select_gem:number = -1;
    /**宝石交换中*/
    public is_gem_move:boolean = false;
    /**动画资源*/
    private mcFactory:egret.MovieClipDataFactory;
    /**宝石数组*/
    private gem_arr:number[];
    /**当前战士数组*/
    private soldier_arr:SoldierVO[] = [];
    
    /**初始化检测所有宝石是否有合成*/
    public checkAllGemCompose():void
    {
        var arr: SoldierVO[] = [];
        this.soldier_arr = [];
        for(var i:number=0;i<this.gem_arr.length;i++)
        {
            var vo: SoldierVO = this.checkCompose(i);
            if(vo != null) {
                arr.push(vo);
                console.log(vo.data);
            }
        }
        if(arr.length > 0)
        {
            var event: MyUIEvent = new MyUIEvent(MyUIEvent.FIGHT_SOLDIER_COMPOSE);
            event.data = arr;
            this.dispatchEvent(event);   
        }
    }
    private checkHasSoldier(arr:number[]):boolean
    {
        if(arr == null)
        {
            return false;
        }
        for(var i: number = 0;i < this.soldier_arr.length;i++)
        {
            var data = this.soldier_arr[i].data;
            for(var j:number=0;j<data.length;j++){
                if(arr.indexOf(data[j]) != -1)
                {
                    return true;
                }
            }
        }
        return false;
    }
    
    /**宝石移动完成后位置互换*/
    public changeGem(last:number,target:number):void
    {
        var n:number = this.gem_arr[last];
        this.gem_arr[last] = this.gem_arr[target];
        this.gem_arr[target] = n;
        
        var v1: SoldierVO = this.checkCompose(last);
        var v2: SoldierVO= this.checkCompose(target);
        
        var arr:SoldierVO[] = [];
        if(v1 != null)
        {
            arr.push(v1);
        }
        if(v2 != null)
        {
            arr.push(v2);
        }
        if(arr.length > 0)
        {
            var event: MyUIEvent = new MyUIEvent(MyUIEvent.FIGHT_SOLDIER_COMPOSE);
            event.data = arr;
            this.dispatchEvent(event);   
        }
    }
    
    /**检测是否有合成战士，返回一个合成的数组*/
    private checkCompose(index: number): SoldierVO
    {
        if(this.soldier_arr == null)
        {
            this.soldier_arr = [];
        }
        var vo:SoldierVO = new SoldierVO();
        vo.id = index;
        
        var arr: number[] = [];
        //优先检测周围方块
        var arr1: number[] = [index,index + 1,index + 6,index+7];//要检查4次 分别为包含当前索引的周围4组方块
        var index1:number = 0;
        while(index1 < 4)
        {
            var k:number = arr1[index1];
            var a: number = this.gem_arr[k-7];
            var b: number = this.gem_arr[k - 6];
            var c: number = this.gem_arr[k - 1];
            var d: number = this.gem_arr[k];
            if(a == b && b == c && c == d)
            {
                arr = [a,b,c,d];
                vo.data = [k-7,k-6,k-1,k];
                vo.gem_type = a;
                vo.derection = FightLogic.SOLDIER_LIST_TYPE_BIG;
                break;
            }
            index1 ++;
        }
        if(arr.length < 4 || this.checkHasSoldier(vo.data)) {
            arr = [];
        }
        else {
            
            this.soldier_arr.push(vo);
            return vo;
        }
        
        //检测横排
        var count: number = index - index % 6;
        arr.push(count);
        while(count%6<5)
        {
            if(this.gem_arr[count] == this.gem_arr[count+1])
            {
                arr.push(count+1);
            }
            else
            {
                if(arr.length >= 4)
                {
                    break;
                }
                arr = [];
                arr.push(count+1);
            }
            count ++;
        }
        if(arr.length < 4 || arr.indexOf(index) == -1 || this.checkHasSoldier(arr))
        {
            arr = [];
        }
        else
        {
            vo.derection = FightLogic.SOLDIER_LIST_TYPE_HORIZONTAL;
            vo.gem_type = this.gem_arr[arr[0]];
            vo.data = arr;
            this.soldier_arr.push(vo);
            return vo;
        }
        
        //检测竖排
        count = index % 6;
        arr.push(count);
        while(count < 24) {
            if(this.gem_arr[count] == this.gem_arr[count + 6]) {
                arr.push(count + 6);
            }
            else {
                if(arr.length >= 4) {
                    break;
                }
                arr = [];
                arr.push(count + 6);
            }
            count += 6;
        }
        if(arr.length < 4 || arr.indexOf(index) == -1 || this.checkHasSoldier(arr)) {
            return null;
        }
        else {
            vo.gem_type = this.gem_arr[arr[0]];
            vo.data = arr;
            vo.derection = FightLogic.SOLDIER_LIST_TYPE_VERTICAL;
            this.soldier_arr.push(vo);
            return vo;
        }
    }
    
    /**战士攻击*/
    public soldierFight(vo:SoldierVO):void
    {
        var event:MyUIEvent = new MyUIEvent(MyUIEvent.FIGHT_SOLDIER_ATTACK);
        event.data = vo;
        this.dispatchEvent(event);
    }
    
    /**初始化动画工厂*/
    private initMovieClipDataFactory():void
    {
        if(this.mcFactory == null)
        {
            var data = RES.getRes("bomb_json");
            var txtr = RES.getRes("bomb_png");
            this.mcFactory = new egret.MovieClipDataFactory(data,txtr);
        }
    }
    
    /**获取动画*/
    public getMovieClip(src:string):egret.MovieClip
    {
        return new egret.MovieClip(this.mcFactory.generateMovieClipData(src));
    }
    
    /**清理动画工厂*/
    public clearMovicClip():void
    {
        this.mcFactory = null;
    }
    
    /**获取一个初始宝石数组*/
    public getGemArr():number[]
    {
        this.gem_arr = [];
        for(var i:number=0;i<30;i++)
        {
            this.gem_arr.push(this.getRandomGemType());
        }
        
        this.gem_arr = [0,2,2,2,2,0,
                        2,2,2,1,0,2,
                        0,1,1,1,1,3,
                        1,3,3,1,1,2,
                        5,3,3,1,1,2];
        for(var i: number = 0;i < 5;i++) {
            console.log(this.gem_arr[i * 6] + "," + this.gem_arr[i * 6 + 1] + "," + this.gem_arr[i * 6 + 2] + "," +
                this.gem_arr[i * 6 + 3] + "," + this.gem_arr[i * 6 + 4] + "," + this.gem_arr[i * 6 + 5]);
        }
        return this.gem_arr;
    }
    
    private getRandomGemType():number
    {
        var a: number[] = [20,20,20,20,12,8];//宝石出现的权值数组
        var b: number = Math.random() * 100;
        var final_num: number;
        var index: number = 0;
        while(true) {
            b -= a[index];
            if(b <= 0) {
                final_num = index;
                break;
            }
            else {
                index++;
            }
        }
        return final_num;//宝石类型0-5
    }
    
    /**开始战斗--战斗界面*/
    public startFight(mission_id:number):void
    {
        this.initMovieClipDataFactory();
        UIManager.getInstance().storyCon.addChild(new FightMainUI());
    }
    
    /***/
    
    /**选中某一个宝石，如果之前已经选中过了，则判断是否需要移动*/
    public setSelectGem(index:number):void
    {
        if(this.is_gem_move)
        {
            return;
        }
        var event: MyUIEvent = new MyUIEvent(MyUIEvent.FIGHT_GEM_OPERATOR);
        var last:number = this.current_select_gem;
        if(index == -1)//将之前的点击失效
        {
            event.data = {last:this.current_select_gem,target:index,type:FightLogic.GEM_OPERATOR_CLICK_CANCEL};
            this.current_select_gem = -1;
        }
        else if(this.current_select_gem == -1)//之前没有点击过，初次点击，产生晃动动画
        {
            event.data = { last: this.current_select_gem,target: index,type: FightLogic.GEM_OPERATOR_CLICK };
            this.current_select_gem = index;
        }
        else
        {
            if(this.checkNear(this.current_select_gem,index)) //与上一个点击的相比，如果相邻的，移动，同时将current_select_gem=-1
            {
                event.data = { last: this.current_select_gem,target: index,type: FightLogic.GEM_OPERATOR_MOVE };
                this.current_select_gem = -1;
            }
            else //不是相邻的，取消原来的晃动，最新点击的晃动
            {
                event.data = { last: this.current_select_gem,target: index,type: FightLogic.GEM_OPERATOR_NEW_CLICK };
                this.current_select_gem = index;
            }
        }
        if(event != null)
        {
            this.dispatchEvent(event);
        }
    }
    
    /**判断是否与上次点击的是相邻的*/
    private checkNear(a:number,b:number):boolean
    {
        var n:number = Math.abs(a-b);
        return n == 1 || n == 6;
    }
}
