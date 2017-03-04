//Tells creeps how to do actions but contains no strategy logic

module.exports = function() {
    var status;
    this.memory.action = 1;
    
    switch(this.memory.action) {
        case 0: //Do nothing
            status = 'idle'
            break;
        case 1: //Move to target
        	status = this.moveByPath(this.memory.pathTarget);
            if(status !== 0) {
            	this.memory.pathTarget = this.room.findPath(this.memory.home, this.memory.target.pos);
            	this.moveByPath(this.memory.pathTarget);
            }
            break;
        case 3: //Mine
            status = this.harvest(this.memory.target);
            break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
    }
    
    this.say(status);
};