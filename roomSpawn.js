module.exports = function(job) {
	var spawn = this.find(FIND_MY_SPAWNS)[0];
    var source = Game.getObjectById(job.location);
    var homePos = this.getPositionAt(spawn.pos.x, spawn.pos.y - 1);
    var targetPos = this.getPositionAt(source.pos.x - 1, source.pos.y + 1); //TODO make dynamic
    var path = homePos.findPathTo(targetPos);
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