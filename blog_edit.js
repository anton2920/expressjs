"use strict";

module.exports = { BlogEditTmplHandler, BlogEditHandler };

const blog = require("./blog.js");
const errors = require("./errors.js");
const sessions = require("./sessions.js");
const tmpl = require("./tmpl.js");
const utils = require("./utils.js");

const fs = require("fs");

function BlogEditTmplHandler(r, w) {
	var token = r.cookies["token"]
	if (token == undefined) {
		w.status(401);
		return;
	}
	var session = sessions.GetSessionFromToken(token)
	if (session == undefined) {
		w.status(401);
		return;
	}

	if (!utils.ParamsValidate(r.body, true, "PageID")) {
		tmpl.WriteTemplate(w, "error.hbs", 400, r.body, errors.ReloadPageError);
		return;
	}
	var pageID = r.body["PageID"]

	var filename = blog.GetPageFileName(pageID);

	try {
		var pageJSON = fs.readFileSync(filename, "utf-8");
	} catch(err) {
		if (err.code == "ENOENT") {
			tmpl.WriteTemplate(w, "error.hbs", 400, null, "blog page does not exist");
		} else {
			console.log("ERROR: failed to open page file: ", err);
			tmpl.WriteTemplate(w, "error.hbs", 500, null, errors.TryAgainLaterError);
		}
		return;
	}
	var page = JSON.parse(pageJSON);
	page.ID = pageID;

	tmpl.WriteTemplate(w, "edit.hbs", 200, page, null);
}

function BlogEditHandler(r, w) {
	var token = r.cookies["token"]
	if (token == undefined) {
		w.status(401);
		return;
	}
	var session = sessions.GetSessionFromToken(token)
	if (session == undefined) {
		w.status(401);
		return;
	}

	if (!utils.ParamsValidate(r.body, true, "PageID", "Title", "Content", "CreatedOn")) {
		tmpl.WriteTemplate(w, "create.hbs", 400, r.body, errors.ReloadPageError);
		return;
	}

	const minTitleLen = 1;
	const maxTitleLen = 45;
	if (!utils.IsStringLengthInRange(r.body.Title, minTitleLen, maxTitleLen)) {
		tmpl.WriteTemplate(w, "edit.hbs", 400, r.body, `title length must be between ${minTitleLen} and ${maxTitleLen} characters long`);
		return;
	}

	const minContentsLen = 1;
	const maxContentsLen = 16384;
	if (!utils.IsStringLengthInRange(r.body.Title, minContentsLen, maxContentsLen)) {
		tmpl.WriteTemplate(w, "edit.hbs", 400, r.body, `contents length must be between ${minContentsLen} and ${maxContentsLen} characters long`);
		return;
	}
	r.body.CreatedOn = +r.body.CreatedOn;
	r.body.UpdatedOn = Date.now();

	var pageID = r.body.PageID;
	r.body.PageID = undefined;

	fs.writeFile(blog.GetPageFileName(pageID), JSON.stringify(r.body), function(err) {
		if (err != null) {
			console.log("ERROR: failed to store blog post: ", err);
			tmpl.WriteTemplate(w, "error.hbs", 500, null, errors.TryAgainLaterError);
			return;
		}
	});

	w.redirect(303, "/page_"+pageID);
}
