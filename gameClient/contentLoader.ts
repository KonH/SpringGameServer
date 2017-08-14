class ContentLoader {

	clear() {
		logger.log("CL: clear content");
		Utils.clearChilds(document.getElementById("content"));
	}

	load(page : string) {
		this.clear();
		logger.log("CL: load: " + page);
		jQuery("#content").load(page + ".html");
	}
}

var loader = new ContentLoader();