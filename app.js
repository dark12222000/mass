var request = require('request');
var argv = require('yargs').argv;
var cheerio = require('cheerio');
var fs = require('fs');

var pre;
var suf;

//console.log(argv);

//Make sure we have our output directory
if(!fs.existsSync('output/')){
	fs.makedirSync('output/');
	console.log('Oops, no output directory, we can fix that...');
}

if(argv.url){
	var url = argv.url.split('{}');
	console.log(url);
	if(url.length >= 2){
		pre = url[0];
		suf = url[1];
		doPull();
	}else{
		console.log('Bad URL format darling, give it another go...');
		process.exit(1);
	}
}else{
	console.log('Oops! Please give me a URL! Leaving...');
	process.exit(1);
}

function doPull(){

	var max = 100;

	if(argv.max){
		max = argv.max;
	}

	console.log(argv);

	if(argv.name){
		if(!fs.existsSync('output/'+argv.name)){
			fs.mkdirSync('output/'+argv.name);
		}
	}

	for(var i = 1; i<max; i++){
		//console.log('Now trying to get: ' + pre+i+suf);
		pullImgSrc(pre+i+suf, argv.id, i, grabImage);
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