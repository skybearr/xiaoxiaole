/**
 *
 * @author
 *
 */
var FilterUtil = (function () {
    function FilterUtil() {
    }
    var d = __define,c=FilterUtil,p=c.prototype;
    /**灰色滤镜*/
    FilterUtil.getGrayFilter = function () {
        var colorMatrix = [
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        return [colorFlilter];
    };
    /**模糊滤镜*/
    FilterUtil.getBlurFilter = function () {
        var blurFliter = new egret.BlurFilter(1, 1);
        return [blurFliter];
    };
    return FilterUtil;
}());
egret.registerClass(FilterUtil,'FilterUtil');
//# sourceMappingURL=FilterUtil.js.map