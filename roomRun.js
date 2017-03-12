module.exports = function() {
	if(!this.memory.initialised) {
		this.initialise();
		this.memory.initialised = true;
	}
	
	var spawn = this.find(FIND_MY_SPAWNS)[0];
	
	var status = spawn.createCreep([WORK,CARRY,MOVE], null, {
    	action: 0,
    	role: 'worker'
    });
	
	if(typeof status === 'string') {
		//Update job stuff here
	}
	
	
};