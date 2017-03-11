module.exports = function() {
	for(var i in Memory.jobs) {
		for(var j in Memory.jobs[i].assignedTo) {
			if(Memory.jobs[i].assignedTo[j] === this.name) {
				Memory.jobs[i].assignedTo.splice(j,1);
				
				if(Memory.jobs[i].type === 4) {
					Memory.jobs[i].amount = SPAWN_ENERGY_CAPACITY - Game.getObjectById(Memory.jobs[i].location).energy;
					if(Memory.jobs[i].amount === 0) {
						Memory.jobs.splice(i,1);
					}
				}
			}
		}
	}
	
	this.memory.action = 0;
};