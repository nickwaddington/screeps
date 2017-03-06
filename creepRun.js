module.exports = function() {
    switch(this.memory.action) {
        case 0: //Do nothing
            break;
        case 1: //Move to target
        	if(this.pos.isEqualTo(this.memory.pathTarget[this.memory.pathTarget.length-1])) {
        	    this.memory.action = 3;
        	}
            break;
        case 2: //Move to home
        	if(this.pos.isEqualTo(this.memory.pathHome[this.memory.pathHome.length-1])) {
        	    this.memory.action = 4;
        	}
            break;
        case 3: //Mine
            if(this.carry.energy === this.carryCapacity) {
                this.memory.action = 2;
            }
            break;
        case 4: //Transfer to home
            if(this.carry.energy === 0) {
                this.memory.action = 1;
            }
            break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
            this.memory.action = 0;
    }
    
    var status;
    switch(this.memory.action) {
        case 0: //Do nothing
            status = 'idle'
            break;
        case 1: //Move to target
        	status = this.moveByPath(this.memory.pathTarget);
            break;
        case 2: //Move to home
        	status = this.moveByPath(this.memory.pathHome);
            break;
        case 3: //Mine
            status = this.harvest(Game.getObjectById(this.memory.target));
            break;
        case 4: //Drop off at home
        	status = this.transfer(Game.getObjectById(this.memory.home), RESOURCE_ENERGY);
        	break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
    }
    
    this.say(status);
};