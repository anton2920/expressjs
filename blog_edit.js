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
		tmpl.WriteTemplate(w, "error.hbs", 401, null, errors.UnauthorizedError);
		return;
	}
	var session = sessions.GetSessionFromToken(token)
	if (session == undefined) {
		tmpl.WriteTemplate(w, "error.hbs", 401, null, errors.UnauthorizedError);
		return;
	}

	if (!utils.ParamsValidate(r.body, true, "PageID")) {
		tmpl.WriteTemplate(w, "error.hbs", 400, r.body, errors.ReloadPageError);
		return;
	}
	var pageID = r.body["PageID"]

	var filename = blog.GetPageFileName(pageID);

	try {
		var pageJSON = fs.readFileSync(filename, "utf8");
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
		tmpl.WriteTemplate(w, "error.hbs", 401, null, errors.UnauthorizedError);
		return;
	}
	var session = sessions.GetSessionFromToken(token)
	if (session == undefined) {
		tmpl.WriteTemplate(w, "error.hbs", 401, null, errors.UnauthorizedError);
		return;
	}

	if (!utils.ParamsValidate(r.body, true, "PageID", "CreatedOn", "Title", "Summary", "Content")) {
		tmpl.WriteTemplate(w, "create.hbs", 400, r.body, errors.ReloadPageError);
		return;
	}

	const minTitleLen = 1;
	const maxTitleLen = 45;
	if (!utils.IsStringLengthInRange(r.body.Title, minTitleLen, maxTitleLen)) {
		tmpl.WriteTemplate(w, "edit.hbs", 400, r.body, `title length must be between ${minTitleLen} and ${maxTitleLen} characters long`);
		return;
	}

	const minSummaryLen = 1;
	const maxSummaryLen = 128;
	if (!utils.IsStringLengthInRange(r.body.Summary, minSummaryLen, maxSummaryLen)) {
		tmpl.WriteTemplate(w, "create.hbs", 400, r.body, `summary length must be between ${minSummaryLen} and ${maxSummaryLen} characters long`);
		return;
	}

	const minContentsLen = 1;
	const maxContentsLen = 16384;
	if (!utils.IsStringLengthInRange(r.body.Title, minContentsLen, maxContentsLen)) {
		tmpl.WriteTemplate(w, "edit.hbs", 400, r.body, `contents length must be between ${minContentsLen} and ${maxContentsLen} characters long`);
		return;
	}
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
