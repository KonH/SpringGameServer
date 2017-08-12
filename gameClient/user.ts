class User {
	id : number;
	name : string;
	items : Item[];

	constructor(id : number, name : string, items : Item[]) {
		this.id = id;
		this.name = name;
		this.items = items;
	}

	getItemsString() : string {
		let result = "";
		this.items.forEach((item) => {
			result += item.name + ": " + item.count + "; ";
		});
		return result;
	}
}