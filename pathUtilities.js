module.exports = {
	getPathTime: function(rm, body, path, load, fatigue) {
		if(typeof load === 'undefined') {
			load = 0;
		}
		if(typeof fatigue === 'undefined') {
			fatigue = 0;
		}
		
		var numMove = 0;
		var numCarry = 0;
		var numActiveCarry = Math.ceil(load/50);
		
		for(var i = 0; i < body.length; i++) {
			if(body[i] === MOVE) {
				numMove++;
			}
			else if(body[i] === CARRY) {
				numCarry++;
			}
		}
		
		var weight = body.length - numMove - numCarry + numActiveCarry;
		
		var time = Math.ceil(fatigue / numMove); //Start time at time it will take for fatigue to reach 0
		for(var p = 0; p < path.length; p++) {
			var terrain = Game.map.getTerrainAt(path[p].x, path[p].y, rm.name);
			
			if(false) { //road TODO
				time += Math.ceil((weight / 2) / numMove);
			}
			else if(terrain === 'swamp') {
				time += Math.ceil(5 * weight / numMove);
			}
			else { //plain
				time += Math.ceil(1 * weight / numMove);
			}
			
		}
		
		return time;
	},
	findAdjacent: function(rm, p, range) {
		var positions = rm.lookForAtArea(LOOK_TERRAIN, p.y-range, p.x-range, p.y+range, p.x+range, true);
		
		var filtered = _.filter(positions, function(o) {
			return o.terrain !== 'wall';
		});
		
		var arr = [];
		for(var i in filtered) {
			arr.push(rm.getPositionAt(filtered[i].x, filtered[i].y));
		}
		
		return arr;
	},
	initialisePaths: function(rm) {
		var parent = this;
		
		function Graph() {
			rm.memory.vertices = [];
			rm.memory.edges = [];
			rm.memory.numberOfEdges = 0;
			var temp = new PathFinder.CostMatrix();
			rm.memory.costMatrix = temp.serialize();
		}
		Graph.prototype.addVertex = function(vertex, r) {
			rm.memory.vertices.push({vertex: vertex, range: r});
			rm.memory.edges[vertex] = [];
		};
		Graph.prototype.addEdge = function(vertex1, vertex2) {
			var cm = PathFinder.CostMatrix.deserialize(rm.memory.costMatrix);
			
			var v1 = Game.getObjectById(vertex1).pos;
			var v2 = Game.getObjectById(vertex2).pos;
			
			var v1range = 1;
			var v2range = 1;
			for(var i in rm.memory.vertices) {
				var current = rm.memory.vertices[i];
				
				if(current.vertex === vertex1) {
					v1range = current.range;
				}
				if(current.vertex === vertex2) {
					v2range = current.range;
				}
			}
			
			
			var pt1 = v2.findClosestByPath(parent.findAdjacent(rm, v1, v1range));
			var pt2 = v1.findClosestByPath(parent.findAdjacent(rm, v2, v2range));
			
			var ret = PathFinder.search(pt1, pt2, {
				roomCallback: function(roomName) {
					return PathFinder.CostMatrix.deserialize(Game.rooms[roomName].memory.costMatrix);
				}
			});
			
			var p = ret.path;
			var temp = p;
			p.pop();
			var revP = temp.reverse();
			revP.push(pt1);
			
			//Make existing path more expensive in cost matrix so paths try to avoid overlapping
			for(i in p) {
				cm.set(p.x, p.y, 6);
			}
			cm.set(pt1.x, pt1.y, 6);
			
			rm.memory.costMatrix = cm.serialize();
			
			rm.memory.edges[vertex1].push({vertex: vertex2, path: p, start: pt1});
			rm.memory.edges[vertex2].push({vertex: vertex1, path: revP, start: pt2});
			rm.memory.numberOfEdges++;
		};
		
		
		var graph = new Graph();
		var rv = new RoomVisual(rm.name);
		
		var spawn = rm.find(FIND_MY_SPAWNS)[0];
		graph.addVertex(spawn.id, 1);
		graph.addVertex(rm.controller.id, 3);
		
	    var sources = rm.find(FIND_SOURCES_ACTIVE);
	    
	    var nums = [0,3];
	    var plotPoints = [];
	    
	    plotPoints = plotPoints.concat(this.findAdjacent(rm, spawn.pos, 1));
	    plotPoints = plotPoints.concat(this.findAdjacent(rm, rm.controller.pos, 3));
	    
	    for(var i in nums) {
	    	var src = sources[nums[i]];
	    	
	    	plotPoints = plotPoints.concat(this.findAdjacent(rm, src.pos, 1));
	    	
	    	graph.addVertex(src.id, 1);
	    	graph.addEdge(src.id,spawn.id);
	    	graph.addEdge(src.id,rm.controller.id);
	    	
	    	var pth = this.getPath(rm, src.id,spawn.id);
	    	rv.poly(pth);
	    	
	    	var pth2 = this.getPath(rm, src.id,rm.controller.id);
	    	rv.poly(pth2);
	    }
	    
	    //var pth = rm.memory.edges[spawn.id][1].path;
	    //console.log(JSON.stringify(pth));
	    //rv.poly(pth);
	    
	    for(i in plotPoints) {
	    	rv.circle(plotPoints[i], {radius: 0.5, stroke: 'blue', fill: 'transparent'});
	    }
		
	},
	getPath: function(rm, a, b) {
		for(var i in rm.memory.edges[a]) {
			var current = rm.memory.edges[a][i];
			
			if(current.vertex === b) {
				return current.path;
			}
		}
		return [];
	}
};