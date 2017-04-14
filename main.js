var pathUtilities = require('pathUtilities');

module.exports.loop = function () {
	
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            
        }
    }
    var rv = new RoomVisual(rm.name);
    var rm = Game.rooms['sim'];
    pathUtilities.initialisePaths(rm);
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        
    }
    
    
    rv.text("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU",5,2);
};
