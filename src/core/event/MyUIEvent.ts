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
    
    public static LOGIN_IN: string = "LOGIN_IN";
    
    public static CHANGE_CHAPTER: string = "CHANGE_CHAPTER";
    
    
    
    
    
    public static LOAD_STORY_CHAPTER: string = "LOAD_STORY_CHAPTER";
}
