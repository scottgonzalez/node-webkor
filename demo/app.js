var basePath = require('path').dirname(__filename);
require('../lib/webkor').webkor({
	controllerPath: basePath + '/controller',
	templatePath: basePath + '/template'
});
