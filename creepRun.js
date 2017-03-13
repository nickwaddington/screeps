module.exports = function() {
    var status;
    
    switch(this.memory.action) {
        case 0: //Do nothing
            status = 'idle';
            break;
        case 1: //Move to target
        	status = this.moveByPath(this.memory.data);
            break;
        case 3: //Mine
            status = this.harvest(Game.getObjectById(this.memory.data));
            break;
        case 4: //Transfer energy
        	status = this.transfer(Game.getObjectById(this.memory.data), RESOURCE_ENERGY);
        	break;
    	case 5: //Build
    		status = this.build(Game.getObjectById(this.memory.data));
			break;
		case 6: //Repair
			status = this.repair(Game.getObjectById(this.memory.data));
			break;
		case 7: //Upgrade Controller
			status = this.upgradeController(Game.getObjectById(this.memory.data));
			break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
    }
    
    this.say(this.memory.action + ', ' + status);
};