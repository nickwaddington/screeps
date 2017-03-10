module.exports = function(p) {
	var positions = this.lookForAtArea(LOOK_TERRAIN, p.y-1, p.x-1, p.y+1, p.x+1, true);
	
	var filtered = _.filter(positions, function(o) {
		return o.terrain !== 'wall';
	});
	
	console.log(JSON.stringify(filtered));
	
	return p;
};