module.exports = function() {
	switch(this.memory.action) {
        case 0: //Do nothing
            break;
        case 1: //Move to target
        	if(this.pos.isEqualTo(this.memory.pathTarget[this.memory.pathTarget.length-1].x,this.memory.pathTarget[this.memory.pathTarget.length-1].y)) {
        	    this.memory.action = 3;
        	}
            break;
        case 2: //Move to home
        	if(this.pos.isEqualTo(this.memory.pathHome[this.memory.pathHome.length-1].x,this.memory.pathHome[this.memory.pathHome.length-1].y)) {
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
}