var Utils = (function () {
    function Utils() {
    }
    Utils.clearChilds = function (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };
    Utils.getButtonById = function (id) {
        return document.getElementById(id);
    };
    Utils.getInputById = function (id) {
        return document.getElementById(id);
    };
    return Utils;
}());
