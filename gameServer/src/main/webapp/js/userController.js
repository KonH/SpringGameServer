var UserController = (function () {
    function UserController() {
        logger.log("UC: start init");
        this.initElements();
        this.loadUsers();
        this.updateButtonStates(true, false);
        this.curUser = new User(0, "", []);
        logger.log("UC: inited");
    }
    UserController.prototype.getElementById = function (id) {
        return document.getElementById(id);
    };
    UserController.prototype.initButton = function (id, handler) {
        var button = this.getElementById(id);
        button.onclick = function () { return handler(); };
        return button;
    };
    UserController.prototype.initElements = function () {
        var _this = this;
        this.addButton =
            this.initButton("user-add-btn", function () { return _this.addUser(); });
        this.addItemButton =
            this.initButton("user-add-item-btn", function () { return _this.addItem(); });
        this.updateButton =
            this.initButton("user-update-btn", function () { return _this.updateCurrentUser(); });
        this.refreshButton =
            this.initButton("user-refresh-btn", function () { return _this.loadUsers(); });
        this.nameInput =
            this.getElementById("user-name");
        this.userList = this.getElementById("user-list");
        this.itemList = this.getElementById("user-items");
    };
    UserController.prototype.updateButtonStates = function (canAdd, canUpdate) {
        this.addButton.style.display = canAdd ? "block" : "none";
        this.updateButton.style.display = canUpdate ? "block" : "none";
    };
    UserController.prototype.resetCurrentUser = function () {
        this.nameInput.value = "";
        Utils.clearChilds(this.itemList);
    };
    UserController.prototype.addUser = function () {
        var _this = this;
        var name = this.nameInput.value;
        var user = this.curUser;
        user.name = name;
        this.readItems();
        logger.log("UC: add user: " + user);
        var userContent = JSON.stringify(user);
        jQuery.ajax({
            type: "POST",
            url: "/users",
            data: userContent,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function () { return _this.loadUsers(); }
        }).fail(function () { return alert("Failed to add!"); });
        this.resetCurrentUser();
    };
    UserController.prototype.loadUsers = function () {
        var _this = this;
        logger.log("UC: load users");
        jQuery.ajax({
            type: "GET",
            url: "/users",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) { return _this.onUsersRetrieved(data); }
        });
    };
    UserController.prototype.onUsersRetrieved = function (data) {
        var _this = this;
        logger.log("UC: on users retrieved: " + data);
        var users = [];
        data.forEach(function (element) {
            var user = new User(element["id"], element["name"], element["items"]);
            users.push(user);
        });
        Utils.clearChilds(this.userList);
        logger.log("UC: retrieved users: " + users.length);
        users.forEach(function (user) { return _this.appendUser(user); });
        this.resetCurrentUser();
        transferController.update(users);
    };
    UserController.prototype.appendTableElement = function (row, content) {
        var item = document.createElement("td");
        item.appendChild(content);
        row.appendChild(item);
    };
    UserController.prototype.appendTableData = function (row, content) {
        var item = document.createElement("td");
        item.innerText = content;
        row.appendChild(item);
    };
    UserController.prototype.createButton = function (name, handler) {
        var button = document.createElement("button");
        button.className = "btn btn-default";
        button.innerText = name;
        button.onclick = function () { return handler(); };
        return button;
    };
    UserController.prototype.createInput = function (placeHolder, value) {
        var input = document.createElement("input");
        input.className = "form-control";
        input.setAttribute("placeholder", placeHolder);
        input.value = value;
        return input;
    };
    UserController.prototype.appendUserControls = function (row, user) {
        var _this = this;
        var block = document.createElement("td");
        block.appendChild(this.createButton("Update", function () { return _this.updateUser(user); }));
        block.appendChild(this.createButton("Delete", function () { return _this.deleteUser(user.id); }));
        row.appendChild(block);
    };
    UserController.prototype.updateUser = function (user) {
        this.curUser = user;
        this.nameInput.value = user.name;
        this.loadItems();
        this.updateButtonStates(false, true);
    };
    UserController.prototype.updateCurrentUser = function () {
        var _this = this;
        var name = this.nameInput.value;
        this.curUser.name = name;
        this.readItems();
        logger.log("UC: update user: " + this.curUser);
        var userContent = JSON.stringify(this.curUser);
        jQuery.ajax({
            type: "PATCH",
            url: "/users",
            data: userContent,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function () { return _this.loadUsers(); }
        }).fail(function () { return alert("Failed to update!"); });
        this.updateButtonStates(true, false);
        this.resetCurrentUser();
        this.curUser = new User(0, "", []);
    };
    UserController.prototype.deleteUser = function (id) {
        var _this = this;
        logger.log("UC: delete user: " + id);
        jQuery.ajax({
            type: "DELETE",
            url: "/users/" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function () { return _this.loadUsers(); }
        });
    };
    UserController.prototype.appendUser = function (user) {
        var row = document.createElement("tr");
        this.appendTableData(row, user.id.toString());
        this.appendTableData(row, user.name);
        this.appendTableData(row, user.getItemsString());
        this.appendUserControls(row, user);
        this.userList.appendChild(row);
    };
    UserController.prototype.loadItems = function () {
        var _this = this;
        var user = this.curUser;
        user.items.forEach(function (item) {
            return _this.appendItem(user, item);
        });
    };
    UserController.prototype.readItems = function () {
        var itemNodes = this.itemList.childNodes;
        var newItems = [];
        itemNodes.forEach(function (node) {
            var name = node.childNodes[0].childNodes[0].value;
            var count = parseInt(node.childNodes[1].childNodes[0].value);
            var item = new Item(name, count);
            newItems.push(item);
        });
        this.curUser.items = newItems;
    };
    UserController.prototype.appendItem = function (user, item) {
        var _this = this;
        var row = document.createElement("tr");
        this.appendTableElement(row, this.createInput("Item Name", item.name));
        this.appendTableElement(row, this.createInput("Item Count", item.count.toString()));
        this.appendTableElement(row, this.createButton("-", function () { return _this.removeItem(row, user, item); }));
        this.itemList.appendChild(row);
    };
    UserController.prototype.removeItem = function (element, user, item) {
        var index = user.items.indexOf(item);
        user.items.splice(index, 1);
        element.remove();
    };
    UserController.prototype.addItem = function () {
        var item = new Item("", 0);
        this.curUser.items.push(item);
        this.appendItem(this.curUser, item);
    };
    return UserController;
}());
var userController = new UserController();
