/**
 *
 * @author
 *
 */
var UIManager = (function (_super) {
    __extends(UIManager, _super);
    function UIManager() {
        _super.call(this);
        this.ui_class_arr = null;
    }
    var d = __define,c=UIManager,p=c.prototype;
    UIManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new UIManager();
        }
        return this.instance;
    };
    p.startGame = function () {
        this.initUIClass();
        this.mainCon = new egret.DisplayObjectContainer();
        this.broadcastCon = new egret.DisplayObjectContainer();
        this.storyCon = new egret.DisplayObjectContainer();
        this.loadingCon = new egret.DisplayObjectContainer();
        if (GlobalData.GameStage != null) {
            GlobalData.GameStage.addChild(this.mainCon);
            GlobalData.GameStage.addChild(this.broadcastCon);
            GlobalData.GameStage.addChild(this.storyCon);
            GlobalData.GameStage.addChild(this.loadingCon);
            this.openFirstUI(UIManager.CLASS_UI_INDEX_LOGOANIMATION);
        }
    };
    p.initUIClass = function () {
        this.ui_class_arr = [LogoAnimation, LoginMain, StoryUI];
    };
    /**打开一级界面
     * @param index 界面的索引
     * @param tweenType 界面进出的动画类型
     * */
    p.openFirstUI = function (index, tweenType) {
        if (tweenType === void 0) { tweenType = 0; }
        if (this.is_ui_tween) {
            console.log("正在打开界面，禁止操作");
            return;
        }
        this.is_ui_tween = true;
        //只接受一个一级界面存在，所以当大于一个的时候，先移除底下多余的
        while (this.mainCon.numChildren > 1) {
            this.mainCon.removeChildAt(0);
        }
        /**如果选择随机动画，则选择一种非0的类型*/
        if (tweenType == TweenManager.TWEEN_UI_RANDOM) {
            tweenType = 1 + Math.floor(Math.random()) * 3;
        }
        //如果第一次添加 没有其他界面，直接加上UI
        if (this.mainCon.numChildren == 0) {
            this.realOpenFirst(index, tweenType);
        }
        else {
            var extra = Math.ceil(Math.random() * 5);
            var last_ui = this.mainCon.getChildAt(0);
            TweenManager.getInstance().uiDisappearTween(last_ui, tweenType, extra, null, this);
            this.realOpenFirst(index, tweenType, extra);
        }
    };
    /**
     *
     * @param extra 二级tween的类型，需与消失一致*/
    p.realOpenFirst = function (index, type, extra) {
        if (extra === void 0) { extra = 0; }
        if (this.ui_class_arr[index] != null) {
            var ui = new this.ui_class_arr[index]();
            this.mainCon.addChild(ui);
            if (type == TweenManager.TWEEN_UI_NONE) {
                this.openFirstUIFinish();
            }
            else {
                this.openFirstUIFinish.bind(this);
                TweenManager.getInstance().uiAppearTween(ui, type, extra, this.openFirstUIFinish, this);
            }
        }
        else {
            console.log("ui索引错误");
        }
    };
    p.openFirstUIFinish = function () {
        //移除之前的UI
        while (this.mainCon.numChildren > 1) {
            this.mainCon.removeChildAt(0);
        }
        this.is_ui_tween = false;
    };
    p.openPopUI = function () {
    };
    /**系统提示
     * @param str
     * @param type 类型 0悬浮提示  1弹出窗  2不再提示*/
    p.popMessage = function (str, type) {
        if (type === void 0) { type = 1; }
        console.log(str);
    };
    UIManager.CLASS_UI_INDEX_LOGOANIMATION = 0;
    UIManager.CLASS_UI_INDEX_LOGINMAIN = 1;
    UIManager.CLASS_UI_INDEX_STORY = 2;
    UIManager.CLASS_UI_INDEX_FIGHT = 3;
    return UIManager;
}(egret.EventDispatcher));
egret.registerClass(UIManager,'UIManager');
//# sourceMappingURL=UIManager.js.map