var controller = {
	template: '/test',

	process: function(params) {
		this.data = {
			just: 'not'
		};

		this.complete();
	}
};

exports.controller = controller;
