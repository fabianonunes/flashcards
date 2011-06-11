
exports.autoload = function(db, directory){

	var fs		= require("fs")
	, path		= require("path")
	, mongoose	= require("mongoose");

	var files	= fs.readdirSync(directory);
	
	var names	= _.map(files, function(f){
		return path.basename(f);
	});

	var models	= {};

	_.each(names,function(name){

		var model = name.replace(/.js$/,'');
		models[model] = require(path.join(directory, name));
		
	});

	return models;

};
