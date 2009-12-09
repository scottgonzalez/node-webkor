var posix = require('posix');

var template = {
	parse: function(path, data, complete) {
		posix.cat(path).addCallback(function(content) {
			complete(content.replace(/{([^}]+)}/g, function(match, name) {
				return name in data ? data[name] : '';
			}));
		});
	}
};

exports.parse = template.parse;

