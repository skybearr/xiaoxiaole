/**
 *
 * @author
 *
 */
var SettingUI = (function (_super) {
    __extends(SettingUI, _super);
    function SettingUI() {
        _super.call(this);
        this.skinName = "resource/assets/skins/SettingSkin.exml";
    }
    var d = __define,c=SettingUI,p=c.prototype;
    p.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.back_btn = new BaseButton("goback_btn_png");
        this.back_btn.anchorOffsetX = this.back_btn.bg.width / 2;
        this.back_btn.x = GlobalData.GameStage_width / 2;
        this.back_btn.y = this.bg.y + this.bg.height - this.back_btn.bg.height / 2;
        this.addChild(this.back_btn);
        this.back_btn.startTween();
        this.sound_close.visible = !SoundManager.getInstance().sound_switch;
        this.sound_eff_close.visible = !SoundManager.getInstance().sound_effect_switch;
        this.initEvent();
    };
    p.initEvent = function () {
        this.back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
        this.sound_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickSoundSwitch, this);
        this.sound_eff_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickSoundEffectSwitch, this);
        this.once(egret.Event.REMOVED_FROM_STAGE, this.clear, this);
    };
    p.clickSoundSwitch = function () {
        SoundManager.getInstance().playBgSound(!SoundManager.getInstance().sound_switch);
        this.sound_close.visible = !SoundManager.getInstance().sound_switch;
        SoundManager.getInstance().playEffectSound();
    };
    p.clickSoundEffectSwitch = function () {
        SoundManager.getInstance().setSoundEffectSwitch(!SoundManager.getInstance().sound_effect_switch);
        this.sound_eff_close.visible = !SoundManager.getInstance().sound_effect_switch;
        SoundManager.getInstance().playEffectSound();
    };
    p.clickBack = function () {
        SoundManager.getInstance().playEffectSound();
        UIManager.getInstance().closeSecondUI();
    };
    p.clear = function () {
        this.back_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickBack, this);
        this.sound_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickSoundSwitch, this);
        this.sound_eff_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickSoundEffectSwitch, this);
    };
    return SettingUI;
}(BaseSecondUI));
egret.registerClass(SettingUI,'SettingUI');
//# sourceMappingURL=SettingUI.js.map