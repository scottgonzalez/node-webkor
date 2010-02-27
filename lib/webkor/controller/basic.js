var Controller = require('../controller').Controller,
	url = require('url');

process.mixin(Controller.prototype, {
	statusCode: 200,
	headers: {
		'Content-Type': 'text/html'
	},

	header: function(key, val) {
		if (val != null) {
			this.headers[key] = val;
		} else {
			delete this.headers[key];
		}
	},

	_exec: function(request, response) {
		this.request = request;
		this.response = response;
		this.process(this.url.params);
	},

	complete: (function(complete) {
		return function() {
			this.response.sendHeader(this.statusCode, this.headers);

			complete.apply(this, arguments);
		};
	})(Controller.prototype.complete)
});

Controller.load = function(request) {
	var urlParts = url.parse(request.url),
		defn = require(Controller.path + urlParts.pathname).controller;
	defn.url = urlParts;
	return new Controller(defn);
};

exports.Controller = Controller;

