var TrasferCommand = (function () {
    function TrasferCommand(from, to, itemName, itemCount) {
        this.from = from;
        this.to = to;
        this.item = new Item(itemName, itemCount);
    }
    return TrasferCommand;
}());
var UserDropdown = (function () {
    function UserDropdown(listId, seletedId) {
        this.itemList = document.getElementById(listId);
        this.itemSelected = document.getElementById(seletedId);
        this.clear();
    }
    UserDropdown.prototype.setSelected = function (userId, userName) {
        this.selectedId = userId;
        this.itemSelected.innerText = userName;
    };
    UserDropdown.prototype.clear = function () {
        Utils.clearChilds(this.itemList);
        this.setSelected(-1, "none");
    };
    UserDropdown.prototype.fill = function (users) {
        var _this = this;
        this.clear();
        users.forEach(function (u) { return _this.addUser(u); });
    };
    UserDropdown.prototype.addUser = function (user) {
        var _this = this;
        var item = document.createElement("li");
        var btn = document.createElement("button");
        btn.onclick = function () { return _this.onSelect(user); };
        btn.innerText = user.name;
        item.appendChild(btn);
        this.itemList.appendChild(item);
    };
    UserDropdown.prototype.onSelect = function (user) {
        this.setSelected(user.id, user.name);
    };
    return UserDropdown;
}());
var TransferController = (function () {
    function TransferController() {
        this.fromDropdown = new UserDropdown("from_list", "from_selected");
        this.toDropdown = new UserDropdown("to_list", "to_selected");
        this.makeButton = Utils.getButtonById("transfer-btn");
        this.itemNameInput = Utils.getInputById("transfer_item_name");
        this.itemCountInput = Utils.getInputById("transfer_item_count");
    }
    TransferController.prototype.update = function (users) {
        this.fromDropdown.fill(users);
        this.toDropdown.fill(users);
    };
    TransferController.prototype.apply = function () {
        var fromId = this.fromDropdown.selectedId;
        var toId = this.toDropdown.selectedId;
        if ((fromId > 0) && (toId > 0)) {
            var itemName = this.itemNameInput.value;
            var itemCount = parseInt(this.itemCountInput.value);
            this.makeTransfer(fromId, toId, itemName, itemCount, function () { return userController.loadUsers(); });
        }
    };
    TransferController.prototype.makeTransfer = function (from, to, itemName, itemCount, callback) {
        logger.log("TC: make transfer: " + from + " => " + to + " (" + itemName + ":" + itemCount + ")");
        var command = new TrasferCommand(from, to, itemName, itemCount);
        var commandContent = JSON.stringify(command);
        logger.log("TC: make trasfer: commandContent: " + commandContent);
        jQuery.ajax({
            type: "POST",
            url: "/transfer",
            data: commandContent,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function () { return callback(); }
        }).fail(function () { return alert("Failed to transfer!"); });
    };
    return TransferController;
}());
var transferController = new TransferController();
