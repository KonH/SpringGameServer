class Utils {
	static clearChilds(element : HTMLElement) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}

	static getButtonById(id : string) : HTMLButtonElement {
		return <HTMLButtonElement>document.getElementById(id);
	}

	static getInputById(id : string) : HTMLInputElement {
		return <HTMLInputElement>document.getElementById(id);
	}
}