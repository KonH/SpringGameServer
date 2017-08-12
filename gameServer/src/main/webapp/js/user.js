var User = (function () {
    function User(id, name, items) {
        this.id = id;
        this.name = name;
        this.items = items;
    }
    User.prototype.getItemsString = function () {
        var result = "";
        this.items.forEach(function (item) {
            result += item.name + ": " + item.count + "; ";
        });
        return result;
    };
    return User;
}());
