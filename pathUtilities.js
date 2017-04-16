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
		//var cm = PathFinder.CostMatrix.deserialize(rm.memory.costMatrix);
		var cm = new PathFinder.CostMatrix();
		
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
		Graph.prototype.addEdge = function(vertex1, vertex2, v1, v2) {
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
			
			
			var pt1 = v2.findClosestByPath(parent.findAdjacent(rm, v1, v1range), {
				costCallback: function(roomName, newCM) {
					if(roomName === rm.name) {
						return cm;
					}
					return newCM;
				}
			});
			var pt2 = v1.findClosestByPath(parent.findAdjacent(rm, v2, v2range), {
				costCallback: function(roomName, newCM) {
					if(roomName === rm.name) {
						return cm;
					}
					return newCM;
				}
			});
			
			var ret = PathFinder.search(pt1, pt2, {
				roomCallback: function(roomName) {
					if(roomName === rm.name) {
						return cm;
					}
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
				cm.set(p[i].x, p[i].y, 1);
			}
			cm.set(pt1.x, pt1.y, 1);
			
			
			rm.memory.edges[vertex1].push({vertex: vertex2, path: p, start: pt1});
			rm.memory.edges[vertex2].push({vertex: vertex1, path: revP, start: pt2});
			rm.memory.numberOfEdges++;
			
			//console.log(JSON.stringify(rm.memory.edges));
		};
		
		var graph = new Graph();
		var rv = new RoomVisual(rm.name);
		
		var spawn = rm.find(FIND_MY_SPAWNS)[0];
		cm.set(spawn.pos.x, spawn.pos.y, 255);
		graph.addVertex(spawn.id, 1);
		graph.addVertex(rm.controller.id, 3);
		
	    var sources = rm.find(FIND_SOURCES_ACTIVE);
	    
	    var plotPoints = [];
	    
	    plotPoints = plotPoints.concat(this.findAdjacent(rm, spawn.pos, 1));
	    plotPoints = plotPoints.concat(this.findAdjacent(rm, rm.controller.pos, 3));
	    
	    for(var i in sources) {
	    	var src = sources[i];
	    	
	    	plotPoints = plotPoints.concat(this.findAdjacent(rm, src.pos, 1));
	    	
	    	graph.addVertex(src.id, 1);
	    	graph.addEdge(src.id, rm.controller.id, src.pos, rm.controller.pos);
	    	graph.addEdge(src.id, spawn.id, src.pos, spawn.pos);
	    	
	    	var pth = this.getPath(rm, src.id,spawn.id);
	    	//rv.poly(pth);
	    	
	    	var pth2 = this.getPath(rm, src.id,rm.controller.id);
	    	//rv.poly(pth2);
	    }
	    
	    var exits = [FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT];
	    for(var e in exits) {
	    	var exitPositions = rm.find(exits[e]);
	    	
	    	if(exitPositions.length > 0) {
	    		/*var roomName = describeExits(rm.name)[e.toString()];
	    		
	    		if(!Game.map.isRoomAvailable(roomName)) {
	    			continue;
	    		}*/
	    		
	    		graph.addVertex(exits[e], 0);
	    		graph.addEdge(exits[e], spawn.id, exitPositions[0], spawn.pos);
	    		graph.addEdge(exits[e], rm.controller.id, exitPositions[0], rm.controller.pos);
	    		
	    		var pth3 = this.getPath(rm, exits[e], spawn.id);
	    		rv.poly(pth3);
	    		
	    		var pth4 = this.getPath(rm, exits[e], rm.controller.id);
	    		rv.poly(pth4);
	    	}
	    }
	    
	    //var pth = rm.memory.edges[spawn.id][1].path;
	    //console.log(JSON.stringify(pth));
	    //rv.poly(pth);
	    
	    for(i in plotPoints) {
	    	rv.circle(plotPoints[i], {radius: 0.5, stroke: 'blue', fill: 'transparent'});
	    	
	    	cm.set(plotPoints[i].x, plotPoints[i].y, 6);
	    }
	    
	    //Get extension positions
	    rm.memory.extensionPositions = [];
	    
	    for(var j in sources) {
	    	var source = sources[j];
	    	
	    	var currentPath = this.getPath(rm, spawn.id, source.id);
	    	
	    	for(var c in currentPath) {
	    		for(var x = -1; x <= 1; x++) {
	    			for(var y = -1; y <= 1; y++) {
	    				if(rm.memory.extensionPositions.length > 66) {
	    					break;
	    				}
	    				
	    				if(cm.get(currentPath[c].x + x, currentPath[c].y + y) === 0) {
	    					if(Game.map.getTerrainAt(currentPath[c].x + x, currentPath[c].y + y, rm.name) !== 'wall') {
	    						rm.memory.extensionPositions.push(rm.getPositionAt(currentPath[c].x + x, currentPath[c].y + y));
	    						cm.set(currentPath[c].x + x, currentPath[c].y + y, 255);
	    					}
	    				}
	    			}
	    		}
	    	}
	    }
	    
	    for(var e in rm.memory.extensionPositions) {
	    	rv.circle(rm.memory.extensionPositions[e], {radius: 0.3, stroke: 'yellow', fill: 'transparent'});
	    }
	    
	    rm.memory.costMatrix = cm.serialize();
			
		
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