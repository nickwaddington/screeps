module.exports = function() {
	var roomJobs = [];
	
	var sources = this.find(FIND_SOURCES);
	
	for(var i in sources) {
		roomJobs.push({
			type: 'harvester',
			priority: 0,
			start: 0,
			finish: 0, //sources[i].ticksToRegeneration + Game.time
			amount: sources[i].energy,
			location: sources[i].id,
			assignedTo: null
		});
	}
	
	if(typeof Memory.jobs === 'undefined') {
		Memory.jobs = roomJobs;
	}
	else {
		Memory.jobs = Memory.jobs.concat(roomJobs);
	}
};