/**
 *
 * @author
 *
 */
var AVGLogic = (function () {
    function AVGLogic() {
    }
    var d = __define,c=AVGLogic,p=c.prototype;
    AVGLogic.getInstance = function () {
        if (this.instance == null) {
            this.instance = new AVGLogic();
        }
        return this.instance;
    };
    /**开始剧情*/
    p.startAVG = function (mission_id) {
        FightLogic.getInstance().startFight(mission_id);
    };
    return AVGLogic;
}());
egret.registerClass(AVGLogic,'AVGLogic');
//# sourceMappingURL=AVGLogic.js.map