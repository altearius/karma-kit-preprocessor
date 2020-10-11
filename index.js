const kit = require("node-kit");

function createKitPreprocessor(logger) {
	const log = logger.create("preprocessor.kit");

	return function (content, file, next) {
		log.debug("Processing", file.originalPath);

		let html;

		try {
			html = kit(file.originalPath);
		} catch (e) {
			log.warn("Unable to compile", file.originalPath);
			log.warn(e.message);

			return next(null, content);
		}

		next(null, html);
	};
}

createKitPreprocessor.$inject = ["logger"];

module.exports = {
	"preprocessor:karma-kit-preprocessor": ["factory", createKitPreprocessor]
};
