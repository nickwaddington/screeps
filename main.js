
var pathUtilities = require('pathUtilities');

module.exports.loop = function () {
	
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            
        }
    }
    
    var rm = Game.rooms['sim'];
    var spawn = rm.find(FIND_MY_SPAWNS)[0];
    
    var sources = rm.find(FIND_SOURCES_ACTIVE);
    var src1 = sources[0];
    var src2 = sources[1];
    
    new RoomVisual(rm.name).rect(src1.pos.x - 1, src1.pos.y - 1, 3, 3);
    new RoomVisual(rm.name).rect(src2.pos.x - 1, src2.pos.y - 1, 3, 3);
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        
    }
    
    
    new RoomVisual(rm.name).text("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU used",2,2);
};
