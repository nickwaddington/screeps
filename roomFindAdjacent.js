module.exports = function(p) {
	var positions = this.lookForAtArea(LOOK_TERRAIN, p.y-1, p.x-1, p.y+1, p.x+1, true);
	
	console.log(JSON.stringify(positions));
	
	return p;
};