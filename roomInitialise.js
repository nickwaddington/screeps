var jobManager = require('jobManager');

module.exports = function() {
	var roomJobs = [];
	
	var sources = this.find(FIND_SOURCES);
	
	for(var i in sources) {
		jobManager.addJob(3, 0, 0, 0, sources[i].energy, sources[i].id);
	}
};