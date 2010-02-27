function Controller(defn) {
	process.mixin(this, defn);
}

process.mixin(Controller.prototype, {
	templateType: 'basic',

	getTemplateType: function() {
		return this.templateType;
	},

	data: {},
	
	exec: function(request, response, callback) {
		var self = this;
		this.callback = callback;
		process.nextTick(function() {
			self._exec(request, response);
		});
	},
	
	complete: function() {
		this.callback(this.template + '.nmt', this.data);
	}
});

Controller.setPath = function(path) {
	Controller.path = path;
};

exports.Controller = Controller;
