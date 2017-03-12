module.exports = {
	addJob: function(type, priority, start, finish, amount, location) {
		Memory.jobs.push({
			id: Memory.currentId,
			type: type,
			priority: priority,
			start: start,
			finish: finish, //sources[i].ticksToRegeneration + Game.time
			amount: amount, //TODO make dynamic
			location: location,
			assignedTo: []
		});
		
		Memory.currentId++;
	},
	removeJob: function(id) {
		_.remove(Memory.jobs, function(o) {
			return o.id	=== id;
		});
	},
	updateJob: function(id, amount) {
		var job = _.find(Memory.jobs, function(o) {
			return o.id	=== id;
		});
		job.amount = amount;
	},
	claimJob: function(creepName, predicate) {
		var job = _.find(Memory.jobs, predicate);
		
		if(job) {
			job.assignedTo.push(creepName);
			Game.creeps[creepName].memory.job = job.id;
			Game.creeps[creepName].memory.type = job.type;
			Game.creeps[creepName].memory.location = job.location;
			Game.creeps[creepName].memory.action = 1;
		}
		
	},
	unclaimJob: function(creepName) {
		
	}
};