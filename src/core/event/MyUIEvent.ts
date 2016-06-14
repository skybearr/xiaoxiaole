/**
 *
 * @author 
 *
 */
class MyUIEvent extends egret.Event{
    public constructor(type: string,bubbles: boolean = false,cancelable: boolean = false) {
        super(type,bubbles,cancelable);
    }
	
    public data:any = null;
    /**登录*/
    public static LOGIN_IN: string = "LOGIN_IN";
    
    /**切换章节*/
    public static CHANGE_CHAPTER: string = "CHANGE_CHAPTER";
    /**打开关卡*/
    public static OPEN_MISSION_LIST: string = "OPEN_MISSION_LIST";
    /**更新小关卡界面*/
    public static UPDATE_MISSION_ITEM: string = "UPDATE_MISSION_ITEM";
    /**关闭菜单界面*/
    public static CLOSE_MENU: string = "CLOSE_MENU";
    
    
    
    /**加载资源：章节资源*/
    public static LOAD_STORY_CHAPTER: string = "LOAD_STORY_CHAPTER";
}
