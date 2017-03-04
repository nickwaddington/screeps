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
        
        
    }
    
    for(var currentCreep in Game.creeps) {
        var crp = Game.creeps[currentCreep];
        
        
    }
    
    //print time an cpu usage
    var cpuUsedThisTick = Game.cpu.getUsed()*100/Game.cpu.limit;
    console.log("Time: " + timeCurrent + "  " + Math.round(cpuUsedThisTick) + "% CPU used");
};
