var pathUtilities = require('pathUtilities');

module.exports.loop = function () {
	
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            
        }
    }
    
    var rm = Game.rooms['sim'];
    var spawn = rm.find(FIND_MY_SPAWNS)[0];
    var rv = new RoomVisual(rm.name)
    var sources = rm.find(FIND_SOURCES_ACTIVE);
    var src1 = sources[0];
    var src2 = sources[3];
    
    rv.rect(src1.pos.x - 1, src1.pos.y - 1, 2, 2);
    rv.rect(src2.pos.x - 1, src2.pos.y - 1, 2, 2);
    
    var plotPoints = []
    
    plotPoints.push(pathUtilities.findAdjacent(rm, src1.pos));
    plotPoints.push(pathUtilities.findAdjacent(rm, src2.pos));
    
    for(var i in plotPoints) {
    	rv.circle(plotPoints[i], {radius: 0.5, stroke: 'blue'})
    }
    
    rv.poly(src1spots, {stroke: '#0000ff', lineStyle: 'dotted'});
    rv.poly(src2spots, {stroke: '#0000ff', lineStyle: 'dotted'});
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        
    }
    
    
    rv.text("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU used",2,2);
};
