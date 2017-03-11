module.exports = function() {
	for(var i in Memory.jobs) {
		for(var j in Memory.jobs[i].assignedTo) {
			if(Memory.jobs[i].assignedTo[j] === this.name) {
				Memory.jobs[i].assignedTo.splice(j,1);
			}
		}
	}
	
	this.memory.action = 0;
};