var sys = require('sys'),
	http = require('http');

var minicms = {
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
			if (minicms.config[config].charAt(0) == '.') {
				minicms.config[config] = basePath + minicms.config[config];
			}
		});

		// TODO: allow controller to specify the parser
		this.templateParser = require('./minicms/templateParser/' + this.config.templateType).parser;
		this.Controller = require('./minicms/controller/' + this.config.controllerType).Controller;
		this.Controller.setPath(this.config.controllerPath);

		this.run();
	},

	run: function() {
		var controllerPath = this.config.controllerPath,
			templatePath = this.config.templatePath;

		http.createServer(function(request, response) {
			try {
				var controller = minicms.Controller.load(request);
			} catch (e) {
				response.sendHeader(404, {'Content-Type': 'text/plain'});
				response.sendBody('Page Not Found\n');
				response.sendBody(sys.inspect(e));
				response.finish();
				return;
			}

			response.sendHeader(200, {'Content-Type': 'text/plain'});
			controller.exec(request.uri.params).addCallback(function(template, data) {
				minicms.templateParser.exec(templatePath + template, data).addCallback(function(content) {
					response.sendBody(content);
					response.finish();
				});
			});
		}).listen(this.config.port);

		sys.puts('minicms running at http://127.0.0.1:' + this.config.port + '/');
	}
};

exports.minicms = function() { minicms.init.apply(minicms, arguments); };

