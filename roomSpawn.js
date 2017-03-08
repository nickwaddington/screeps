module.exports = function() {
	var spawn = this.find(FIND_MY_SPAWNS)[0];
    var source = this.find(FIND_SOURCES)[0];
    var homePos = this.getPositionAt(spawn.pos.x, spawn.pos.y - 1);
    var targetPos = this.getPositionAt(source.pos.x - 1, source.pos.y + 1);
    var path = homePos.findPathTo(targetPos);
    var pathH = targetPos.findPathTo(homePos);
    var buildType = STRUCTURE_CONTAINER;
    
    spawn.createCreep([WORK,CARRY,MOVE], null, {role: 'containerHarvester', action: 1, home: spawn.id, target: source.id, pathTarget: path, pathHome: pathH, buildType: buildType});
};