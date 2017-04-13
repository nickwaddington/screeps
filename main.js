var pathUtilities = require('pathUtilities');

module.exports.loop = function () {
	
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            
        }
    }
    
    var rm = Game.rooms['sim'];
    var spawn = rm.find(FIND_MY_SPAWNS)[0];
    var rv = new RoomVisual(rm.name);
    var sources = rm.find(FIND_SOURCES_ACTIVE);
    
    var nums = [0,3];
    var plotPoints = [];
    
    for(var i in nums) {
    	var src = sources[nums[i]];
    	
    	rv.rect(src.pos.x - 1, src.pos.y - 1, 2, 2);
    	plotPoints = plotPoints.concat(pathUtilities.findAdjacent(rm, src.pos, 1));
    }
    
    plotPoints = plotPoints.concat(pathUtilities.findAdjacent(rm, spawn.pos, 1));
    
    plotPoints = plotPoints.concat(pathUtilities.findAdjacent(rm, rm.controller.pos, 3));
    
    for(i in plotPoints) {
    	rv.circle(plotPoints[i], {radius: 0.5, stroke: 'blue', fill: 'transparent'});
    }
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        
    }
    
    
    rv.text("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU used",5,2);
};
