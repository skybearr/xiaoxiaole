/**
 *
 * @author
 *
 */
var ChapterSelect = (function (_super) {
    __extends(ChapterSelect, _super);
    function ChapterSelect() {
        _super.call(this);
        this.skinName = "ChapterSelectSkin";
        this.horizontalCenter = 0;
        this.top = 60;
        this.init();
    }
    var d = __define,c=ChapterSelect,p=c.prototype;
    p.init = function () {
        this.chapter_arr = [this.chapter1, this.chapter2, this.chapter3, this.chapter4];
        this.chapter1.filters = this.chapter2.filters = FilterUtil.getGrayFilter();
    };
    p.setSelect = function (i) {
        if (i > 1) {
        }
    };
    return ChapterSelect;
}(eui.Component));
egret.registerClass(ChapterSelect,'ChapterSelect');
//# sourceMappingURL=ChapterSelect.js.map