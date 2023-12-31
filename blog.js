"use strict";

module.exports = { init, PageFileIDLast, GetPageFileName, BlogDisplayTmplHandler, BlogPagesHandler };

const errors = require("./errors.js");
const sessions = require("./sessions.js");
const tmpl = require("./tmpl.js");

const fs = require("fs");

const BlogDirName = "./blog";
const PageFilePrefix = "page_";
const PageFileIDPad  = "00000";
const PageFileSuffix = ".json";

var PageFileIDLast;

function init() {
	PageFileIDLast = 0;

	fs.mkdirSync(BlogDirName, { recursive: true });
	var files = fs.readdirSync(BlogDirName);
	files.forEach(function(file) {
		++PageFileIDLast;
	});

	module.exports.PageFileIDLast = PageFileIDLast;
}

function GetPageFileName(pageID) {
	var pageID = (PageFileIDPad + pageID).slice(-PageFileIDPad.length);
	return BlogDirName + "/" + PageFilePrefix + pageID + PageFileSuffix;
}

function BlogDisplayTmplHandler(r, w) {
	var signedIn = false;

	var token = r.cookies["token"];
	if (token != undefined) {
		var session = sessions.GetSessionFromToken(token);
		if (session != undefined) {
			signedIn = true;
		}
	}

	var pageID = r.params["PageID"]
	var filename = GetPageFileName(pageID);

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
	page.SignedIn = signedIn;

	tmpl.WriteTemplate(w, "page.hbs", 200, page, null);
}

function BlogPagesHandler(r, w) {
	try {
		var files = fs.readdirSync(BlogDirName);
	} catch(err) {
		console.log("ERROR: failed to read blog directory: ", err);
		tmpl.WriteTemplate(w, "error.hbs", 500, null, errors.TryAgainLaterError);
		return;
	}

	try {
		var pages = [];
		files.forEach(function(file) {
			var contents = fs.readFileSync(BlogDirName+"/"+file, "utf8");
			var page = JSON.parse(contents);
			page.ID = file.slice(0, file.length-PageFileSuffix.length);
			page.Content = undefined;
			pages.push(page);
		});
	} catch(err) {
		console.log("ERROR: failed to read blog file: ", err);
		tmpl.WriteTemplate(w, "error.hbs", 500, null, errors.TryAgainLaterError);
		return;
	}

	w.send(pages);
}
