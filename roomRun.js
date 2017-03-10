module.exports = function() {
	if(!this.memory.initialised) {
		this.initialise();
		this.memory.initialised = true;
	}
	
	//job allocations
	var jobs = Memory.jobs;
	var index = -1;
	
	for(var i in jobs) {
		if(!jobs[i].assignedTo) {
			index = i;
			break;
		}
	}
	
	var status = roomSpawn(jobs[index]);
	
	if(typeof status === 'string') {
		//assign job to creep
		var c = Game.creeps[status];
		
		Memory.jobs[index].assignedTo = c.id;
	}
	
};