function Controller(defn) {
	process.mixin(this, defn);
}

process.mixin(Controller.prototype, {
	templateType: 'basic',

	getTemplateType: function() {
		return this.templateType;
	},

	data: {},
	
	exec: function(request, response) {
		var self = this;
		this.promise = new process.Promise();
		setTimeout(function() {
			self._exec(request, response);
		});
		return this.promise;
	},
	
	complete: function() {
		this.promise.emitSuccess(this.template + '.nmt', this.data);
	}
});

Controller.setPath = function(path) {
	Controller.path = path;
};

exports.Controller = Controller;
