var http = require("http");
var url = require("url");
var express = require('express');
var requestHandlers = require("./requestHandlers");

var app = express();

app.configure(function () {
	app.use(express.static(__dirname));
});

app.get('/', requestHandlers.start);
app.get('/checklist', requestHandlers.checklist);

app.listen(8888);
console.log('Listening on port 8888');



