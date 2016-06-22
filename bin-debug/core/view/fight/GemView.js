/**
 *
 * @author
 *
 */
var GemView = (function (_super) {
    __extends(GemView, _super);
    function GemView(i, v) {
        _super.call(this);
        this.width_set = 100;
        this.height_set = 90;
        this.vo = v;
        this.addChild(ViewUtil.getShape(this.width_set, this.height_set));
        this.init();
    }
    var d = __define,c=GemView,p=c.prototype;
    /**当合成战士时，宝石暂时做隐藏*/
    p.setAppear = function (b) {
        this.visible = b;
        this.touchChildren = this.touchEnabled = b;
    };
    /**合成战士前的特效*/
    p.changeBomb = function () {
        this.bg.visible = false;
        var data = RES.getRes("bomb_json");
        var txtr = RES.getRes("bomb_png");
        var mcFactory = new egret.MovieClipDataFactory(data, txtr);
        var mc = new egret.MovieClip(mcFactory.generateMovieClipData(this.vo.index % 2 == 0 ? "bomb1" : "bomb2"));
        mc.x = (this.width_set - mc.width) / 2;
        mc.y = (this.height_set - mc.height) / 2;
        this.addChild(mc);
        mc.play();
        mc.once(egret.Event.COMPLETE, function (e) {
            if (mc != null && mc.parent != null) {
                mc.parent.removeChild(mc);
            }
        }, this);
    };
    /**更换索引（位置）*/
    p.setIndex = function (i) {
        this.vo.index = i;
    };
    /**晃动*/
    p.startTween = function (b) {
        if (b) {
            this.bg.rotation = -20;
            var tw = egret.Tween.get(this.bg, { loop: true });
            tw.to({ rotation: 20 }, 200).to({ rotation: -20 }, 200);
        }
        else {
            egret.Tween.removeTweens(this.bg);
            this.bg.rotation = 0;
        }
    };
    p.init = function () {
        var texture = RES.getRes("fight_" + this.vo.type);
        this.bg = new eui.Image(texture);
        this.bg.anchorOffsetX = texture.textureWidth / 2;
        this.bg.anchorOffsetY = texture.textureHeight / 2;
        this.bg.x = texture.textureWidth / 2;
        this.bg.y = texture.textureHeight / 2;
        this.bg.smoothing = true;
        this.addChild(this.bg);
        this.initEvent();
    };
    p.initEvent = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    p.click = function () {
        FightLogic.getInstance().setSelectGem(this.vo.index);
    };
    p.clear = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
    };
    return GemView;
}(egret.Sprite));
egret.registerClass(GemView,'GemView');
//# sourceMappingURL=GemView.js.map