var jobManager = require('jobManager');

module.exports = function() {
	switch(this.memory.action) {
        case 0: //Do nothing
        	//claim job
        	var predicate;
        	
        	if(this.carry[RESOURCE_ENERGY] === 0) {
				predicate = function(o) {
					return o.type === 3 && o.assignedTo.length < 2;
				};
			}
			else {
				predicate = function(o) {
					return o.type === 4;
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
                if(jobManager.unclaimJob(this.name)) {
                	this.worker();
                }
            }
            break;
        case 4: //Transfer to home
            if(this.carry.energy === 0) {
            	var currentEnergy = SPAWN_ENERGY_CAPACITY - Game.getObjectById(this.memory.target).energy;
            	var creep = this;
            	if(currentEnergy === 0) {
            		jobManager.removeJob(function(o) {
            			return o.location === creep.memory.target && creep.memory.type === 4;
            		});
            	}
            	else {
            		jobManager.updateJob(currentEnergy, function(o) {
            			return o.location === creep.memory.target && creep.memory.type === 4;
            		});
            	}
                if(jobManager.unclaimJob(this.name)) {
                	this.worker();
                }
            }
            break;
        case 7: //Upgrade controller
            if(this.carry.energy === 0) {
                if(jobManager.unclaimJob(this.name)) {
                	this.worker();
                }
            }
            break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
    }
}