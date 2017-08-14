class Utils {
	static clearChilds(element : HTMLElement) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}
}