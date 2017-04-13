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
			var terrain = rm.lookForAt(LOOK_TERRAIN, path[p].x, path[p].y)[0];
			
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
	}
};