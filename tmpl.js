"use strict";

module.exports = { InitTemplates, WriteTemplate };

const fs = require("fs");
const handlebars = require("handlebars");

const TemplatesDirectory = "./templates"

var Tmpls;

function InitTemplates() {
	Tmpls = {
		"create.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/create.hbs", "utf8")),
		"edit.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/edit.hbs", "utf8")),
		"error.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/error.hbs", "utf8")),
		"index.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/index.hbs", "utf8")),
		"page.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/page.hbs", "utf8")),
		"signin.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/signin.hbs", "utf8")),
		"signup.hbs": handlebars.compile(fs.readFileSync(TemplatesDirectory+"/signup.hbs", "utf8")),
	};

	handlebars.registerPartial("error-div.hbs", fs.readFileSync(TemplatesDirectory+"/error-div.hbs", "utf8"));
}

function WriteTemplate(w, tmplName, respCode, payload, err) {
	w.status(respCode).send(Tmpls[tmplName]({
		"Payload": payload,
		"Error": err,
	}));
}
