var ContentLoader = (function () {
    function ContentLoader() {
    }
    ContentLoader.prototype.clear = function () {
        logger.log("CL: clear content");
        Utils.clearChilds(document.getElementById("content"));
    };
    ContentLoader.prototype.load = function (page) {
        this.clear();
        logger.log("CL: load: " + page);
        jQuery("#content").load(page + ".html");
    };
    return ContentLoader;
}());
var loader = new ContentLoader();
