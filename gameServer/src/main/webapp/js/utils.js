var Utils = (function () {
    function Utils() {
    }
    Utils.clearChilds = function (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };
    return Utils;
}());
