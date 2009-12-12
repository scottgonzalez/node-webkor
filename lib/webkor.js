var sys = require('sys'),
	http = require('http');

var webkor = {
	init: function(config) {
		this.config = process.mixin({
			port: 8000,
			controllerType: 'basic',
			controllerPath: '../controller',
			templateType: 'basic',
			templatePath: '../template'
		}, config);

		// normalize paths
		var basePath = require('path').dirname(__filename) + '/';
		['controllerPath', 'templatePath'].forEach(function(config) {
			if (webkor.config[config].charAt(0) == '.') {
				webkor.config[config] = basePath + webkor.config[config];
			}
		});

		// TODO: allow controller to specify the parser
		this.templateParser = require('./webkor/templateParser/' + this.config.templateType).parser;
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

			// TODO: allow controller to specify content type (and other headers)
			response.sendHeader(200, {'Content-Type': 'text/plain'});
			controller.exec(request.uri.params).addCallback(function(template, data) {
				webkor.templateParser.exec(templatePath + template, data).addCallback(function(content) {
					response.sendBody(content);
					response.finish();
				});
			});
		}).listen(this.config.port);

		sys.puts('webkor running at http://127.0.0.1:' + this.config.port + '/');
	}
};

exports.webkor = function() { webkor.init.apply(webkor, arguments); };

