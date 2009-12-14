var sys = require('sys'),
	http = require('http');

var webkor = {
	init: function(config) {
		this.config = process.mixin({
			host: '127.0.0.1',
			port: 8000,
			controllerType: 'basic',
			//controllerPath: '../controller',
			templateType: 'basic',
			//templatePath: '../template'
		}, config);

		this.Controller = require('./webkor/controller/' + this.config.controllerType).Controller;
		this.Controller.setPath(this.config.controllerPath);

		this.run();
	},

	run: function() {
		var controllerPath = this.config.controllerPath,
			templatePath = this.config.templatePath;

		http.createServer(function(request, response) {
			try {
				var controller = webkor.Controller.load(request);
			} catch (e) {
				response.sendHeader(404, {'Content-Type': 'text/plain'});
				response.sendBody('Page Not Found\n');
				response.sendBody(sys.inspect(e));
				response.finish();
				return;
			}

			controller.exec(request, response).addCallback(function(template, data) {
				var templateType = controller.getTemplateType(),
					parser = require('./webkor/templateParser/' + templateType).parser;
				parser.exec(templatePath + template, data).addCallback(function(content) {
					response.sendBody(content);
					response.finish();
				});
			});
		}).listen(this.config.port, this.config.host);

		sys.puts('webkor running at http://' + this.config.host + ':' + this.config.port + '/');
	}
};

exports.webkor = function() { webkor.init.apply(webkor, arguments); };

