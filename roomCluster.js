var memoryUtilities = require('memoryUtilities');
var pathUtilities = require('pathUtilities');

function roomCluster(homeRoomName) {
	this.homeRoomName = homeRoomName;
	
	if(typeof Memory.roomClusters === 'undefined') {
		Memory.roomClusters = {};
	}
	if(typeof Memory.roomClusters[homeRoomName] === 'undefined') {
		this.roomList = [homeRoomName];
		this.creepList = [];
		this.nodeList = [];
		this.edgeList = {};
		this.constructionList = {};
		this.sourceList = [];
		this.jobList = [];
		
		this.initialisePaths();
	}
	else {
		var cluster = Memory.roomClusters[homeRoomName];
		this.roomList = cluster.roomList.split();
		this.creepList = cluster.creepList.split();
		this.nodeList = cluster.nodeList;
		this.edgeList = cluster.edgeList;
		this.constructionList = cluster.constructionList;
		this.sourceList = cluster.sourceList;
		this.jobList = cluster.jobList;
	}
}

roomCluster.prototype.save = function() {
	var data = {};
	data.roomList = this.roomList.join();
	data.creepList = this.creepList.join();
	data.nodeList = this.nodeList;
	data.edgeList = this.edgeList;
	data.constructionList = this.constructionList;
	data.sourceList = this.sourceList;
	data.jobList = this.jobList;
	
	Memory.roomClusters[this.homeRoomName] = data;
};
roomCluster.prototype.addNode = function(vertexName, vertexPos, range) {
	this.nodeList.push({name: vertexName, pos: vertexPos.toString(), range: range});
	this.edgeList[vertexName] = {length: 0};
	
	var rm = Game.rooms[vertexPos.roomName];
	var cm = rm.getCostMatrix();
	
	var accessPositions = vertexPos.getInRange(range);
	
	for(var ap in accessPositions) {
		var current = accessPositions[ap];
		cm.set(current.x, current.y, 10);
	}
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
	
	if(!pathData.path[0]) {
		console.log(vertexName1, vertexName2, point1.x, point1.y, point2.x, point2.y);
	}
	
	var path = pathData.path;
	
	var copy = pathUtilities.deepCopyPath(path);
	var reversePath = copy.reverse();
	reversePath.shift();
	reversePath.push(point1);
	
	var point1Room = Game.rooms[point1.roomName];
	var cm = point1Room.getCostMatrix();
	cm.set(point1.x, point1.y, 1);
	
	for(var i in path) {
		if(path[i].roomName !== point1Room) {
			point1Room.saveCostMatrix(cm);
			point1Room = Game.rooms[point1.roomName];
			cm = point1Room.getCostMatrix();
		}
		
		cm.set(path[i].x, path[i].y, 1);
	}
	point1Room.saveCostMatrix(cm);
	
	this.edgeList[vertexName1].length++;
	this.edgeList[vertexName2].length++;
	this.edgeList[vertexName1][vertexName2] = {start: point1.toString(), path: memoryUtilities.pathToString(path)};
	this.edgeList[vertexName2][vertexName1] = {start: point2.toString(), path: memoryUtilities.pathToString(reversePath)};
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
    	this.addNode('source_' + sources[i].id, sources[i].pos, 1);
    	this.sourceList.push({id: sources[i].id});
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
    	
    	if(this.edgeList[current.name].length === 0) {
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
roomCluster.prototype.getNextStructurePosition = function(type) {
	switch(type) {
		case STRUCTURE_EXTENSION:
			for(var s in this.sourceList) {
				for(var i in this.edgeList['source_' + this.sourceList[s].id]) {
					if(i !== 'length') {
						var path = memoryUtilities.pathFromString(this.edgeList['source_' + this.sourceList[s].id][i].path);
						var rm = Game.rooms[path[0].roomName];
						var cm = rm.getCostMatrix();
						
						
						for(var p in path) {
							var currentPos = path[p];
							
							if(currentPos.roomName !== rm.name) {
								rm = Game.rooms[currentPos.roomName];
								cm = rm.getCostMatrix();
							}
							
							var candidates = currentPos.getInRange(1);
							
							for(var c in candidates) {
								if(cm.get(candidates[c].x, candidates[c].y, candidates[c].roomName) === 0) {
									return candidates[c];
								}
							}
						}
					}
				}
			}
			console.log('No space found for ' + type);
			return {};
			break;
		default:
			console.log('unknown type: ' + type);
	}
};
roomCluster.prototype.runCreeps = function() {
	//TODO
};
roomCluster.prototype.manageSpawning = function() {
	//TODO
};

module.exports = roomCluster;