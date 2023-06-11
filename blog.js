"use strict";

module.exports = { init, PageFileIDLast, GetPageFileName, BlogDisplayTmplHandler };

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

function GetPageFileName(pageID) {
	var pageID = (PageFileIDPad + pageID).slice(-PageFileIDPad.length);
	return BlogDirName + "/" + PageFilePrefix + pageID + PageFileSuffix;
}

function BlogDisplayTmplHandler(r, w) {
	var pageID = r.params["PageID"]
	var filename = GetPageFileName(pageID);

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

	tmpl.WriteTemplate(w, "page.hbs", 200, page, null);
}
