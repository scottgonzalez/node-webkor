var posix = require('posix');

function TemplateParser(defn) {
	process.mixin(this, defn);
}

TemplateParser.prototype = {
	exec: function(path, data) {
		var self = this,
			promise = new process.Promise();
		
		posix.cat(path).addCallback(function(content) {
			var parsed = self.parse(content, data);
			promise.emitSuccess(parsed);
		});
		
		return promise;
	}
};

exports.TemplateParser = TemplateParser;
