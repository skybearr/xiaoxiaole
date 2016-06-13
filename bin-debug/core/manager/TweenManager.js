/**
 *
 * @author
 *
 */
var TweenManager = (function () {
    function TweenManager() {
        this.tween_ui_time = 500;
    }
    var d = __define,c=TweenManager,p=c.prototype;
    TweenManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new TweenManager();
        }
        return this.instance;
    };
    p.uiDisappearTween = function (ui, type, extra, callback, thisObj) {
        var tw = egret.Tween.get(ui);
        var xx = 0;
        var yy = 0;
        if (type == TweenManager.TWEEN_UI_MOVE) {
            if (extra == 0) {
                xx = GlobalData.GameStage_width;
            }
            else if (extra == 1) {
                yy = GlobalData.GameStage_height;
            }
            else if (extra == 2) {
                xx = -GlobalData.GameStage_width;
            }
            else {
                yy = -GlobalData.GameStage_height;
            }
            if (callback == null) {
                tw.to({ x: xx, y: yy }, this.tween_ui_time);
            }
            else {
                tw.to({ x: xx, y: yy }, this.tween_ui_time).call(callback, thisObj);
            }
        }
        else if (type == TweenManager.TWEEN_UI_SCALE) {
            tw.to({ alpha: 0 }, this.tween_ui_time);
            if (callback == null) {
                tw.to({ alpha: 0 }, this.tween_ui_time);
            }
            else {
                tw.to({ alpha: 0 }, this.tween_ui_time).call(callback, thisObj);
            }
        }
        else if (type == TweenManager.TWEEN_UI_SCALE_ROTATION) {
            if (extra == 0) {
                xx = GlobalData.GameStage_width;
                yy = -GlobalData.GameStage_height;
            }
            else if (extra == 1) {
                xx = GlobalData.GameStage_width;
                yy = GlobalData.GameStage_height;
            }
            else if (extra == 2) {
                xx = -GlobalData.GameStage_width;
                yy = GlobalData.GameStage_height;
            }
            else {
                xx = -GlobalData.GameStage_width;
                yy = -GlobalData.GameStage_height;
            }
            if (callback == null) {
                tw.to({ x: xx, y: yy, scaleX: 0.01, scaleY: 0.01, rotation: 720 }, this.tween_ui_time);
            }
            else {
                tw.to({ x: xx, y: yy, scaleX: 0.01, scaleY: 0.01, rotation: 720 }, this.tween_ui_time).call(callback, thisObj);
            }
        }
    };
    p.uiAppearTween = function (ui, type, extra, callback, thisObj) {
        var tw = egret.Tween.get(ui);
        //先根据类型初始化状态 
        if (type == TweenManager.TWEEN_UI_MOVE) {
            if (extra == 0) {
                ui.x = -GlobalData.GameStage_width;
            }
            else if (extra == 1) {
                ui.y = -GlobalData.GameStage_height;
            }
            else if (extra == 2) {
                ui.x = GlobalData.GameStage_width;
            }
            else {
                ui.y = GlobalData.GameStage_height;
            }
            if (callback == null) {
                tw.to({ x: 0, y: 0 }, this.tween_ui_time);
            }
            else {
                tw.to({ x: 0, y: 0 }, this.tween_ui_time).call(callback, thisObj);
            }
        }
        else if (type == TweenManager.TWEEN_UI_SCALE) {
            if (extra == 0) {
            }
            else if (extra == 1) {
                ui.x = GlobalData.GameStage_height / 2;
            }
            else if (extra == 2) {
                ui.y = GlobalData.GameStage_width / 2;
            }
            else if (extra == 2) {
                ui.x = -GlobalData.GameStage_width / 2;
            }
            else {
                ui.y = -GlobalData.GameStage_height / 2;
            }
            ui.scaleX = ui.scaleY = 0.01;
            if (callback == null) {
                tw.to({ x: 0, y: 0, scaleX: 1, scaleY: 1, alpha: 1 }, this.tween_ui_time);
            }
            else {
                tw.to({ x: 0, y: 0, scaleX: 1, scaleY: 1, alpha: 1 }, this.tween_ui_time).call(callback, thisObj);
            }
        }
        else if (type == TweenManager.TWEEN_UI_SCALE_ROTATION) {
            ui.alpha = 0;
            if (callback == null) {
                tw.to({ alpha: 1 }, this.tween_ui_time);
            }
            else {
                tw.to({ alpha: 1 }, this.tween_ui_time).call(callback, thisObj);
            }
        }
    };
    /**随机取 非0的任意一种*/
    TweenManager.TWEEN_UI_RANDOM = -1;
    TweenManager.TWEEN_UI_NONE = 0;
    TweenManager.TWEEN_UI_MOVE = 1;
    TweenManager.TWEEN_UI_SCALE = 2;
    TweenManager.TWEEN_UI_SCALE_ROTATION = 3;
    return TweenManager;
}());
egret.registerClass(TweenManager,'TweenManager');
//# sourceMappingURL=TweenManager.js.map