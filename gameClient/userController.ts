var nameInput : HTMLInputElement;
var addButton : HTMLButtonElement;
var updateButton : HTMLButtonElement;
var curUserId : number;

function initUsers() {
	initElements();
	loadUsers();
	updateButtonStates(true, false);
}

function initElements() {
	addButton = 
		<HTMLButtonElement>document.getElementById("user-add-btn");
	updateButton = 
		<HTMLButtonElement>document.getElementById("user-update-btn");
	nameInput = 
		<HTMLInputElement>document.getElementById("user-name");
}

function updateButtonStates(canAdd : boolean, canUpdate : boolean) {
	addButton.style.display = canAdd ? "block" : "none";
	updateButton.style.display = canUpdate ? "block" : "none";
}

function clearUserInput() {
	nameInput.value = "";
}

function addUser() {
	var name = nameInput.value;
	var user = {"name": name};
	var userContent = JSON.stringify(user);
	jQuery.ajax({
		type: "POST",
		url: "/users",
		data: userContent,
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		success: function() { loadUsers(); }
	}).fail(function() {
		  alert( "Failed to add!" );
		});
	clearUserInput();
}

function loadUsers() {
	jQuery.ajax({
    	type: "GET",
    	url: "/users",
    	contentType: "application/json; charset=utf-8",
    	dataType: "json",
    	success: function(data) { onUsersRetrieved(data); }
    });
}

function onUsersRetrieved(users) {
	var list = document.getElementById("user-list");
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
	users.forEach(function(user) { appendUser(list, user); });
}

function appendUserContent(row : HTMLElement, content : string) {
	var item = document.createElement("td");
	item.innerText = content;
	row.appendChild(item);
}

function createButton(name : string, handler : Function) : HTMLButtonElement {
	var button = 
		<HTMLButtonElement>document.createElement("button");
	button.className = "btn btn-default";
	button.innerText = name;
	button.onclick = function() { handler(); };
	return button;
}

function appendUserControls(row : HTMLElement, user : Object) {
	var id = user["id"];
	var block = document.createElement("td");
	block.appendChild(createButton(
		"Update", function() { updateUser(user); }));
	block.appendChild(createButton(
		"Delete", function() { deleteUser(id); }));
	row.appendChild(block);
}

function updateUser(user : Object) {
	curUserId = user["id"];
	nameInput.value = user["name"];
	updateButtonStates(false, true);
}

function updateCurrentUser() {
	var name = nameInput.value;
	var user = {"id": curUserId, "name": name};
	var userContent = JSON.stringify(user);
	jQuery.ajax({
		type: "PATCH",
		url: "/users",
		data: userContent,
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		success: function() { loadUsers(); }
	}).fail(function() {
		  alert( "Failed to update!" );
		});
	updateButtonStates(true, false);
	clearUserInput();
}

function deleteUser(id : number) {
	jQuery.ajax({
		type: "DELETE",
		url: "/users/" + id,
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		success: function() { loadUsers(); }
	});
}

function appendUser(list : HTMLElement, user : Object) {
	var row = document.createElement("tr");
	appendUserContent(row, user["id"]);
	appendUserContent(row, user["name"]);
	appendUserControls(row, user);
	list.appendChild(row);
}