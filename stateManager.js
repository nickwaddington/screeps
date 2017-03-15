var logSize = 1650;

module.exports = {
	add: function(type, id) {
		var energyArr;
		var stateArr;
		
		switch(type) {
			case 'harvester':
				energyArr = Array(logSize);
				stateArr = Array(logSize).fill(-1, 0);
				break;
			case 'source':
				energyArr = Array(logSize).fill(3000);
				stateArr = Array(logSize).fill(-1);
				break;
			case 'spawn':
				energyArr = Array(logSize).fill(300);
				stateArr = Array(logSize).fill(0);
				break;
			default:
				
		}
		
		
		Memory.info.push({
			type: type,
			id: id
		});
		Memory.energy.push(energyArr);
		Memory.states.push(stateArr);
	},
	remove: function(id) {
		
	},
	checkAll: function() {
		
	},
	updateAll: function() {
		
	},
	recalculate: function() {
		
	}
};