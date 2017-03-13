module.exports = {
	add: function(type, tick, id, action, data) {
		Memory.calendar.push({
			type: type,
			tick: tick,
			id: id,
			action: action,
			data: data
		});
	},
	runCurrentTick: function() {
		var indices = [];
		for(var i in Memory.calendar) {
			if(Memory.calendar.tick === Game.time) {
				indices.push(i);
			}
		}
		
		var actions = _.pullAt(Memory.calendar, indices);
		
		for(var j in actions) {
			var a = actions[j];
			switch(a.type) {
				case 'creep':
					var crp = Game.creeps[a.id];
					
					//Need to check if previous action finished here
					
					crp.memory = {
						action: a.action,
						data: a.data
					};
					break;
				case 'spawn':
					var spwn = Game.spawns[a.id];
					
					var name = spwn.createCreep(a.data);
					
					if(typeof name === 'string') {
						this.add('creep', Game.time + 3*a.data.length, name, 0, null);
					}
					else {
						//Need to try again later if spawn failed
					}
					break;
				default:
					
			}
		}
	}
	
};