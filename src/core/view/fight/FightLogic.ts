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
    
    /**战士排列类型--横向*/
    public static SOLDIER_LIST_TYPE_HORIZONTAL:number = 0;
    /**战士排列类型--纵向*/
    public static SOLDIER_LIST_TYPE_VERTICAL: number = 1;
    /**战士排列类型--方块大战士*/
    public static SOLDIER_LIST_TYPE_BIG: number = 2;
    
//    /**敌人状态：正常移动*/
//    public static ENEMY_STATE_WALK: number = 0;
//    /**敌人状态：冰封*/
//    public static ENEMY_STATE_FREEZE: number = 1;
//    /**敌人状态：中debuff持续伤害*/
//    public static ENEMY_STATE_DOT: number = 2;
//    /**敌人状态：前方有障碍*/
//    public static ENEMY_STATE_BARRIER: number = 3;
//    /**敌人状态：已死亡，移除*/
//    public static ENEMY_STATE_DEAD: number = 99;

    /**敌人类型：战士/骑士 */
    public static ENEMY_TYPE_WARRIOR: number = 0;
    /**敌人类型：法师*/
    public static ENEMY_TYPE_MAGICIAN: number = 1;
    /**敌人类型：boss/hero*/
    public static ENEMY_TYPE_BOSS: number = 2;
    /**敌人类型：牧师*/
    public static ENEMY_TYPE_TREATER: number = 3;
    
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
    /**整个一次攻击中的连击次数，攻击停止归0*/
    public attack_combo_num:number = 0;
    /**一个永远不会重复的ID，仅供soloderVO生成时使用*/
    public soldier_max_id: number = 1;
    /**敌人移动的最小距离*/
    public step_height: number = 15;
    /**敌人从出现到到达城墙需要的距离，步*/
    public total_step: number = 20;
    
    /**生成一排敌人*/
    public birthOneRowEnemys(): EnemyVO[] {
        var arr:EnemyVO[] = [];
        for(var i: number = 0;i < 6;i++) {
            var b: boolean = (Math.random() * 100) < 30;
            if(b) {
                var vo: EnemyVO = DataManager.getInstance().getEnemyVOByID(i);
                vo.position = i;
                if(vo.type == 1 || vo.type == 3)
                {
                    vo.attack_range = 8;
                }
                else
                {
                    vo.attack_range = 1;
                }
                
                arr.push(vo);
            }
        }
        return arr;
    }
    
    public getWalls():WallVO[]
    {
        var arr:WallVO[] = [];
        for(var i: number = 0;i < 6;i++) {
            var lv:number = Math.floor(Math.random() * 20 + 1);
            var vo: WallVO = DataManager.getInstance().getWallVOByLevel(lv);
            arr.push(vo);
        }
        return arr;
    }
    
    
    /**战士攻击以后，先清除战士，原来的宝石消失，后面的往前补充,在这个过程中如果有战士因移动取消了，要一起操作*/
    public gemComplement(vo:SoldierVO):void
    {
        console.log("gemComplement");
        var indexx: number = this.getSoldierIndexByID(vo.id);
        if(indexx != -1){
            this.soldier_arr.splice(indexx,1);
        }
        
        var arr_disappear = vo.data;
        var arr_move_up:number[] = [];//需要往上的宝石索引
        var arr_complement:GemVO[] = [];//需要补充的宝石，补充到的位置索引
        var arr_cancel:number[] = [];//如果原来是战士合成的，因为移动合成取消恢复成原来的样子了的,这里存的是已合成战士的id
        var arr_soldier_move: number[] = [];//如果原来有战士，且没有取消，那么战士要往前进，这里存的是已合成战士的id
        var grid_num:number = 0;
        
        if(vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG)
        {
            grid_num = 2;
            arr_move_up = this.getBelowGem(arr_disappear.slice(2));
        }
        else if(vo.derection == FightLogic.SOLDIER_LIST_TYPE_HORIZONTAL)
        {
            grid_num = 1;
            arr_move_up = this.getBelowGem(arr_disappear);
        }
        else if(vo.derection == FightLogic.SOLDIER_LIST_TYPE_VERTICAL)
        {
            grid_num = vo.data.length;
            arr_move_up = this.getBelowGem(arr_disappear.slice(arr_disappear.length-1));
        }
        arr_complement = this.getComplementIndex(arr_disappear);
        arr_cancel = this.getCancelSolodiers(arr_move_up);
        arr_soldier_move = this.getMoveSolodiers(arr_move_up);
        this.soldierCancel(arr_cancel);
        
        this.refreshGemArr(arr_move_up,arr_complement,grid_num);
        
        this.current_select_gem = -1;
        var e: MyUIEvent = new MyUIEvent(MyUIEvent.FIGHT_GEM_COMPLEMENT);
        e.data = { disappear: arr_disappear,move: arr_move_up,complement:arr_complement,cancel:arr_cancel,
                    move_soldiers:arr_soldier_move,movegrid:grid_num};
        this.dispatchEvent(e);
    }
    
    /**根据id找战士*/
    private getSoldierIndexByID(id:number):number
    {
        console.log("getSoldierIndexByID");
        for(var i:number=0;i<this.soldier_arr.length;i++){
            if(this.soldier_arr[i].id == id)
            {
                return i;
            }
        }
        return -1;
    }
    
    /**从已合成的战士中去掉取消的*/
    private soldierCancel(arr:number[])
    {
        console.log("soldierCancel");
        for(var i: number = 0;i < this.soldier_arr.length;i++){
            if(arr.indexOf(this.soldier_arr[i].id) != -1)
            {
                this.soldier_arr.splice(i,1);
                i--;
            }
        }
    }
    
    /**根据这些数据刷新gemArr*/
    private refreshGemArr(move:number[],complement:GemVO[],grid:number)
    {
        for(var i:number=0;i<move.length;i++){
            var index:number = move[i];
            this.gem_arr[index - grid*6] = this.gem_arr[index];
        }
        
        for(var i: number = 0;i < complement.length;i++) {
            this.gem_arr[complement[i].index] = complement[i].type
        }
    }
    
    /**获取这些宝石中需要移动的id数组
     * @param arr
     */
    private getMoveSolodiers(arr: number[]): number[] {
        console.log("getMoveSolodiers");
        var ids: number[] = [];
        for(var j: number = 0;j < this.soldier_arr.length;j++) {
            var data = this.soldier_arr[j].data;
            var count: number = 0;
            for(var i: number = 0;i < data.length;i++) {
                if(arr.indexOf(data[i]) != -1) {
                    count++;
                }
            }
            if(count == data.length) //如果这个战士data所有都符合，那这个战士就要往上移动
            {
                ids.push(this.soldier_arr[j].id);
            }
        }
        return ids;
    }
    
    /**获取这些宝石中取消的已合成战士的id数组
     * @param arr
     */
    private getCancelSolodiers(arr:number[]):number[]
    {
        console.log("getCancelSolodiers");
        var ids:number[] = [];
        for(var j: number = 0;j < this.soldier_arr.length;j++) {
            var data = this.soldier_arr[j].data;
            var count:number = 0;
            for(var i:number=0;i<data.length;i++){
                //如果这个战士只有部分在这个arr里，就表示会取消
                if(arr.indexOf(data[i]) != -1)
                {
                    count ++;
                }
            }
            if(count > 0 && count < data.length) //如果这个战士只有部分在这个arr里，就表示会取消
            {
                ids.push(this.soldier_arr[j].id);
                this.soldier_arr.splice(j,1);
                j--;
            }
        }
        return ids;
    }
    
    /**
     * 宝石因战士攻击往上移动以后的空白区域的index数组
     * @param arr 这个数组是指战士攻击以后的空白格子 
     * @return 返回一个补充到目标空白格子的数组
     * */
    private getComplementIndex(arr:number[]):GemVO[]
    {
        var complement:GemVO[] = [];
        var last:number = arr[arr.length-1];
        var step: number = 4 - Math.floor(last/6);
        for(var i:number=0;i<arr.length;i++){
            var vo:GemVO = new GemVO();
            vo.index = arr[i] + step * 6;
            vo.type = this.getRandomGemType();
            complement.push(vo);
        }
        return complement;
    }
    
    /**获取这些格子下面所有需要往上移动的的格子*/
    private getBelowGem(arr:number[]):number[]
    {
        var move:number[] = [];
        for(var i:number=0;i<arr.length;i++)
        {
            //对每一个格子寻找其下面所有的格子存入
            var k:number = arr[i];
            while(true)
            {
                k += 6;
                if(k >= 30)
                {
                    break;
                }
                move.push(k);
            }
        }
        return move;
    }
    
    /**战士攻击后，检测他下面的宝石是否由合成或者合成取消
     * @param arr 从这些坐标开始检测所有坐标及以下*/
    public checkAttackCombo(arr:number[]):void
    {
        var soldiers: SoldierVO[] = [];
        //如果原来下面就有战士了，先加入
        
        //把这个索引以下所有坐标都加入
        var indexs:number[] = this.getBelowIndexs(arr);
        for(var i: number = 0;i < indexs.length;i++){
            var vo: SoldierVO = this.checkCompose(i);
            if(vo != null) {
                soldiers.push(vo);
                console.log(vo.data);
            }
        }
        if(soldiers.length > 0)
        {
            var e:MyUIEvent = new MyUIEvent(MyUIEvent.FIGHT_SOLDIER_COMBO);
            e.data = soldiers;
            this.dispatchEvent(e);
        }
        else
        {
            this.attack_combo_num = 0;
        }
    }
    
    /**获取这个数组索引及其以下所有坐标*/
    private getBelowIndexs(arr:number[]):number[]
    {
        var a:number[] = arr;
        for(var i:number=0;i<arr.length;i++){
            var count:number = arr[i];
            while(count<30)
            {
                if(a.indexOf(count) == -1)
                {
                    a.push(count);
                }
                count += 6;
            }
        } 
        
        return a;
    }
    
    
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
            this.current_select_gem = -1;
            var event: MyUIEvent = new MyUIEvent(MyUIEvent.FIGHT_SOLDIER_COMPOSE);
            event.data = arr;
            this.dispatchEvent(event);   
        }
    }
    /**判断合成战士的坐标是否已经有合成的战士了*/
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
            this.current_select_gem = -1;
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
                //如果这个数组中已经处于一个合成的战士中，找出来的不算，继续找，否则就是找到了
                if(this.checkHasSoldier(vo.data))
                {
                    arr = [];
                    vo = new SoldierVO();
                }
                else
                {
                    break;
                }
            }
            index1 ++;
        }
        //如果不满4个
        if(arr.length < 4) {
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
            if(this.gem_arr[count] == this.gem_arr[count + 1] && !this.checkHasSoldier([count]))
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
                vo = new SoldierVO();
                arr.push(count+1);
            }
            count ++;
        }
        //如果不满4个，或者当前检测的位置是否在这个合成的战士中，或者这个数组中已经处于一个合成的战士中
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
                if(arr.length >= 4){
                    break;
                }
                arr = [];
                arr.push(count + 6);
            }
            count += 6;
        }
        //如果不满4个，或者当前检测的位置是否在这个合成的战士中，或者这个数组中已经处于一个合成的战士中
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
        if(this.is_gem_move && this.attack_combo_num == 0)
        {
            return ;
        }
        this.is_gem_move = true;
        this.current_select_gem = -1;
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
        this.gem_arr = this.getRandomGems(30);
        
        this.gem_arr = [3,2,5,2,3,1,
                        3,3,1,5,1,3,
                        2,0,5,4,1,4,
                        5,2,2,1,4,1,
                        1,3,2,5,1,1];
        for(var i: number = 0;i < 5;i++) {
            console.log(this.gem_arr[i * 6] + "," + this.gem_arr[i * 6 + 1] + "," + this.gem_arr[i * 6 + 2] + "," +
                this.gem_arr[i * 6 + 3] + "," + this.gem_arr[i * 6 + 4] + "," + this.gem_arr[i * 6 + 5]);
        }
        return this.gem_arr;
    }
    
    private getRandomGems(n:number):number[]
    {
        var arr:number[] = [];
        for(var i: number = 0;i < n;i++) {
            arr.push(this.getRandomGemType());
        }
        return arr;
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
                if(this.gem_arr[this.current_select_gem] == this.gem_arr[index])//相邻的如果是一个类型的，则取消原来的
                {
                    event.data = { last: this.current_select_gem,target: index,type: FightLogic.GEM_OPERATOR_CLICK_CANCEL };
                }
                else//真的移动了
                {
                    event.data = { last: this.current_select_gem,target: index,type: FightLogic.GEM_OPERATOR_MOVE };
                }
                
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
