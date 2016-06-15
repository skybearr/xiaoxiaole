/**
 *
 * @author
 *
 */
var MissionItem = (function (_super) {
    __extends(MissionItem, _super);
    /**
     * @param id 显示的关卡数字
     * @param star 星数 如果锁定状态，则不显示，待打状态为0星
     * @param state 状态  0锁定 1代打 2通关*/
    function MissionItem(id, star, state) {
        _super.call(this);
        this.mission_id = id;
        this.src_str = "listli_bg" + (Math.ceil(id / 15) - 1) + (state == StoryLogic.MISSION_ITEM_STATE_LOCK ? "n" : "");
        var texture = RES.getRes(this.src_str);
        this.bg = new eui.Image(texture);
        this.addChild(this.bg);
        this.star = new eui.Group();
        this.star.horizontalCenter = 0;
        this.star.top = texture.textureHeight + 18;
        this.addChild(this.star);
        this.width_set = texture.textureWidth;
        this.height_set = texture.textureHeight + 40;
        this.bg_height = texture.textureHeight;
        this.changeState(state, star);
    }
    var d = __define,c=MissionItem,p=c.prototype;
    p.changeState = function (s, star_num) {
        this.state = s;
        if (s == StoryLogic.MISSION_ITEM_STATE_LOCK) {
            var t1 = RES.getRes("mainsuo");
            this.lock = new eui.Image(t1);
            this.lock.x = (this.width_set - t1.textureWidth) / 2;
            this.lock.y = (this.bg_height - t1.textureHeight) / 2;
            this.addChild(this.lock);
        }
        else if (s == StoryLogic.MISSION_ITEM_STATE_WANTED) {
            this.addNumImage();
            this.changeStar(0);
        }
        else {
            this.addNumImage();
            this.changeStar(star_num);
        }
    };
    p.addNumImage = function () {
        if (this.mission_id_img != null && this.mission_id_img.parent != null) {
            return;
        }
        //        var mission_id_img: egret.Sprite = ViewUtil.getArtNum("wnum_",id.toString());
        //        mission_id_img.x = (texture.textureWidth - mission_id_img.width)/2;
        //        mission_id_img.y = (texture.textureHeight - mission_id_img.height)/2;
        //        this.addChild(mission_id_img);
        var mission_id_img = new eui.Label();
        mission_id_img.text = this.mission_id.toString();
        mission_id_img.x = (this.width_set - mission_id_img.width) / 2;
        mission_id_img.y = (this.bg_height - mission_id_img.height) / 2;
        this.addChild(mission_id_img);
    };
    p.changeStar = function (n) {
        this.star.removeChildren();
        for (var i = 0; i < 3; i++) {
            var t = RES.getRes(i < n ? "listli_starl" : "listli_stara");
            var s = new eui.Image(t);
            s.anchorOffsetY = t.textureHeight / 2;
            //            s.x = (t.textureWidth + 2) * i;
            s.x = 35 * i;
            this.star.addChild(s);
        }
    };
    p.clear = function () {
        this.star.removeChildren();
        this.bg = null;
        this.star = null;
        this.lock = null;
        this.mission_id_img = null;
    };
    return MissionItem;
}(eui.Group));
egret.registerClass(MissionItem,'MissionItem');
//# sourceMappingURL=MissionItem.js.map