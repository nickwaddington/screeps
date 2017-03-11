module.exports = function() {
	if(!this.memory.initialised) {
		this.initialise();
		this.memory.initialised = true;
	}
	
	//job allocations
	var jobs = Memory.jobs;
	var index = -1;
	
	for(var i in jobs) {
		if(jobs[i].assignedTo.length === 0) {
			index = i;
			break;
		}
	}
	
	var spawn = this.find(FIND_MY_SPAWNS)[0];
	
	if(index !== -1) {
		var status = spawn.createCreep([WORK,CARRY,MOVE], null, {
	    	action: 0
	    });
		
		if(typeof status === 'string') {
			Memory.jobs.push({
				type: 4,
				priority: 0,
				start: 0,
				finish: 0, //sources[i].ticksToRegeneration + Game.time
				amount: spawn.energyCapacity - spawn.energy,
				location: sources[i].id,
				assignedTo: []
			})
		}
	}
	
};