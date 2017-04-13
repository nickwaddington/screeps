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
		graph.addVertex(1);
		graph.addVertex(2);
		graph.addVertex(3);
		graph.addVertex(4);
		graph.addVertex(5);
		graph.addVertex(6);
		graph.print(); // 1 -> | 2 -> | 3 -> | 4 -> | 5 -> | 6 ->
		graph.addEdge(1, 2);
		graph.addEdge(1, 5);
		graph.addEdge(2, 3);
		graph.addEdge(2, 5);
		graph.addEdge(3, 4);
		graph.addEdge(4, 5);
		graph.addEdge(4, 6);
		graph.print(); // 1 -> 2, 5 | 2 -> 1, 3, 5 | 3 -> 2, 4 | 4 -> 3, 5, 6 | 5 -> 1, 2, 4 | 6 -> 4
		console.log('graph size (number of vertices):', graph.size()); // => 6
		console.log('graph relations (number of edges):', graph.relations()); // => 7
		graph.traverseDFS(1, function(vertex) { console.log(vertex); }); // => 1 2 3 4 5 6
		console.log('---');
		graph.traverseBFS(1, function(vertex) { console.log(vertex); }); // => 1 2 5 3 4 6
		graph.traverseDFS(0, function(vertex) { console.log(vertex); }); // => 'Vertex not found'
		graph.traverseBFS(0, function(vertex) { console.log(vertex); }); // => 'Vertex not found'
		console.log('path from 6 to 1:', graph.pathFromTo(6, 1)); // => 6-4-5-1
		console.log('path from 3 to 5:', graph.pathFromTo(3, 5)); // => 3-2-5
		graph.removeEdge(1, 2);
		graph.removeEdge(4, 5);
		graph.removeEdge(10, 11);
		console.log('graph relations (number of edges):', graph.relations()); // => 5
		console.log('path from 6 to 1:', graph.pathFromTo(6, 1)); // => 6-4-3-2-5-1
		graph.addEdge(1, 2);
		graph.addEdge(4, 5);
		console.log('graph relations (number of edges):', graph.relations()); // => 7
		console.log('path from 6 to 1:', graph.pathFromTo(6, 1)); // => 6-4-5-1
		graph.removeVertex(5);
		console.log('graph size (number of vertices):', graph.size()); // => 5
		console.log('graph relations (number of edges):', graph.relations()); // => 4
		console.log('path from 6 to 1:', graph.pathFromTo(6, 1)); // => 6-4-3-2-1
	},
	getPath: function(rm, a, b) {
		
	}
};