var posix = require('posix');

function TemplateParser(inst) {
	process.mixin(this, inst);
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

TemplateParser.create = function(inst) {
	function parser() {};
	parser.prototype = process.mixin(new TemplateParser(), inst);
	return parser;
};

exports.TemplateParser= TemplateParser;
