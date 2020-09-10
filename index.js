const kit = require("node-kit");

function createKitPreprocessor(logger) {
	const log = logger.create("preprocessor.kit");

	return function (_, file, done) {
		log.debug("Processing", file.originalPath);

		let html;

		try {
			html = kit(file.originalPath);
		} catch (e) {
			log.error("Unable to compile", file.originalPath);
			log.error(e.message);

			return done(e, null);
		}

		done(null, html);
	};
}

createKitPreprocessor.$inject = ["logger"];

module.exports = {
	"preprocessor:karma-kit-preprocessor": ["factory", createKitPreprocessor]
};
