
var pathUtilities = require('pathUtilities');

module.exports.loop = function () {
	
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            
        }
    }
    
    var rm = Game.rooms['sim'];
    var spawn = rm.find(FIND_MY_SPAWNS)[0];
    
    
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        
    }
    
    //print time and cpu usage
    console.log("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU used");
};
