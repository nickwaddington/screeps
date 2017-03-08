module.exports = function() {
	switch(this.memory.action) {
        case 1: //Move to target
        	if(this.pos.isEqualTo(this.memory.pathTarget[this.memory.pathTarget.length-1].x,this.memory.pathTarget[this.memory.pathTarget.length-1].y)) {
        	    this.memory.action = 3;
        	    delete this.memory.home;
        	    this.room.createConstructionSite(this.pos, this.memory.buildType);
        	}
            break;
        case 3: //Mine
            if(this.carry.energy > this.carryCapacity) {
            	var container = Game.getObjectById(this.memory.home);
            		
        		if(true/*if not finished building*/) {
        			if(!this.memory.home) { //look for container if not in memory
		        		this.memory.home = this.room.lookForAt(LOOK_CONSTRUCTION_SITES, this.pos)[0].id;
		        	}
        			this.memory.action = 5;
        		}
        		else {
        			if(container.hits < 0.8 * container.hitsMax) { //If below 80% repair
                		this.memory.action = 6;
                	}
                	else { //Otherwise transfer to container
                		this.memory.action = 4;
                	}
        		}
                
            }
            break;
        case 4: //Transfer to container
            if(this.carry.energy === 0) {
                this.memory.action = 3;
            }
            break;
        case 5: //Build container
        	if(this.carry.energy === 0) {
                this.memory.action = 3;
            }
            break;
        case 6: //Repair container
        	if(this.carry.energy === 0) {
                this.memory.action = 3;
            }
            break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
            this.memory.action = 0;
    }
};