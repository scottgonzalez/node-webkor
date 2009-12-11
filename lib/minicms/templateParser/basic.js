var TemplateParser = require('../templateParser').TemplateParser;

var BasicTemplateParser = new TemplateParser({
	parse: function(content, data) {
		return content.replace(/{([^}]+)}/g, function(match, name) {
			return name in data ? data[name] : '';
		});
	}
});

exports.parser = BasicTemplateParser;
