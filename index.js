var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/checklist"] = requestHandlers.checklist;
handle["css/style.css"] = requestHandlers.css;
handle["/upload"] = requestHandlers.upload;


server.start(router.route, handle);