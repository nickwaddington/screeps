module.exports = function(job) {
	var spawn = this.find(FIND_MY_SPAWNS)[0];
    var source = Game.getObjectById(job.location);
    var homePos = this.getPositionAt(spawn.pos.x, spawn.pos.y - 1);
    var targetPos = this.findAdjacent(source.pos);
    var path = homePos.findPathTo(targetPos); //TODO store paths centrally
    var pathH = targetPos.findPathTo(homePos);
    
    return spawn.createCreep([WORK,CARRY,MOVE], null, {
    	role: job.type,
    	action: 1,
    	home: spawn.id,
    	target: job.location,
    	pathTarget: path,
    	pathHome: pathH
    });
};