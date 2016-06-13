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
    MyUIEvent.LOGIN_IN = "LOGIN_IN";
    MyUIEvent.CHANGE_CHAPTER = "CHANGE_CHAPTER";
    MyUIEvent.LOAD_STORY_CHAPTER = "LOAD_STORY_CHAPTER";
    return MyUIEvent;
}(egret.Event));
egret.registerClass(MyUIEvent,'MyUIEvent');
//# sourceMappingURL=MyUIEvent.js.map