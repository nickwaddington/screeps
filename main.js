Creep.prototype.run = require('creepRun');

module.exports.loop = function () {
    var timeCurrent = Game.time;
    
    //clear dead creeps memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    for(var currentRoom in Game.rooms) {
        var rm = Game.rooms[currentRoom];
        
        var spawn = rm.find(FIND_MY_SPAWNS)[0];
        var source = rm.find(FIND_SOURCES)[0];
        var homePos = rm.getPositionAt(spawn.pos.x + 1, spawn.pos.y - 1);
        var targetPos = rm.getPositionAt(source.pos.x - 1, source.pos.y + 1);
        
        spawn.createCreep([WORK,CARRY,MOVE], null, {action: 1, homePos: homePos, targetPos: targetPos, home: spawn, target: source});
    }
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        
        crp.run();
    }
    
    //print time an cpu usage
    var cpuUsedThisTick = Game.cpu.getUsed()*100/Game.cpu.limit;
    console.log("Time: " + timeCurrent + "  " + Math.round(cpuUsedThisTick) + "% CPU used");
};
