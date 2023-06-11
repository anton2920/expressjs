"use strict";


/* tmpl.js */
const FS = require("fs");
const HBS = require("handlebars");
var Tmpls;

function InitTemplates()
{
	Tmpls = {
		"index.hbs": HBS.compile(FS.readFileSync("./templates/index.hbs", "utf8")),
	};
}

function WriteTemplate(w, tmpl, code, payload, err)
{
	w.status(code).send(Tmpls[tmpl]({payload, err}));
}


/* main.js */
const Express = require('express');
const App = Express();
const Port = 8080;

App.get("/", function(r, w) {
	WriteTemplate(w, "index.hbs", 200, undefined, undefined);
});

App.listen(Port, function() {
	InitTemplates();
	console.log(`Listening on port ${Port}`);
});
