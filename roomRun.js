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
	
	if(index !== -1) {
		var status = this.spawn(jobs[index]);
		
		if(typeof status === 'string') {
			//assign job to creep
			Memory.jobs[index].assignedTo = status;
		}
	}
	
	var src = this.find(FIND_SOURCES)[0];
	
	var adj = this.findAdjacent(src.pos);
	
	console.log(JSON.stringify(adj));
	
};