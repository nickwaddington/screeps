Creep.prototype.run = require('creepRun');

Room.prototype.findAdjacent = require('roomFindAdjacent');

var calendar = require('calendarManager');
var pathUtilities = require('pathUtilities');

module.exports.loop = function () {
	/*if(typeof Memory.calendar === 'undefined') {
		Memory.calendar = [];
		Memory.states = [];
		Memory.energy = [];
		Memory.info = [];
		
		//calendar.add('spawn', Game.time, 'Spawn1', 0, [WORK, MOVE, CARRY]);
	}*/
	
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            
        }
    }
    
    var rm = Game.rooms['sim'];
    var spawn = rm.find(FIND_MY_SPAWNS)[0];
    var source = rm.find(FIND_SOURCES)[0];
    
    var pos1 = rm.getPositionAt(spawn.pos.x, spawn.pos.y - 1);
    var pos2 = rm.findAdjacent(source.pos);
    
    var path = rm.findPath(pos1,pos2);
    
    var time = pathUtilities.getPathTime(rm, [WORK, CARRY, MOVE], path);
    
    console.log(time);
    
    //calendar.runCurrentTick();
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        crp.run();
    }
    
    //print time and cpu usage
    console.log("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU used");
};
