var sys = require('sys'),
	http = require('http'),
	Controller = require('./controller').Controller,
	templateParser = require('./template').parse;

var minicms = {
	init: function(config) {
		// TODO: make paths relative to the same dir
		minicms.config = process.mixin({
			port: 8000,
			templatePath: './template',
			controllerPath: '../controller'
		}, config);

		minicms.run();
	},

	run: function() {
		var controllerPath = minicms.config.controllerPath,
			templatePath = minicms.config.templatePath;

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
				templateParser(templatePath + template, data, function(content) {
					response.sendBody(content);
					response.finish();
				});
			});
		}).listen(minicms.config.port);

		sys.puts('minicms running at http://127.0.0.1:' + minicms.config.port + '/');
	}
};

exports.minicms = minicms.init;

