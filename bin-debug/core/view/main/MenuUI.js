/**
 *
 * @author
 *
 */
var MenuUI = (function (_super) {
    __extends(MenuUI, _super);
    function MenuUI() {
        _super.call(this);
        this.skinName = "MainMenuSkin";
    }
    var d = __define,c=MenuUI,p=c.prototype;
    p.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        //返回按钮
        this.back_btn = new BaseButton("menubtnbg_png");
        this.back_btn.x = 0;
        this.back_btn.y = -30;
        var bmp = new egret.Bitmap(RES.getRes("fanhui_png"));
        bmp.x = (this.back_btn.bg.width - bmp.width) / 2;
        bmp.y = 238;
        this.back_btn.bg.addChild(bmp);
        this.addChild(this.back_btn);
        this.back_btn.startTween();
        //商城按钮背景旋转
        var tw = egret.Tween.get(this.shop_bg, { loop: true });
        tw.to({ rotation: this.rotation + 1000 }, 3000);
        //经验条
        this.expbar.setBarMinMax(22, 238);
        this.expbar.setProgress(700, 1000);
        //购买道具
        this.buy_prop_btn_arr = [];
        for (var i = 0; i < 4; i++) {
            this['prop' + (i + 1)].addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBuyProp, this);
        }
        //强化城墙
        this.update_wall_btn_arr = [];
        this.initEvent();
    };
    p.initEvent = function () {
        this.back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
        this.shop_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickShop, this);
        this.setting_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickSetting, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    p.clickSetting = function () {
        SoundManager.getInstance().playEffectSound();
        UIManager.getInstance().openSecondUI(new SettingUI(), TweenManager.TWEEN_UI_MOVE);
    };
    p.clickShop = function () {
        SoundManager.getInstance().playEffectSound();
        UIManager.getInstance().openSecondUI(new ShopUI(), TweenManager.TWEEN_UI_SCALE);
    };
    p.clickBack = function (e) {
        SoundManager.getInstance().playEffectSound();
        var tw = egret.Tween.get(this);
        tw.to({ x: -this.width }, 300).call(this.tweenFinish, this);
    };
    p.tweenFinish = function () {
        if (this.parent != null) {
            this.parent.removeChild(this);
            StoryLogic.getInstance().dispatchEvent(new MyUIEvent(MyUIEvent.CLOSE_MENU));
        }
    };
    p.clickBuyProp = function (e) {
        SoundManager.getInstance().playEffectSound();
    };
    p.clickUpdateWall = function (e) {
        SoundManager.getInstance().playEffectSound();
    };
    p.clear = function (e) {
        this.back_btn.clear();
        this.back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
        for (var i = 0; i < this.buy_prop_btn_arr.length; i++) {
            this.buy_prop_btn_arr[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBuyProp, this);
            this.buy_prop_btn_arr[i] = null;
        }
        for (var i = 0; i < this.update_wall_btn_arr.length; i++) {
            this.update_wall_btn_arr[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickUpdateWall, this);
            this.update_wall_btn_arr[i] = null;
        }
        egret.Tween.removeTweens(this.shop_bg);
        this.expbar.clear();
        this.back_btn = null;
        this.shop_bg = null;
        this.shop_btn = null;
        this.expbar = null;
        this.role_lv = null;
        this.role_atk = null;
        this.help_btn = null;
        this.coint_txt = null;
        this.setting_btn = null;
        this.buy_prop_btn_arr = null;
        this.prop_num_arr = null;
        this.update_wall_btn_arr = null;
        this.wall_lv_arr = null;
        this.wall_select = null;
    };
    return MenuUI;
}(BasePopUI));
egret.registerClass(MenuUI,'MenuUI');
//# sourceMappingURL=MenuUI.js.map