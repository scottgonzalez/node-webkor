var sys = require('sys'),
	http = require('http');

var minicms = {
	init: function(config) {
		// TODO: make paths relative to the same dir
		this.config = process.mixin({
			port: 8000,
			controllerType: 'basic',
			controllerPath: '../controller',
			templateType: 'basic',
			templatePath: './template'
		}, config);

		this.templateParser = require('./templateParser/' + this.config.templateType).parser;
		// TODO: allow various controller systems
		this.baseController = require('./controller').Controller;

		this.run();
	},

	run: function() {
		var controllerPath = this.config.controllerPath,
			templatePath = this.config.templatePath;

		http.createServer(function(request, response) {
			try {
				//var controller = Controller.load(request);
				var controller = require(controllerPath + request.uri.path).controller;
				controller = new minicms.baseController(controller);
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

