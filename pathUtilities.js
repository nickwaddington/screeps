var Graph = require('graph');

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
		var graph = new Graph();
		var rv = new RoomVisual(rm.name);
		
		var spawn = rm.find(FIND_MY_SPAWNS)[0];
		graph.addVertex(spawn.id);
		graph.addVertex(rm.controller.id);
		
	    var sources = rm.find(FIND_SOURCES_ACTIVE);
	    
	    var nums = [0,3];
	    var plotPoints = [];
	    
	    plotPoints = plotPoints.concat(this.findAdjacent(rm, spawn.pos, 1));
	    plotPoints = plotPoints.concat(this.findAdjacent(rm, rm.controller.pos, 3));
	    
	    for(var i in nums) {
	    	var src = sources[nums[i]];
	    	
	    	rv.rect(src.pos.x - 1, src.pos.y - 1, 2, 2);
	    	plotPoints = plotPoints.concat(this.findAdjacent(rm, src.pos, 1));
	    	
	    	graph.addVertex(src.id);
	    	graph.addEdge(src.id,spawn.id);
	    	graph.addEdge(src.id,rm.controller.id);
	    }
	    
	    
	    for(i in plotPoints) {
	    	rv.circle(plotPoints[i], {radius: 0.5, stroke: 'blue', fill: 'transparent'});
	    }
		
		
		graph.print();
		
	},
	getPath: function(rm, a, b) {
		
	}
};