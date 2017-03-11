module.exports = function() {
	var roomJobs = [];
	
	var sources = this.find(FIND_SOURCES);
	
	for(var i in sources) {
		roomJobs.push({
			type: 3,
			priority: 0,
			start: 0,
			finish: 0, //sources[i].ticksToRegeneration + Game.time
			amount: sources[i].energy,
			location: sources[i].id,
			assignedTo: []
		});
	}
	
	if(typeof Memory.jobs === 'undefined') {
		Memory.jobs = roomJobs;
	}
	else {
		Memory.jobs = Memory.jobs.concat(roomJobs);
	}
};