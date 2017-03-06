module.exports = function() {
    switch(this.memory.action) {
        case 0: //Do nothing
            break;
        case 1: //Move to target
        	if(this.pos.x === this.memory.pathTarget[this.memory.pathTarget.length-1].x
        	&& this.pos.y === this.memory.pathTarget[this.memory.pathTarget.length-1].y) {
        	    this.memory.action = 3;
        	}
            break;
        case 3: //Mine
            if(this.carry.energy === this.carryCapacity) {
                this.memory.action = 2;
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
        case 3: //Mine
            status = this.harvest(Game.getObjectById(this.memory.target));
            break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
    }
    
    this.say(status);
};