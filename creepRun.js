//Tells creeps how to do actions but contains no strategy logic

module.exports = function() {
    var status;
    
    switch(this.memory.action) {
        case 0: //Do nothing
            status = 'idle'
            break;
        case 1: //Move to target
        	if(typeof this.memory.pathTarget === 'undefined') {
        		this.memory.pathTarget = this.room.findPath(this.memory.homePos, this.memory.targetPos);
        	}
        	status = this.moveByPath(this.memory.pathTarget);
            break;
        case 3: //Mine
            status = this.harvest(this.memory.target);
            break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
    }
    
    this.say(status);
};