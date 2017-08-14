interface BaseLogger {
	log(message: any);
}

class VerboseLogger implements BaseLogger {
	log(message: any) {
		console.log(message);
	}

}

var logger = new VerboseLogger();