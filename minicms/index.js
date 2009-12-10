var sys = require('sys'),
	http = require('http'),
	Controller = require('./controller').Controller,
	// TODO: add a config value for which template parser to use
	templateParser = require('./templateParser/basic').parser;

var minicms = {
	init: function(config) {
		// TODO: make paths relative to the same dir
		this.config = process.mixin({
			port: 8000,
			templatePath: './template',
			controllerPath: '../controller'
		}, config);

		this.run();
	},

	run: function() {
		var controllerPath = this.config.controllerPath,
			templatePath = this.config.templatePath;

		http.createServer(function(request, response) {
			try {
				var controller = require(controllerPath + request.uri.path).controller;
			} catch (e) {
				response.sendHeader(404, {'Content-Type': 'text/plain'});
				response.sendBody('Page Not Found\n');
				response.finish();
				return;
			}

			response.sendHeader(200, {'Content-Type': 'text/plain'});
			controller = new Controller(controller);
			controller.exec(request.uri.params).addCallback(function(template, data) {
				templateParser.exec(templatePath + template, data).addCallback(function(content) {
					response.sendBody(content);
					response.finish();
				});
			});
		}).listen(this.config.port);

		sys.puts('minicms running at http://127.0.0.1:' + this.config.port + '/');
	}
};

exports.minicms = function() { minicms.init.apply(minicms, arguments); };

