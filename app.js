var request = require('request');
var argv = require('yargs').argv;
var cheerio = require('cheerio');
var fs = require('fs');
var express = require('express');
var app = express();

var pre;
var suf;

//console.log(argv);

//Make sure we have our output directory
if(!fs.existsSync('output/')){
	fs.makedirSync('output/');
	console.log('Oops, no output directory, we can fix that...');
}

if(argv.url){
	mass(argv.url, argv.max, argv.name, argv.id);
}else{
	console.log('No url argument, defaulting to api mode...');
	
	app.all('*', function(req, res, next){
		
		res.header('Access-Control-Allow-Origin', '*');
    	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    	res.header('Access-Control-Allow-Headers', 'Content-Type');

    	next();
	});

	app.get('/v1/mass', function(req, res){
		console.log('Got a call..');
		console.log(req.query);

		mass(req.query.url, req.query.max, req.query.name, req.query.selector, function(success, error){
			
		});
		res.send(200);
	});

	app.listen(9001);
	console.log('API Interface up on 9001');
}

function mass(url, max, name, selector, callback){
	if(url){
		url = url.split('{}');
		//console.log(url);
		if(url.length >= 2){
			pre = url[0];
			suf = url[1];
		}else{
			console.log('Bad URL format darling, give it another go...');
			if(argv.url){
				process.exit(1);
			}
		}
	}else{
		console.log('Oops! Please give me a URL! Leaving...');
		if(argv.url){
			process.exit(1);
		}
	}

	if(!max){
		max = 50;
	}

	if(name){
		if(!fs.existsSync('output/'+argv.name)){
			fs.mkdirSync('output/'+argv.name);
		}
	}

	for(var i = 1; i<max; i++){
		//console.log('Now trying to get: ' + pre+i+suf);
		pullImgSrc(pre+i+suf, selector, i, grabImage, callback);
	}
}

function pullImgSrc(_url, id, count, callback){
	
	if(!id){
		id = '#image';
	}else{
		console.log('Using :' + id);
	}

	console.log('Let us grab some ' + _url);

	request.get(_url, function(err, response, body){
		if(response.statusCode == 200){
			console.log('Got some ' + _url);
			var $ = cheerio.load(body);
			callback($(id).attr('src'), count);
		}else{
			callback(false)
		}
	});
}

function grabImage(src, count){
	if(src){
		var url = src.split('/');
		var name = url[url.length-1].split('?');
		name = name[0];
		name = name.split('.');
		name = name[name.length - 1];
		name = count + '.' + name;

		var directory = 'output/' + name;

		if(argv.name){
			directory = 'output/'+argv.name+'/'+name;
		}

		request.get(src).pipe(fs.createWriteStream(directory));

		console.log('Saved #'+count);
	}
}