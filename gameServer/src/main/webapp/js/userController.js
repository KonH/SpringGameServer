var UserController = (function () {
    function UserController() {
        this.initElements();
        this.loadUsers();
        this.updateButtonStates(true, false);
    }
    UserController.prototype.initButton = function (id, handler) {
        var button = document.getElementById(id);
        button.onclick = function () { return handler(); };
        return button;
    };
    UserController.prototype.initElements = function () {
        var _this = this;
        this.addButton =
            this.initButton("user-add-btn", function () { return _this.addUser(); });
        this.updateButton =
            this.initButton("user-update-btn", function () { return _this.updateCurrentUser(); });
        this.updateButton =
            this.initButton("user-refresh-btn", function () { return _this.loadUsers(); });
        this.nameInput =
            document.getElementById("user-name");
    };
    UserController.prototype.updateButtonStates = function (canAdd, canUpdate) {
        this.addButton.style.display = canAdd ? "block" : "none";
        this.updateButton.style.display = canUpdate ? "block" : "none";
    };
    UserController.prototype.clearUserInput = function () {
        this.nameInput.value = "";
    };
    UserController.prototype.addUser = function () {
        var _this = this;
        var name = this.nameInput.value;
        var user = new User(0, name);
        var userContent = JSON.stringify(user);
        jQuery.ajax({
            type: "POST",
            url: "/users",
            data: userContent,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function () { return _this.loadUsers(); }
        }).fail(function () { return alert("Failed to add!"); });
        this.clearUserInput();
    };
    UserController.prototype.loadUsers = function () {
        var _this = this;
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
        var users = [];
        data.forEach(function (element) {
            var user = new User(element["id"], element["name"]);
            users.push(user);
        });
        var list = document.getElementById("user-list");
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        users.forEach(function (user) { return _this.appendUser(list, user); });
    };
    UserController.prototype.appendUserContent = function (row, content) {
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
        this.updateButtonStates(false, true);
    };
    UserController.prototype.updateCurrentUser = function () {
        var _this = this;
        var name = this.nameInput.value;
        this.curUser.name = name;
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
        this.clearUserInput();
        this.curUser = null;
    };
    UserController.prototype.deleteUser = function (id) {
        var _this = this;
        jQuery.ajax({
            type: "DELETE",
            url: "/users/" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function () { return _this.loadUsers(); }
        });
    };
    UserController.prototype.appendUser = function (list, user) {
        var row = document.createElement("tr");
        this.appendUserContent(row, user.id.toString());
        this.appendUserContent(row, user.name);
        this.appendUserControls(row, user);
        list.appendChild(row);
    };
    return UserController;
}());
var userController = new UserController();
