/**
 *
 * @author 
 *
 */
class SoldierListView extends egret.Sprite{
    public vo:SoldierVO;
    public index_in_arr:number;
    public constructor(v:SoldierVO) {
        super();
        this.vo = v;
        this.touchEnabled = true;
        
        if(this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_BIG) {//大战士
            var s: SoldierView = new SoldierView(this.vo.gem_type);
            s.scaleX = s.scaleY = 2;
            this.addChild(s);
        }
        else {
            for(var i: number = 0;i < this.vo.data.length;i++) {
                var s: SoldierView = new SoldierView(this.vo.gem_type);
                if(this.vo.derection == FightLogic.SOLDIER_LIST_TYPE_HORIZONTAL) {
                    s.x = (s.width_set + 2) * i;
                }
                else {
                    s.y = (s.height_set + 10) * i;
                }
                this.addChild(s);
            }
        }
        
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
        this.once(egret.Event.REMOVED_FROM_STAGE,this.clear,this);
    }
    
    
    /**移动到城墙变身为球型效果*/
    public change():void
    {
        var index:number=0;
        while(index < this.numChildren)
        {
            (this.getChildAt(index) as SoldierView).changeFly();
            index ++;
        }
    }
    
    
    private click():void
    {
        FightLogic.getInstance().soldierFight(this.vo);
    }
    
    private clear():void
    {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
        this.removeChildren();
        this.vo = null;
    }
}
