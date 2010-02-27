var fs = require('fs');

function TemplateParser(defn) {
	process.mixin(this, defn);
}

TemplateParser.prototype = {
	exec: function(path, data, callback) {
		var self = this;
		
		fs.readFile(path, function(err, content) {
			var parsed = self.parse(content, data);
			callback(parsed);
		});
	}
};

exports.TemplateParser = TemplateParser;
