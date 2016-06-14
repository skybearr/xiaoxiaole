/**
 *
 * @author
 *
 */
var StoryLogic = (function (_super) {
    __extends(StoryLogic, _super);
    function StoryLogic() {
        _super.call(this);
        /**章节中的关卡数据 x,y,width,最后一个是更多游戏按钮的位置*/
        this.chapter_data = [[493, 352, 220, 237, 448, 200, 451, 613, 220, 177, 642, 0],
            [493, 352, 220, 237, 448, 200, 451, 613, 220, 177, 642, 0],
            [493, 352, 220, 237, 448, 200, 451, 613, 220, 177, 642, 0],
            [493, 352, 220, 237, 448, 200, 451, 613, 220, 177, 642, 0]];
    }
    var d = __define,c=StoryLogic,p=c.prototype;
    StoryLogic.getInstance = function () {
        if (this.instance == null) {
            this.instance = new StoryLogic();
        }
        return this.instance;
    };
    p.openStory = function () {
        //获取网络数据，得到关卡信息
        this.current_chapterID = 3;
        this.current_missionID = 18;
        this.openUI();
    };
    p.openUI = function () {
        UIManager.getInstance().openFirstUI(UIManager.CLASS_UI_INDEX_STORY, TweenManager.TWEEN_UI_RANDOM);
    };
    StoryLogic.MISSION_STATE_LOCK = 0;
    StoryLogic.MISSION_STATE_WANTED = 1;
    StoryLogic.MISSION_STATE_FINISH = 2;
    StoryLogic.MISSION_ITEM_STATE_LOCK = 0;
    StoryLogic.MISSION_ITEM_STATE_WANTED = 1;
    StoryLogic.MISSION_ITEM_STATE_FINISH = 2;
    /**没一个大关卡中小关卡的数量*/
    StoryLogic.MISSION_LIST_NUM = 15;
    return StoryLogic;
}(egret.EventDispatcher));
egret.registerClass(StoryLogic,'StoryLogic');
//# sourceMappingURL=StoryLogic.js.map