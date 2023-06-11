"use strict";

module.exports = { InitTemplates, WriteTemplate };

const fs = require("fs");
const handlebars = require("handlebars");

const TemplatesDirectory = "./templates"

var Tmpls;

function InitTemplates() {
	Tmpls = {
		"create.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/create.hbs")),
		"edit.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/edit.hbs")),
		"error.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/error.hbs")),
		"index.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/index.hbs")),
		"page.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/page.hbs")),
		"signin.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/signin.hbs")),
		"signup.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/signup.hbs")),
	};

	handlebars.registerPartial("error-div.hbs", fs.readFileSync(TemplatesDirectory+"/error-div.hbs"));

	handlebars.registerHelper("TimeToStringDate", function(t) {
		var date = new Date(t);
		var offset = date.getTimezoneOffset()
		date = new Date(date.getTime() - (offset*60*1000))
		return date.toISOString().split('T')[0]
	});
}

function WriteTemplate(w, tmplName, respCode, payload, err) {
	w.status(respCode).send(Tmpls[tmplName]({
		"Payload": payload,
		"Error": err,
	}));
}
