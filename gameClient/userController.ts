class UserController {
	nameInput : HTMLInputElement;
	refreshButton : HTMLButtonElement;
	addButton : HTMLButtonElement;
	updateButton : HTMLButtonElement;
	curUser : User;

	constructor() {
		this.initElements();
		this.loadUsers();
		this.updateButtonStates(true, false);
	}

	initButton(id : string, handler : Function) : HTMLButtonElement {
		let button = 
			<HTMLButtonElement>document.getElementById(id);
		button.onclick = () => handler();
		return button;
	}

	initElements() {
		this.addButton = 
			this.initButton("user-add-btn", () => this.addUser());
		this.updateButton = 
			this.initButton("user-update-btn", () => this.updateCurrentUser());
		this.updateButton = 
			this.initButton("user-refresh-btn", () => this.loadUsers());
		this.nameInput = 
			<HTMLInputElement>document.getElementById("user-name");
	}

	updateButtonStates(canAdd : boolean, canUpdate : boolean) {
		this.addButton.style.display = canAdd ? "block" : "none";
		this.updateButton.style.display = canUpdate ? "block" : "none";
	}

	clearUserInput() {
		this.nameInput.value = "";
	}

	addUser() {
		let name = this.nameInput.value;
		let user = new User(0, name);
		let userContent = JSON.stringify(user);
		jQuery.ajax({
			type: "POST",
			url: "/users",
			data: userContent,
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			success: () => this.loadUsers()
		}).fail(() => alert( "Failed to add!" ));
		this.clearUserInput();
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

	onUsersRetrieved(data) {
		let users : User[] = [];
		data.forEach(element => {
			var user = new User(element["id"], element["name"]);
			users.push(user);
		});
		let list = document.getElementById("user-list");
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}
		users.forEach((user) => this.appendUser(list, user));
	}

	appendUserContent(row : HTMLElement, content : string) {
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
		this.updateButtonStates(false, true);
	}

	updateCurrentUser() {
		let name = this.nameInput.value;
		this.curUser.name = name;
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
		this.clearUserInput();
		this.curUser = null;
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

	appendUser(list : HTMLElement, user : User) {
		let row = document.createElement("tr");
		this.appendUserContent(row, user.id.toString());
		this.appendUserContent(row, user.name);
		this.appendUserControls(row, user);
		list.appendChild(row);
	}
}

var userController = new UserController();