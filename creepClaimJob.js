module.exports = function() {
	var index = -1;
	var jobs = Memory.jobs;
	for(var i in jobs) {
		if(!jobs[i].assignedTo) {
			index = i;
			break;
		}
	}
	
	if(index !== -1) {
		var j = jobs[index];
		this.memory.target = j.location;
		this.memory.job = j.type;
		this.memory.action = 1;
		Memory.jobs[index].assignedTo.push(this.name);
	}
};