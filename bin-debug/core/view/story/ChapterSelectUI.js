/**
 *
 * @author
 *
 */
var ChapterSelectUI = (function (_super) {
    __extends(ChapterSelectUI, _super);
    function ChapterSelectUI() {
        _super.call(this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onStage, this);
    }
    var d = __define,c=ChapterSelectUI,p=c.prototype;
    p.onStage = function () {
        this.current_chapter_num = StoryLogic.getInstance().current_chapterID;
        this.totol_chapter_num = StoryLogic.getInstance().chapter_data.length;
        this.head = new eui.Image("mainchapter_btn");
        this.addChild(this.head);
        this.current_chapter_img = new eui.Image("main" + (this.current_chapter_num - 1));
        this.current_chapter_img.touchEnabled = false;
        this.current_chapter_img.x = (this.head.width - 40) / 2;
        this.current_chapter_img.y = 8;
        this.addChild(this.current_chapter_img);
        this.select_ui = new eui.Component();
        this.select_ui.skinName = "ChapterSelectSkin";
        this.select_ui.horizontalCenter = 0;
        this.select_ui.top = 60;
        this.select_ui.scaleY = 0;
        this.list_visible = false;
        this.addChildAt(this.select_ui, 0);
        this.chapter_arr = [];
        this.selected_broad_img = this.select_ui.getChildByName("chapter_select");
        for (var i = 0; i < this.totol_chapter_num; i++) {
            var item = this.select_ui.getChildByName("chapter" + (i + 1));
            this.chapter_arr.push(item);
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectChapter, this);
            if ((i + 1) > this.current_chapter_num) {
                item.filters = FilterUtil.getGrayFilter();
            }
        }
        this.setSelectedY();
        this.head.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickChapter, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    /**设置选中框的位置,同时改变标题中的章节中文字*/
    p.setSelectedY = function () {
        this.selected_broad_img.y = 8 + 60 * (this.current_chapter_num - 1);
        if (this.current_chapter_img != null && this.current_chapter_img.parent != null) {
            this.current_chapter_img.parent.removeChild(this.current_chapter_img);
            this.current_chapter_img = null;
        }
        this.current_chapter_img = new eui.Image("main" + (this.current_chapter_num - 1));
        this.current_chapter_img.touchEnabled = false;
        this.current_chapter_img.x = (this.head.width - 40) / 2;
        this.current_chapter_img.y = 8;
        this.addChild(this.current_chapter_img);
    };
    /**在章节列表中选择章节*/
    p.selectChapter = function (e) {
        var n = parseInt(e.currentTarget.name.slice(7));
        if (this.current_chapter_num == n || this.is_tween) {
            return;
        }
        if (n <= StoryLogic.getInstance().current_chapterID) {
            this.current_chapter_num = n;
            this.setSelectedY();
            //在StoryUI中动画切换章节
            var event = new MyUIEvent(MyUIEvent.CHANGE_CHAPTER);
            event.data = { id: n };
            StoryLogic.getInstance().dispatchEvent(event);
        }
        else {
            console.log("先把前面的章节打通吧");
        }
    };
    //切换章节场景
    p.changeChapter = function () {
        this.is_tween = false;
        this.list_visible = false;
    };
    //点击章节标题  章节列表的出现/消失的动画
    p.clickChapter = function (e) {
        SoundManager.getInstance().playEffectSound();
        if (this.is_tween) {
            return;
        }
        var tw = egret.Tween.get(this.select_ui);
        this.is_tween = true;
        if (this.list_visible) {
            tw.to({ scaleY: 0 }, 100).call(this.tweenFinish, this);
        }
        else {
            tw.to({ scaleY: 1 }, 100).call(this.tweenFinish, this);
        }
    };
    p.tweenFinish = function () {
        this.is_tween = false;
        this.list_visible = !this.list_visible;
    };
    p.setTween = function (b) {
        this.is_tween = b;
    };
    p.clear = function (e) {
        for (var i; i < this.chapter_arr.length; i++) {
            this.chapter_arr[i].filters = null;
            this.chapter_arr[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.selectChapter, this);
        }
        egret.Tween.removeTweens(this.select_ui);
        this.removeChildren();
        this.head.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickChapter, this);
        this.head = null;
        this.current_chapter_img = null;
        this.select_ui = null;
        this.selected_broad_img = null;
        this.chapter_arr = null;
    };
    return ChapterSelectUI;
}(eui.Component));
egret.registerClass(ChapterSelectUI,'ChapterSelectUI');
//# sourceMappingURL=ChapterSelectUI.js.map