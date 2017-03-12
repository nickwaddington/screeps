var jobManager = require('jobManager');

module.exports = function() {
	var roomJobs = [];
	
	var sources = this.find(FIND_SOURCES);
	
	for(var i in sources) {
		jobManager.addJob(3, 2, 0, 0, sources[i].energy, sources[i].id);
	}
	
	jobManager.addJob(7, 1, 0, 0, 0, this.controller.id);
};