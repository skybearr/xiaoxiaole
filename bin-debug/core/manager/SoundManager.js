/**
 *
 * @author
 *
 */
var SoundManager = (function () {
    function SoundManager() {
        this.bg_position = 0;
        this.sound_switch = false;
        this.sound_effect_switch = false;
    }
    var d = __define,c=SoundManager,p=c.prototype;
    SoundManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new SoundManager();
        }
        return this.instance;
    };
    /**打开/关闭背景音乐*/
    p.playBgSound = function (b) {
        this.sound_switch = b;
        if (b) {
            if (this.bgSound == null) {
                this.bgSound = RES.getRes("bg_mp3");
            }
            if (this.bgChannel != null) {
                this.bgChannel.stop();
                this.bgChannel = null;
            }
            this.bgChannel = this.bgSound.play(this.bg_position, 0);
        }
        else {
            if (this.bgChannel != null) {
                this.bg_position = this.bgChannel.position;
                this.bgChannel.stop();
                this.bgChannel = null;
            }
            else {
                this.bg_position = 0;
            }
        }
    };
    /**音效开关*/
    p.setSoundEffectSwitch = function (b) {
        this.sound_effect_switch = b;
    };
    /**播放音效*/
    p.playEffectSound = function (str) {
        if (str === void 0) { str = "sound_11_wav"; }
        if (!this.sound_effect_switch) {
            return;
        }
        var sound = RES.getRes(str);
        if (sound != null) {
            var channel = sound.play(0, 1);
            var obj = { s: sound, c: channel };
            var complete = function () {
                this.c.stop();
                this.c = null;
                this.s = null;
            };
            channel.addEventListener(egret.Event.SOUND_COMPLETE, complete, obj);
        }
    };
    return SoundManager;
}());
egret.registerClass(SoundManager,'SoundManager');
//# sourceMappingURL=SoundManager.js.map