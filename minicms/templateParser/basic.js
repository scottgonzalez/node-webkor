var TemplateParser = require('../templateParser').TemplateParser;

var BasicTemplateParser = TemplateParser.create({
	parse: function(content, data) {
		return content.replace(/{([^}]+)}/g, function(match, name) {
			return name in data ? data[name] : '';
		});
	}
});

exports.parser = BasicTemplateParser;
