
exports.autoload = function(db, directory){

	var fs	= require("fs")
	, path	= require("path")
	, sys	= require("sys");

	var files = fs.readdirSync(directory);

	var names = _.map(files, function(f){
		return path.basename(f);
	});

	// route statically top-level resources to main controller
	app.resource(require(path.join(directory, 'main')));

	var controllers = {};
	_.each(names, function(name){

		var controller = name.replace(/.js$/,'');

		controllers[controller] = app.resource(
			controller,
			require(path.join(directory, name))
		);

	});

	return controllers;

};
