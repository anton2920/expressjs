"use strict";

module.exports = { init, BlogDisplayTmplHandler, BlogCreateTmplHandler, BlogCreateHandler };

const errors = require("./errors.js");
const sessions = require("./sessions.js");
const tmpl = require("./tmpl.js");
const utils = require("./utils.js");

const fs = require("fs");

const BlogDirName = "./blog";

const PageFilePrefix = "page_";
const PageFileIDPad  = "00000";
const PageFileSuffix = ".json";

var PageFileIDLast = 0;

function init() {
	fs.readdir(BlogDirName, function(err, files) {
		if (err != null) {
			console.log("ERROR: failed to read blog directory: ", err);
			process.exit(1);
		}

		files.forEach(function(file) {
			++PageFileIDLast;
		});	
	});
}

function BlogDisplayTmplHandler(r, w) {

}

function BlogCreateTmplHandler(r, w) {
	tmpl.WriteTemplate(w, "create.hbs", 200, null, null);
}

function GetPageFileTitle() {
	const pageID = (PageFileIDPad + PageFileIDLast).slice(-PageFileIDPad.length);
	return BlogDirName + "/" + PageFilePrefix + pageID + PageFileSuffix;
}

function BlogCreateHandler(r, w) {
	const token = r.cookies["token"]
	if (token == undefined) {
		w.status(401);
		return;
	}
	const session = sessions.GetSessionFromToken(token)
	if (session == undefined) {
		w.status(401);
		return;
	}

	if (!utils.ParamsValidate(r.body, true, "Title", "Content")) {
		tmpl.WriteTemplate(w, "create.hbs", 400, r.body, errors.ReloadPageError);
		return;
	}

	const minTitleLen = 1;
	const maxTitleLen = 45;
	if (!utils.IsStringLengthInRange(r.body.Title, minTitleLen, maxTitleLen)) {
		tmpl.WriteTemplate(w, "create.hbs", 400, r.body, `title length must be between ${minTitleLen} and ${maxTitleLen} characters long`);
		return;
	}

	const minContentsLen = 1;
	const maxContentsLen = 16384;
	if (!utils.IsStringLengthInRange(r.body.Title, minContentsLen, maxContentsLen)) {
		tmpl.WriteTemplate(w, "create.hbs", 400, r.body, `contents length must be between ${minContentsLen} and ${maxContentsLen} characters long`);
		return;
	}

	fs.writeFile(GetPageFileTitle(), JSON.stringify(r.body), function(err) {
		if (err != null) {
			console.log("ERROR: failed to store blog post: ", err);
			tmpl.WriteTemplate(w, "error.hbs", 500, null, errors.TryAgainLaterError);
			return;
		}
		++PageFileIDLast;
	});

	w.redirect(303, "/");
}
