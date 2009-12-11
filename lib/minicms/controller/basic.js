var Controller = require('../controller').Controller;

Controller.load = function(request) {
	// TODO: use controller path from config
	var defn = require('../../../controller' + request.uri.path).controller;
	return new Controller(defn);
};

exports.Controller = Controller;

