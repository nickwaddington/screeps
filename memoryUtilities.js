module.exports = {
	posFromString: function(string) {
		var x = parseInt(string.slice(0,2));
		var y = parseInt(string.slice(2,4));
		var name = string.slice(4);
		
		console.log(string);
		console.log(x,y,name);
		
		return new RoomPosition(x, y, name);
	}
};