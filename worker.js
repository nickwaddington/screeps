module.exports = function() {
	switch(this.memory.action) {
        case 0: //Do nothing
        	//claim job
        	this.claimJob();
            break;
        case 1: //Move to job
        	if(this.pos.isNearTo(Game.getObjectById(this.memory.target))) {
        	    this.memory.action = this.memory.job;
        	}
            break;
        case 3: //Mine
            if(this.carry.energy === this.carryCapacity) {
                this.memory.action = 0;
            }
            break;
        case 4: //Transfer to home
            if(this.carry.energy === 0) {
                this.memory.action = 0;
            }
            break;
        default:
            console.log('Error: ' + this.memory.action + ' is not a valid action');
            this.memory.action = 0;
    }
}