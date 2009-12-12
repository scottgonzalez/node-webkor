function Controller(inst) {
	process.mixin(this, inst);
}

process.mixin(Controller.prototype, {
	data: {},
	
	exec: function(params) {
		var self = this;
		this.promise = new process.Promise();
		setTimeout(function() {
			self.process(params);
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
