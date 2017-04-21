var pathUtilities = require('pathUtilities');

module.exports = function() {
	var spawnList = this.find(FIND_MY_SPAWNS);
	
	if(spawnList.length > 0) {
		Memory.rooms[this.name].type = 'main';
	}
	else {
		Memory.rooms[this.name].type = 'other';
	}
};