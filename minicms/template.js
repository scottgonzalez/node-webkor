var sys = require('sys');

var template = {
	read: function(path, complete) {
		sys.exec('cat ' + path).addCallback(complete);
	},
	
	parse: function(path, data, complete) {
		template.read(path, function(content) {
			complete(content.replace(/{([^}]+)}/g, function(match, name) {
				return name in data ? data[name] : '';
			}));
		});
	}
};

exports.parse = template.parse;

