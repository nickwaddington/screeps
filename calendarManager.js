pathUtilities = require('pathUtilities');

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
			if(Memory.calendar[i].tick === Game.time) {
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
					var spawn = Game.spawns[a.id];
					var rm = spawn.room;
					
					var name = spawn.createCreep(a.data);
					
					var source = rm.find(FIND_SOURCES)[0];
				    var pos1 = rm.getPositionAt(spawn.pos.x, spawn.pos.y - 1);
				    var pos2 = rm.findAdjacent(source.pos);
				    
				    var path = rm.findPath(pos1,pos2);
				    var returnPath = rm.findPath(pos2,pos1);
				    
				    var thereTime = pathUtilities.getPathTime(rm, [WORK, CARRY, MOVE], path);
				    var returnTime = pathUtilities.getPathTime(rm, [WORK, CARRY, MOVE], returnPath, 50);
				    
					if(typeof name === 'string') {
						var time = Game.time + 3*a.data.length;
						this.add('creep', time, name, 1, path);
						
						time += thereTime;
						this.add('creep', time, name, 3, source.id);
						
						time += 25;
						this.add('creep', time, name, 1, returnPath);
						
						time += returnTime;
						this.add('creep', time, name, 4, spawn.id);
						
						time++;
						this.add('creep', time, name, 1, path);
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