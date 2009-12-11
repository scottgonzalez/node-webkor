var sys = require('sys'),
	http = require('http');

var minicms = {
	init: function(config) {
		// TODO: make paths relative to the same dir
		this.config = process.mixin({
			port: 8000,
			controllerType: 'basic',
			// TODO: actually use this setting
			controllerPath: '../controller',
			templateType: 'basic',
			templatePath: './template'
		}, config);

		this.templateParser = require('./templateParser/' + this.config.templateType).parser;
		this.Controller = require('./controller/' + this.config.controllerType).Controller;

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

