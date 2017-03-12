Creep.prototype.run = require('creepRun');
Creep.prototype.worker = require('worker');

Room.prototype.run = require('roomRun');
Room.prototype.initialise = require('roomInitialise');
Room.prototype.findAdjacent = require('roomFindAdjacent');

module.exports.loop = function () {
	if(typeof Memory.jobs === 'undefined') {
		Memory.jobs = [];
		Memory.currentId = 0;
	}
	
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            
            for(var i in Memory.jobs) {
            	if(Memory.jobs[i].assignedTo === name) {
            		Memory.jobs[i].assignedTo = null;
            	}
            }
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
    
    //print time and cpu usage
    console.log("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU used");
};
