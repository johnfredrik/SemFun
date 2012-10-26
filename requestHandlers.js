var querystring = require('querystring');
var http = require('http');


var body = '<html>' +
      '<head>' +
      '<meta http-equiv="Content-Type" content="text/html; ' +
      'charset=UTF-8" />' +
      '<link rel="stylesheet" type="text/css" href="css/style.css" />' +
      '</head>' +
      '<body>' +
      '<form action="/checklist" method="GET">' +
      '<select name="uri" id="uri">' +
      '<option value="http://dbtune.org/magnatune/artist/skitzo">Skitzo</option>' +
      '<option value="http://dbtune.org/magnatune/artist/carrai">Carrai</option>' +
      '</select>' +
      '<input type="submit" value="Submit text" />' +
      '</form>' +
      '</body>' +
      '</html>';



function start(req, res) {
  console.log("Request handler start was called.");
  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(body);
  res.end();
}

function checklist(req, res) {
  
  var uri = req.param('uri');
  console.log("Request handler checklist was called with params " + req.param('uri'));


  var prefix = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
    select = encodeURIComponent('SELECT ?title ?made WHERE { ?made foaf:maker <') + uri + encodeURIComponent('>; rdfs:label ?title }'),
    repository = '/openrdf-sesame/repositories/magnatune?query=',
    datajson = "",
    options = {
      host: 'collos.zapto.org',
      port: 8088,
      path:  repository + encodeURIComponent(prefix) + select,
      headers: { accept: 'application/sparql-results+json'

        },
      method: 'GET'
    },

    request = http.request(options, function (response) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
       // console.log('BODY: ' + chunk);
        datajson += chunk;
      });

      response.on('end', function () {
        var json = JSON.parse(datajson),
          madeTitle = "",
          i = 0,
          jsonLength = json.results.bindings.length;
        for (i; i < jsonLength; i++) {
          madeTitle += '<p class="made">' + JSON.stringify(json.results.bindings[i].made.value) + '</p>' +
            '<p class="title">' + JSON.stringify(json.results.bindings[i].title.value) + '</p>';
        }

        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(body + madeTitle);
        res.end();
      });
    });

  request.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
  request.end();
}

function upload(response, postData) {
	console.log('Request handler upload was called.');
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write('You have sent: ' + postData);
	response.end();
}


exports.start = start;
exports.checklist = checklist;
exports.upload = upload;
