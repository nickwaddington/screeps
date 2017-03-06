module.exports = function() {
    var status;
    
    switch(this.memory.role) {
    	case 'harvester':
    		this.harvester();
    		break;
		default:
			console.log('unknown role');
    }
    
    switch(this.memory.action) {
        case 0: //Do nothing
            status = 'idle';
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
    
    this.say(this.memory.action + ', ' + status);
};