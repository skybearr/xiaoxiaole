/**
 *
 * @author
 *
 */
var MissionUI = (function (_super) {
    __extends(MissionUI, _super);
    /**设置关卡
     * @param chapterID 当前点击的章节id 1开始
     * @param id 当前点击的大关卡 0开始 */
    function MissionUI(chapterID, index) {
        _super.call(this);
        this.charter_id = chapterID;
        this.mission_index = index;
        this.skinName = "MissionListSkin";
        this.once(egret.Event.ADDED_TO_STAGE, this.onStage, this);
    }
    var d = __define,c=MissionUI,p=c.prototype;
    p.onStage = function (e) {
        this.newest_mission_id = StoryLogic.getInstance().current_missionID;
        var shape = ViewUtil.getShape(GlobalData.GameStage_width, GlobalData.GameStage_height, 0x000000, 0.7);
        this.addChildAt(shape, 0);
        var texture = RES.getRes("listgk" + this.mission_index);
        this.mission_id_img = new eui.Image(texture);
        this.mission_id_img.anchorOffsetY = texture.textureHeight / 2;
        this.mission_id_img.x = 345;
        this.mission_id_img.y = 100 + this.title_bg.height / 2;
        this.addChild(this.mission_id_img);
        this.mission_list_con = new eui.Group();
        this.mission_list_con.horizontalCenter = 0;
        this.mission_list_con.top = 200;
        this.addChild(this.mission_list_con);
        this.mission_arr = [];
        for (var i = 0; i < StoryLogic.MISSION_LIST_NUM; i++) {
            var n = this.mission_index * StoryLogic.MISSION_LIST_NUM + (i + 1);
            var star = i % 4;
            var state = this.getState(i + 1); //关卡不是0开始 是1开始
            if (state == StoryLogic.MISSION_ITEM_STATE_WANTED) {
                this.current_mission_item = item;
                this.addCurrentHand();
            }
            var item = new MissionItem(n, star, state);
            item.name = n.toString();
            item.x = (item.width_set + 60) * (i % 3);
            item.y = (item.height_set + 10) * Math.floor(i / 3);
            this.mission_list_con.addChild(item);
            this.mission_arr.push(item);
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickItem, this);
        }
        this.initEvent();
    };
    p.addCurrentHand = function () {
    };
    p.getState = function (i) {
        if (this.charter_id < StoryLogic.getInstance().current_chapterID) {
            return StoryLogic.MISSION_ITEM_STATE_FINISH;
        }
        else {
            var index = Math.floor(this.newest_mission_id / StoryLogic.MISSION_LIST_NUM); //打过的大关卡
            if (this.mission_index < index) {
                return StoryLogic.MISSION_ITEM_STATE_FINISH;
            }
            else if (this.mission_index == index) {
                if (i < this.newest_mission_id % 15) {
                    return StoryLogic.MISSION_ITEM_STATE_FINISH;
                }
                else if (i == this.newest_mission_id % 15) {
                    return StoryLogic.MISSION_ITEM_STATE_WANTED;
                }
                else {
                    return StoryLogic.MISSION_ITEM_STATE_LOCK;
                }
            }
            else {
                return StoryLogic.MISSION_ITEM_STATE_LOCK;
            }
        }
    };
    p.initEvent = function () {
        this.back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
        StoryLogic.getInstance().addEventListener(MyUIEvent.UPDATE_MISSION_ITEM, this.updateMissionItem, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    p.updateMissionItem = function (e) {
        if (this.click_mission_item != null) {
            this.click_mission_item.changeState(StoryLogic.MISSION_ITEM_STATE_WANTED, 3);
        }
        //	    if(this.current_mission_item != null && e.data.id == this.current_mission_item.mission_id)
        //        {
        //            this.current_mission_item.changeState(StoryLogic.MISSION_ITEM_STATE_FINISH,0);
        //        }
    };
    p.clickBack = function (e) {
        if (this.parent != null) {
            this.parent.removeChild(this);
        }
    };
    p.clickItem = function (e) {
        this.click_mission_item = e.currentTarget;
        var n = parseInt(e.currentTarget.name);
        if (e.currentTarget.state == StoryLogic.MISSION_ITEM_STATE_LOCK) {
            console.log("点击第" + this.charter_id + "章节 第" + (this.mission_index + 1) + "关卡 第" + n + "小关此关卡还没开通");
        }
        else {
            console.log("点击第" + this.charter_id + "章节 第" + (this.mission_index + 1) + "关卡 第" + n + "小关");
        }
    };
    p.clear = function (e) {
        this.removeChildren();
        this.back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
        StoryLogic.getInstance().removeEventListener(MyUIEvent.UPDATE_MISSION_ITEM, this.updateMissionItem, this);
        for (var i; i < this.mission_arr.length; i++) {
            this.mission_arr[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickItem, this);
        }
        this.back_btn = null;
        this.mission_id_img = null;
        this.title_bg = null;
        this.mission_arr = null;
    };
    return MissionUI;
}(eui.Component));
egret.registerClass(MissionUI,'MissionUI');
//# sourceMappingURL=MissionUI.js.map