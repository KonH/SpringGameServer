var VerboseLogger = (function () {
    function VerboseLogger() {
    }
    VerboseLogger.prototype.log = function (message) {
        console.log(message);
    };
    return VerboseLogger;
}());
var logger = new VerboseLogger();
