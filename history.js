

var fs = require('fs')
, _	= require('underscore');

fs.readFile(process.argv[2], 'utf-8', function(err, contents){

	var _d = 'destino'
	, _o = 'origem',
	_here = ["SEJUD", "SEGJUD"];
	
	var obj	 = JSON.parse(contents)
	, agg   = {}
	, rows  = [];

	// aggregates the values by [Processo]
	obj.forEach(function(v){
		if(!agg[v.processo]){
			agg[v.processo] = [];
		}
		var key = v.processo;
		v.date = new Date(v.date);
		delete v.processo;
		agg[key].push(v);
	});

	// remove duplicates moviments
	_.keys(agg).forEach(function(processo){

		var pr_o = "-" // previous_origem
		, pr_d = "-" // previous_destino
		, ms = agg[processo];

		ms.forEach(function(v){

			if((

				v[_o] == pr_o
					&&
				v[_d] == pr_d
				
					) || (

				_.contains(_here, v[_o])
					&&
				_.contains(_here, v[_d])

			)){

				v.remove = true;

			} else {
				pr_o = v[_o];
				pr_d = v[_d];
			}

		});

		agg[processo] = agg[processo].filter(function(v){
			return !v.remove;
		});

	});

	// remove first input if origem matches /SEG?JUD/
	_.keys(agg).forEach(function(v){
		if(agg[v].length == 0){
			delete agg[v];
			return true;
		}
		var origem	= agg[v][0][_o];
		if(_.contains(_here, origem)){
			delete agg[v][0];
		}
		agg[v] = _.compact(agg[v]);
		if(agg[v].length == 0){
			delete agg[v];
		}
	});
	//

	var byDate = aggByDay();
	// considera só a maior data das movimentações do mesmo dia quando ímpar e 
	// remove todas as movimentações do dia quando par.
	_.keys(byDate).forEach(function(processo){

		var data = agg[processo]
		, ms = byDate[processo] // movimentações
		, dates = [] // datas stack
		, ios = [];  // input and outputs in se(g)jud

		_.keys(ms).forEach(function(date){

			var length = ms[date].length;

			if(~length%2){

				delete ms[date];

			} else {
				
				var max = _.max(ms[date], function(m){
					return m.date;
				});

				// não adiciona movimentações de se(g)jud para se(g)jud
				if(max.origem!=max.destino){
					dates.push(max);
				}

			}

		});

		dates = _.sortBy(dates, function(io){
			return io.date;
		});

		dates.forEach(function(v, k){

			(k%2) || ios.push({});

			var field = (~k%2) ? 'in' : 'out';

			_.last(ios)[field] = v; 
			
		});

		if(ios.length == 0){
			delete byDate[processo];
		} else {
			byDate[processo] = ios;

			ios.forEach(function(io) {

				if(!_.contains(_here, io.in.destino)){

					console.log(processo);

				}

			});


		}

	});

	// console.log(JSON.stringify(byDate, null, '\t'));

	
	//console.log(_.keys(byDate));

	/* *
	_.keys(byDate).forEach(function(processo){

		var data = agg[processo]
			, ms = byDate[processo];

		_.keys(ms).forEach(function(date){

			var length = ms[date].length;

			if(length > 2){

				for(var i = length; i > 1;){
					if(ms[date][--i][_o] == ms[date][i-1][_d]){
						if(ms[date][i-1][_o] == ms[date][i][_d]){
							ms[date][i].remove = ms[date][i-1].remove = true;
						}
					}
				}

			} else if(length == 2){
				
				ms[date].forEach(function(v) {
					v.remove = true;
				});

			}

		});

		agg[processo] = agg[processo].filter(function(v){
			return !v.remove;
		});

	});

	_.each(agg, function(v, i){
		if(v.length == 0){
			delete agg[i];
		}
	});

	var byDate = aggByDay();
	_.keys(byDate).forEach(function(processo){

		var data = agg[processo]
			, ms = byDate[processo];

		var i = 0;
		var single = _.detect(ms, function(v){
			i++;
			return v.length == 1;
		});

		_.keys(ms).forEach(function(date){

			var length = ms[date].length;

			if(length == 1){
				return;
			}

			var o = _.select(ms[date], function(v){
				return ~_here.indexOf(v[_o]);
			});

			var d = _.select(ms[date], function(v){
				return ~_here.indexOf(v[_d]);
			});


		});

		agg[processo] = agg[processo].filter(function(v){
			return !v.remove;
		});

	});
	
	


	// remove input/output in same day
	_.keys(agg).forEach(function(v){

		var length = agg[v].length;

		var last = agg[v][0][_d];

		agg[v].forEach(function(v, k){
			
			var field = (~k%2) ? _d : _o;
				
		});

	});


	// _.keys(agg).forEach(function(v){

	// 	console.log(JSON.stringify(agg[v]));

	// });



	// process.stdout.write(jsonToCSV(rows, true, null));
	// process.stdout.write(JSON.stringify(agg));

	/* */

	function aggByDay(){

		var r = {};
	
		_.keys(agg).forEach(function(processo){

			var data = agg[processo]
				, ms = {};

			data.forEach(function(v){

				var date = new Date(
					v.date.getUTCFullYear(),
					v.date.getUTCMonth(),
					v.date.getUTCDate()
				);

				if(!ms[date])
					 ms[date] = [];

				ms[date].push(v);

			});

			r[processo] = ms;

		});

		return r;

	}

});