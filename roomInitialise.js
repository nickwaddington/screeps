var pathUtilities = require('pathUtilities');

module.exports = function() {
	var spawnList = this.find(FIND_MY_SPAWNS);
	
	if(spawnList.length > 0) {
		rm.memory.type = 'main';
	}
	else {
		rm.memory.type = 'other';
	}
	
	pathUtilities.initialisePaths(this);
};