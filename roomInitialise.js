var pathUtilities = require('pathUtilities');

module.exports = function() {
	var spawnList = this.find(FIND_MY_SPAWNS);
	
	if(spawnList.length > 0) {
		this.memory.type = 'main';
	}
	else {
		this.memory.type = 'other';
	}
};