Creep.prototype.run = require('creepRun');
Room.prototype.initialise = require('roomInitialise');

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    for(var r in Game.rooms) {
    	var rm = Game.rooms[r];
    	
    	if(typeof rm.memory.type === 'undefined') {
    		rm.initialise();
    	}
    	
    	var rv = new RoomVisual(rm.name);
    	rv.text("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU",5,2);
    }
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        crp.run();
    }
    
};
