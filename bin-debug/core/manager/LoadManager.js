/**
 *
 * @author
 *
 */
var LoadManager = (function (_super) {
    __extends(LoadManager, _super);
    function LoadManager() {
        _super.call(this);
    }
    var d = __define,c=LoadManager,p=c.prototype;
    LoadManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new LoadManager();
        }
        return this.instance;
    };
    p.startLoad = function (groupname, keys, event_name, override) {
        if (override === void 0) { override = false; }
        if (this.loading_view == null) {
            this.loading_view = new LoadingInGameUI();
        }
        UIManager.getInstance().loadingCon.addChild(this.loading_view);
        this.group_name = groupname;
        this.event_name = event_name;
        RES.createGroup(groupname, keys, override);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup(groupname);
    };
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == this.group_name) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.dispatchComplete();
        }
        if (this.loading_view != null && this.loading_view.parent != null) {
            this.loading_view.clear();
            this.loading_view.parent.removeChild(this.loading_view);
        }
    };
    p.dispatchComplete = function () {
        var event = new MyUIEvent(this.event_name);
        event.data = { groupname: this.group_name };
        this.dispatchEvent(event);
    };
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    p.onResourceLoadError = function (event) {
        console.warn("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);
    };
    p.onResourceProgress = function (event) {
        if (event.groupName == this.group_name && this.loading_view != null) {
            this.loading_view.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    return LoadManager;
}(egret.EventDispatcher));
egret.registerClass(LoadManager,'LoadManager');
//# sourceMappingURL=LoadManager.js.map