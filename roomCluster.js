var memoryUtilities = require('memoryUtilities');

function roomCluster(homeRoomName) {
	this.homeRoomName = homeRoomName;
	
	if(typeof Memory.roomClusters === 'undefined') {
		Memory.roomClusters = [];
	}
	if(typeof Memory.roomClusters[homeRoomName] === 'undefined') {
		this.roomList = [homeRoomName];
		this.creepList = [];
		this.nodeList = [];
		this.edgeList = {};
		
		this.initialisePaths();
		
		//TODO intiialise structure positions here
		
		
	}
	else {
		cluster = Memory.roomClusters[homeRoomName];
		this.roomList = cluster.roomList.split();
		this.creepList = cluster.creepList.split();
		this.nodeList = cluster.nodeList;
		this.edgeList = cluster.edgeList;
	}
	
	//TODO manage spawning here
	
	
	//TODO run creep actions here
	
	this.save();
}

roomCluster.prototype.save = function() {
	var data = {};
	data.roomList = this.roomList.join();
	data.creepList = this.creepList.join();
	data.nodeList = this.nodeList;
	data.edgeList = this.edgeList;
	
	Memory.roomClusters[this.homeRoomName] = data;
};
roomCluster.prototype.addNode = function(vertexName, vertexPos, range) {
	this.nodeList.push({name: vertexName, pos: vertexPos.toString(), range: range});
	this.edgeList[vertexName] = {length: 0};
};
roomCluster.prototype.addEdge = function(vertexName1, vertexName2) {
	var vertex1 = _.find(this.nodeList, function(v) { return v.name === vertexName1 });
	var vertex2 = _.find(this.nodeList, function(v) { return v.name === vertexName2 });
	
	if(typeof vertex1 === 'undefined') {
		console.log('Cannot find vertex ' + vertexName1);
		return;
	}
	if(typeof vertex2 === 'undefined') {
		console.log('Cannot find vertex ' + vertexName2);
		return;
	}
	
	var vertex1pos = memoryUtilities.posFromString(vertex1.pos);
	var vertex2pos = memoryUtilities.posFromString(vertex2.pos);
	
	var costCallback = function(roomName, newCM) {
		return Game.rooms[roomName].getCostMatrix();
	};
	
	var point1 = vertex2pos.findClosestByPath(vertex1pos.getInRange(vertex1.range), {costCallback: costCallback});
	var point2 = vertex1pos.findClosestByPath(vertex2pos.getInRange(vertex2.range), {costCallback: costCallback});
	
	var pathData = PathFinder.search(point1, point2, {
		roomCallback: costCallback,
		plainCost: 2,
		swampCost: 10
	});
	
	var path = ret.path;
	var temp = path;
	temp.pop();
	var reversePath = temp.reverse();
	reversePath.push(point1);
	
	var point1Room = Game.rooms[point1.roomName];
	var cm = point1Room.getCostMatrix();
	cm.set(point1.x, point1.y, 1);
	
	for(var i in path) {
		if(path[i].roomName !== point1Room) {
			point1Room.saveCostMatrix(cm);
			point1Room = path[i].roomName;
			cm = point1Room.getCostMatrix();
		}
		
		cm.set(path[i].x, path[i].y, 1);
	}
	point1Room.saveCostMatrix(cm);
	
	this.edgeList[vertexName1].length++;
	this.edgeList[vertexName2].length++;
	this.edgeList[vertexName1][vertexName2] = {start: point1.toString(), path: path};
	this.edgeList[vertexName2][vertexName1] = {start: point2.toString(), path: reversePath};
};
roomCluster.prototype.initialisePaths = function() {
	var rm = Game.rooms[this.homeRoomName];
	var spawn = rm.find(FIND_MY_SPAWNS)[0];
	var cm = rm.getCostMatrix();
	cm.set(spawn.pos.x, spawn.pos.y, 255);
	
	var sources = rm.find(FIND_SOURCES_ACTIVE);
	var exits = [FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT];
	
	this.addNode('spawn', spawn.pos, 1);
	this.addNode('controller', rm.controller.pos, 3);
	
    for(var i in sources) {
    	this.addNode('source'+i, sources[i].pos, 1);
    }
    
    for(var e in exits) {
    	var exitPositions = rm.find(exits[e]);
    	if(exitPositions.length > 0) {
    		this.addNode('exit' + exits[e], exitPositions[0], 0);
    	}
    }
    
    var costCallback = function(roomName, newCM) {
		return Game.rooms[roomName].getCostMatrix();
	};
    
    this.addEdge('spawn','controller');
    
    for(var v in this.nodeList) {
    	var current = this.nodeList[v];
    	
    	if(this.edges[current.name].length === 0) {
    		var currentPos = memoryUtilities.posFromString(current.pos);
    		var closest = currentPos.findClosestByPath([spawn.pos, rm.controller.pos], { costCallback: costCallback });
    		
    		if(spawn.pos.isEqualTo(closest)) {
    			this.addEdge('spawn', current.name);
    		}
    		else {
    			this.addEdge('controller', current.name);
    		}
    	}
    }
    
    rm.saveCostMatrix(cm);
}

module.exports = roomCluster;