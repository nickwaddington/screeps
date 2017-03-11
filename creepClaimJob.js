module.exports = function() {
	var jobs;
	var predicate;
	
	
	if(this.carry[RESOURCE_ENERGY] === 0) {
		predicate = function(o) {
			return o.type === 3 && o.assignedTo.length === 0;
		};
	}
	else {
		predicate = function(o) {
			return o.type === 4 && o.assignedTo.length === 0;
		};
	}
	
	var job = _.find(Memory.jobs, predicate);
	
	if(job) {
		this.memory.target = job.location;
		this.memory.job = job.type;
		this.memory.action = 1;
		job.assignedTo.push(this.name);
	}
};