var jobManager = require('jobManager');

module.exports = function() {
	switch(this.memory.action) {
        case 0: //Do nothing
        	//claim job
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
        	
        	jobManager.claimJob(this.name, predicate);
        	
            break;
        case 1: //Move to job
        	if(this.pos.isNearTo(Game.getObjectById(this.memory.target))) {
        	    this.memory.action = this.memory.type;
        	}
            break;
        case 3: //Mine
            if(this.carry.energy === this.carryCapacity) {
                jobManager.unclaimJob(this.name);
            }
            break;
        case 4: //Transfer to home
            if(this.carry.energy === 0) {
                jobManager.unclaimJob(this.name);
            }
            break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
    }
}