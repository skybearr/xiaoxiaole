/**
 *
 * @author
 *
 */
var MyUIEvent = (function (_super) {
    __extends(MyUIEvent, _super);
    function MyUIEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
        this.data = null;
    }
    var d = __define,c=MyUIEvent,p=c.prototype;
    /**登录*/
    MyUIEvent.LOGIN_IN = "LOGIN_IN";
    /**切换章节*/
    MyUIEvent.CHANGE_CHAPTER = "CHANGE_CHAPTER";
    /**打开关卡*/
    MyUIEvent.OPEN_MISSION_LIST = "OPEN_MISSION_LIST";
    /**更新小关卡界面*/
    MyUIEvent.UPDATE_MISSION_ITEM = "UPDATE_MISSION_ITEM";
    /**关闭菜单界面*/
    MyUIEvent.CLOSE_MENU = "CLOSE_MENU";
    /**加载资源：章节资源*/
    MyUIEvent.LOAD_STORY_CHAPTER = "LOAD_STORY_CHAPTER";
    return MyUIEvent;
}(egret.Event));
egret.registerClass(MyUIEvent,'MyUIEvent');
//# sourceMappingURL=MyUIEvent.js.map