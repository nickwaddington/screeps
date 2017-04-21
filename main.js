//Creep.prototype.run = require('creepRun');
//Room.prototype.initialise = require('roomInitialise');
var RoomCluster = require('roomCluster');

RoomPosition.prototype.toString = function() {
	var xString = this.x;
	var yString = this.y;
	
	if(this.x < 10) {
		xString = '0' + xString;
	}
	if(this.y < 10) {
		yString = '0' + yString;
	}
	
	return xString + yString + this.roomName;
};
RoomPosition.prototype.getInRange = function(range) {
	var rm = Game.rooms[this.roomName];
	var positions = rm.lookForAtArea(LOOK_TERRAIN, this.y-range, this.x-range, this.y+range, this.x+range, true);
	
	var filtered = _.filter(positions, function(o) { return o.terrain !== 'wall' });
	
	var arr = [];
	for(var i in filtered) {
		arr.push(rm.getPositionAt(filtered[i].x, filtered[i].y));
	}
	
	return arr;
};
Room.prototype.getCostMatrix = function() {
	if(typeof Memory.rooms[this.name].costMatrix === 'undefined') {
		var cm = new PathFinder.CostMatrix();
		Memory.rooms[this.name].costMatrix = cm.serialize();
		return cm;
	}
	else {
		return PathFinder.deserialize(Memory.rooms[this.roomName].costMatrix);
	}
};
Room.prototype.saveCostMatrix = function(cm) {
	Memory.rooms[this.roomName].costMatrix = cm.serialize();
};

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    for(var r in Game.rooms) {
    	var rm = Game.rooms[r];
    	if(typeof rm.memory === 'undefined') {
    		rm.memory = {};
    	}
    }
    
    var cluster = new RoomCluster('sim');
    
    /*for(var r in Game.rooms) {
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
    }*/
    
};
