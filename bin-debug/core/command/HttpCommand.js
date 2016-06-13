/**
 *
 * @author
 *
 */
var HttpCommand = (function () {
    function HttpCommand() {
        this.http_url = "http://api.fx1q.com/";
        this.http_key = "Vbu1WSodPL!4fNg3";
        this.http_head = "Accept:application/vnd.qq5.v1+json;charset=UTF-8";
    }
    var d = __define,c=HttpCommand,p=c.prototype;
    HttpCommand.getInstance = function () {
        if (this.instance == null) {
            this.instance = new HttpCommand();
        }
        return this.instance;
    };
    p.test = function () {
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        var data = this.getString("");
        request.open("http://api.qq5.com/res/news", egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", this.http_head);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
    };
    p.onGetComplete = function (e) {
        console.log("postComplete" + e);
    };
    p.onGetIOError = function (e) {
        var request = e.currentTarget.response;
        console.log("postError:" + e);
        console.log("postError:" + request.response);
        console.log("postError:" + e.data);
    };
    p.onGetProgress = function (e) {
        console.log("postProgress" + e);
    };
    /**
    * qq5采用json数据
    */
    p.getString = function (data) {
        var data64 = Base64Util.encode(data);
        var time = Math.floor(new Date().getTime() / 1000).toString();
        return "&data=" + data64 +
            "&time=" + time +
            "&sign=" + new md5().hex_md5(data64 + time + this.http_url) +
            "&device_type=" + "android" +
            "&version=" + "1.2.1";
    };
    return HttpCommand;
}());
egret.registerClass(HttpCommand,'HttpCommand');
//# sourceMappingURL=HttpCommand.js.map