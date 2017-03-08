Creep.prototype.run = require('creepRun');
Creep.prototype.harvester = require('harvester');
Creep.prototype.containerHarvester = require('containerHarvester');

Room.prototype.run = require('roomRun');
Room.prototype.spawn = require('roomSpawn');

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
        
        rm.run();
    }
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        
        crp.run();
    }
    
    //print time an cpu usage
    var cpuUsedThisTick = Game.cpu.getUsed()*100/Game.cpu.limit;
    console.log("Time: " + timeCurrent + "  " + Math.round(cpuUsedThisTick) + "% CPU used");
};
