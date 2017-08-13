class UserController {
	nameInput : HTMLInputElement;
	userList : HTMLElement;
	itemList : HTMLElement;
	refreshButton : HTMLButtonElement;
	addButton : HTMLButtonElement;
	addItemButton : HTMLButtonElement;
	updateButton : HTMLButtonElement;
	curUser : User;

	constructor() {
		this.initElements();
		this.loadUsers();
		this.updateButtonStates(true, false);
		this.curUser = new User(0, "", []);
	}

	getElementById(id : string) : HTMLElement {
		return document.getElementById(id);
	}

	initButton(id : string, handler : Function) : HTMLButtonElement {
		let button = 
			<HTMLButtonElement>this.getElementById(id);
		button.onclick = () => handler();
		return button;
	}

	initElements() {
		this.addButton = 
			this.initButton("user-add-btn", () => this.addUser());
		this.addItemButton = 
			this.initButton("user-add-item-btn", () => this.addItem());
		this.updateButton = 
			this.initButton("user-update-btn", () => this.updateCurrentUser());
		this.refreshButton = 
			this.initButton("user-refresh-btn", () => this.loadUsers());
		this.nameInput = 
			<HTMLInputElement>this.getElementById("user-name");
		this.userList = this.getElementById("user-list");
		this.itemList = this.getElementById("user-items");
	}

	updateButtonStates(canAdd : boolean, canUpdate : boolean) {
		this.addButton.style.display = canAdd ? "block" : "none";
		this.updateButton.style.display = canUpdate ? "block" : "none";
	}

	clearUser() {
		this.nameInput.value = "";
		this.clearChilds(this.itemList);
	}

	addUser() {
		let name = this.nameInput.value;
		let user = this.curUser;
		user.name = name;
		this.readItems();
		let userContent = JSON.stringify(user);
		jQuery.ajax({
			type: "POST",
			url: "/users",
			data: userContent,
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			success: () => this.loadUsers()
		}).fail(() => alert( "Failed to add!" ));
		this.clearUser();
	}

	loadUsers() {
		jQuery.ajax({
			type: "GET",
			url: "/users",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (data) => this.onUsersRetrieved(data)
		});
	}

	clearChilds(element : HTMLElement) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}

	onUsersRetrieved(data) {
		let users : User[] = [];
		data.forEach(element => {
			var user = new User(
				element["id"], 
				element["name"], 
				element["items"]);
			users.push(user);
		});
		this.clearChilds(this.userList);
		users.forEach((user) => this.appendUser(user));
	}

	appendTableElement(row : HTMLElement, content : HTMLElement) {
		let item = document.createElement("td");
		item.appendChild(content);
		row.appendChild(item);
	}

	appendTableData(row : HTMLElement, content : string) {
		let item = document.createElement("td");
		item.innerText = content;
		row.appendChild(item);
	}

	createButton(name : string, handler : Function) : HTMLButtonElement {
		let button = 
			<HTMLButtonElement>document.createElement("button");
		button.className = "btn btn-default";
		button.innerText = name;
		button.onclick = () => handler();
		return button;
	}

	createInput(placeHolder : string, value : string) : HTMLInputElement {
		let input = <HTMLInputElement>document.createElement("input");
		input.className = "form-control";
		input.setAttribute("placeholder", placeHolder);
		input.value = value;
		return input;
	}

	appendUserControls(row : HTMLElement, user : User) {
		let block = document.createElement("td");
		block.appendChild(this.createButton(
			"Update", () => this.updateUser(user)
		));
		block.appendChild(this.createButton(
			"Delete", () => this.deleteUser(user.id)
		));
		row.appendChild(block);
	}

	updateUser(user : User) {
		this.curUser = user;
		this.nameInput.value = user.name;
		this.loadItems();
		this.updateButtonStates(false, true);
	}

	updateCurrentUser() {
		let name = this.nameInput.value;
		this.curUser.name = name;
		this.readItems();
		let userContent = JSON.stringify(this.curUser);
		jQuery.ajax({
			type: "PATCH",
			url: "/users",
			data: userContent,
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			success: () => this.loadUsers()
		}).fail(() => alert( "Failed to update!" ));
		this.updateButtonStates(true, false);
		this.clearUser();
		this.curUser = new User(0, "", []);
	}

	deleteUser(id : number) {
		jQuery.ajax({
			type: "DELETE",
			url: "/users/" + id,
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			success: () => this.loadUsers()
		});
	}

	appendUser(user : User) {
		let row = document.createElement("tr");
		this.appendTableData(row, user.id.toString());
		this.appendTableData(row, user.name);
		this.appendTableData(row, user.getItemsString());
		this.appendUserControls(row, user);
		this.userList.appendChild(row);
	}

	loadItems() {
		let user = this.curUser;
		user.items.forEach((item) => 
			this.appendItem(user, item)
		);
	}

	readItems() {
		let itemNodes = this.itemList.childNodes;
		let newItems : Item[] = [];
		itemNodes.forEach(node => {
			let name = 
				(<HTMLInputElement>node.childNodes[0].childNodes[0]).value;
			let count = parseInt(
				(<HTMLInputElement>node.childNodes[1].childNodes[0]).value);
			let item = new Item(name, count);
			newItems.push(item);
		});
		this.curUser.items = newItems;
	}

	appendItem(user : User, item : Item) {
		let row = document.createElement("tr");
		this.appendTableElement(
			row, this.createInput("Item Name", item.name));
		this.appendTableElement(
			row, this.createInput("Item Count", item.count.toString()));
		this.appendTableElement(row, this.createButton(
			"-", () => this.removeItem(row, user, item)
		));
		this.itemList.appendChild(row);
	}

	removeItem(element : HTMLElement, user : User, item : Item) {
		let index = user.items.indexOf(item);
		user.items.splice(index, 1);
		element.remove();
	}

	addItem() {
		let item = new Item("", 0);
		this.curUser.items.push(item);
		this.appendItem(this.curUser, item);
	}
}

var userController = new UserController();