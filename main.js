Room.prototype.initialise = require('roomInitialise');
var RoomCluster = require('roomCluster');
var memoryUtilities = require('memoryUtilities');

RoomPosition.prototype.toString = function() {
	var xString = this.x.toString();
	var yString = this.y.toString();
	
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
		return PathFinder.CostMatrix.deserialize(Memory.rooms[this.name].costMatrix);
	}
};
Room.prototype.saveCostMatrix = function(cm) {
	Memory.rooms[this.name].costMatrix = cm.serialize();
};
RoomVisual.prototype.displayPaths = function(roomCluster) {
	for(var i in roomCluster.edgeList) {
		for(var j in roomCluster.edgeList[i]) {
			if(j === 'length') {
				continue;
			}
			this.poly(memoryUtilities.pathFromString(roomCluster.edgeList[i][j].path));
		}
	}
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
    		rm.initialise();
    	}
    }
    
    var cluster = new RoomCluster('sim');
    var extensionPos = cluster.getNextStructurePosition(STRUCTURE_EXTENSION);
    cluster.save();
    
    var rv = new RoomVisual('sim');
    rv.displayPaths(cluster);
    rv.circle(extensionPos);
    rv.text("Time: " + Game.time + "  " + Math.round(Game.cpu.getUsed()*100/Game.cpu.limit) + "% CPU",5,2);
};
