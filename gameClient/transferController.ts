class TrasferCommand {
	from : number;
	to : number;
	item : Item;

	constructor(from : number, to : number, itemName : string, itemCount : number) {
		this.from = from;
		this.to = to;
		this.item = new Item(itemName, itemCount);
	}
}

class UserDropdown {
	itemList : HTMLElement;
	itemSelected : HTMLElement;

	selectedId : number;

	constructor(listId : string, seletedId : string) {
		this.itemList = document.getElementById(listId);
		this.itemSelected = document.getElementById(seletedId);
		this.clear();
	}

	setSelected(userId : number, userName : string) {
		this.selectedId = userId;
		this.itemSelected.innerText = userName;
	}

	clear() {
		Utils.clearChilds(this.itemList);
		this.setSelected(-1, "none");
	}

	fill(users : User[]) {
		this.clear();
		users.forEach((u) => this.addUser(u));
	}

	addUser(user : User) {
		let item = document.createElement("li");
		let btn = <HTMLButtonElement>document.createElement("button");
		btn.onclick = () => this.onSelect(user);
		btn.innerText = user.name;
		item.appendChild(btn);
		this.itemList.appendChild(item);
	}

	onSelect(user : User) {
		this.setSelected(user.id, user.name);
	}
}

class TransferController {
	fromDropdown : UserDropdown;
	toDropdown : UserDropdown;
	makeButton : HTMLButtonElement;
	itemNameInput : HTMLInputElement;
	itemCountInput : HTMLInputElement;

	constructor() {
		this.fromDropdown = new UserDropdown("from_list", "from_selected");
		this.toDropdown = new UserDropdown("to_list", "to_selected");
		this.makeButton = Utils.getButtonById("transfer-btn");
		this.itemNameInput = Utils.getInputById("transfer_item_name");
		this.itemCountInput = Utils.getInputById("transfer_item_count");
	}

	update(users:User[]) {
		this.fromDropdown.fill(users);
		this.toDropdown.fill(users);
	}

	apply() {
		let fromId = this.fromDropdown.selectedId;
		let toId = this.toDropdown.selectedId;
		if ( (fromId > 0) && (toId > 0) ) {
			let itemName = this.itemNameInput.value;
			let itemCount = parseInt(this.itemCountInput.value);
			this.makeTransfer(fromId, toId, itemName, itemCount, () => userController.loadUsers());
		}
	}

	makeTransfer(from : number, to : number, itemName : string, itemCount : number, callback : Function) {
		logger.log("TC: make transfer: " + from + " => " + to + " (" + itemName + ":" + itemCount + ")");
		let command = new TrasferCommand(from, to, itemName, itemCount);
		let commandContent = JSON.stringify(command);
		logger.log("TC: make trasfer: commandContent: " + commandContent);
		jQuery.ajax({
			type: "POST",
			url: "/transfer",
			data: commandContent,
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			success: () => callback()
		}).fail(() => alert( "Failed to transfer!" ));
	}
}

var transferController = new TransferController();