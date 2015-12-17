var http = require('http');
var fs = require('fs');

var express = require("express");
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var socketPort = 6378;
server.listen(socketPort);

// I don't think 
app.use(express.static('static'));

var parse = require("./parse.js");
 
var port = 6376;
var webPort = 6377;


var host = '127.0.0.1';
 

// this is the server for the game's post requests
// from https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration
postServer = http.createServer( function(req, res) {

	if (req.method == 'POST') {
		console.log("Handling POST request...");
		res.writeHead(200, {'Content-Type': 'text/html'});

		var body = '';
		req.on('data', function (data) {
			body += data;
		});
		req.on('end', function () {
			// console.log("POST payload: " + body);
			parse.logJSON(body);
			// console.log(parse.organizeWeapons(body));
			// console.log(parse.organizeState(body));
			io.emit("update", JSON.stringify(parse.organizeState(body)));
			io.emit("update", JSON.stringify(parse.organizeWeapons(body)));
			res.end( '' );
		});
	}
	else
	{
		console.log("Not expecting other request types...");
		res.writeHead(200, {'Content-Type': 'text/html'});
		var html = 'ok';
		res.end(html);
	}
 
});

postServer.listen(port, host);
console.log('game at http://' + host + ':' + port);

var webServer = app.listen(webPort, function () {
  var host = webServer.address().address;
  var port = webServer.address().port;
  console.log(' web at http://%s:%s', host, port);
});