module.exports = {
	posFromString: function(string) {
		return new RoomPosition(parseInt(string.slice(0,2), parseInt(string.slice(2,4)), string.slice(4)));
	}
};