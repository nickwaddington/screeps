module.exports = function() {
    var status;
    
    switch(this.memory.role) {
		case 'worker':
			this.worker();
			break;
		default:
			console.log('unknown role');
    }
    
    switch(this.memory.action) {
        case 0: //Do nothing
            status = 'idle';
            break;
        case 1: //Move to target
        	status = this.moveTo(Game.getObjectById(this.memory.target));
            break;
        case 3: //Mine
            status = this.harvest(Game.getObjectById(this.memory.target));
            break;
        case 4: //Transfer energy
        	status = this.transfer(Game.getObjectById(this.memory.target), RESOURCE_ENERGY);
        	break;
    	case 5: //Build
    		status = this.build(Game.getObjectById(this.memory.target));
			break;
		case 6: //Repair
			status = this.repair(Game.getObjectById(this.memory.target));
			break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
    }
    
    this.say(this.memory.action + ', ' + status);
};