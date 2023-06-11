"use strict";

module.exports = { init, PageFileIDLast, GetPageFileTitle, BlogDisplayTmplHandler };

const tmpl = require("./tmpl.js");

const fs = require("fs");

const BlogDirName = "./blog";
const PageFilePrefix = "page_";
const PageFileIDPad  = "00000";
const PageFileSuffix = ".json";

var PageFileIDLast;

function init() {
	PageFileIDLast = 0;

	fs.mkdir(BlogDirName, { recursive: true }, function(err) {
		if (err != null) {
			console.log("ERROR: failed to create blog directory: ", err);
			process.exit(1);
		}
	});
	fs.readdir(BlogDirName, function(err, files) {
		if (err != null) {
			console.log("ERROR: failed to read blog directory: ", err);
			process.exit(1);
		}

		files.forEach(function(file) {
			++PageFileIDLast;
		});	
	});

	module.exports.PageFileIDLast = PageFileIDLast;
}

function GetPageFileTitle() {
	PageFileIDLast = module.exports.PageFileIDLast;
	var pageID = (PageFileIDPad + PageFileIDLast).slice(-PageFileIDPad.length);
	return BlogDirName + "/" + PageFilePrefix + pageID + PageFileSuffix;
}

function BlogDisplayTmplHandler(r, w) {
	var filename = BlogDirName + "/" + PageFilePrefix + r.params["PageNumber"] + PageFileSuffix;
	
	try {
		var pageJSON = fs.readFileSync(filename, "utf-8");
	} catch(e) {
		if (e.code == "ENOENT") {
			tmpl.WriteTemplate(w, "error.hbs", 400, null, "blog page does not exist");
		} else {
			tmpl.WriteTemplate(w, "error.hbs", 500, null, errors.TryAgainLaterError);
		}
		return;
	}
	var page = JSON.parse(pageJSON);

	tmpl.WriteTemplate(w, "page.hbs", 200, page, null);
}
