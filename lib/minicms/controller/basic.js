var Controller = require('../controller').Controller;

Controller.load = function(request) {
	var defn = require(Controller.path + request.uri.path).controller;
	return new Controller(defn);
};

exports.Controller = Controller;

