var mod = {
	posFromString: function(string) {
		var x = parseInt(string.slice(0,2));
		var y = parseInt(string.slice(2,4));
		var name = string.slice(4);
		
		return new RoomPosition(x, y, name);
	},
	pathFromString: function(string) {
		console.log(string);
		var arr = string.split(',');
		
		for(var i in arr) {
			arr[i] = this.posFromString(arr[i]);
		}
		
		return arr;
	},
	pathToString: function(path) {
		var string = '';
		for(var i in path) {
			if(string === '') {
				string = path[i].toString();
			}
			else {
				string = string + ',' + path[i].toString();
			}
		}
	}
};

module.exports = mod;