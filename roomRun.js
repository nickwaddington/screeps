var jobManager = require('jobManager');

module.exports = function() {
	if(!this.memory.initialised) {
		this.initialise();
		this.memory.initialised = true;
	}
	
	var spawn = this.find(FIND_MY_SPAWNS)[0];
	
	var unclaimedJob = _.find(Memory.jobs, function(o) {
		return o.assignedTo.length === 0;
	});
	
	if(unclaimedJob) {
		var status = spawn.createCreep([WORK,CARRY,MOVE], null, {
	    	action: 0,
	    	role: 'worker'
	    });
		
		if(typeof status === 'string') {
			//Update job stuff here
			if(!jobManager.updateJob(SPAWN_ENERGY_CAPACITY - spawn.energy, function(o) {
				return o.location === spawn.id && o.type === 4;
			})) {
				jobManager.addJob(4, 0, 0, 0, SPAWN_ENERGY_CAPACITY - spawn.energy, spawn.id);
			}
		}
	}
	
	
	
	
};