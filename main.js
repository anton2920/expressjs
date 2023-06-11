"use strict";

const blog = require("./blog.js");
const blogCreate = require("./blog_create.js");
const blogEdit = require("./blog_edit.js");
const errors = require("./errors.js");
const index = require("./index.js");
const sessions = require("./sessions.js");
const signin = require("./signin.js");
const signout = require("./signout.js");
const signup = require("./signup.js");
const tmpl = require("./tmpl.js");

const cookieParser = require("cookie-parser");
const express = require("express");

const App = express();
const Port = 8080;
const APIPrefix = "/api";

function main() {
	tmpl.InitTemplates();

	App.use(express.urlencoded({ extended: true }));
	App.use(cookieParser());

	App.get("/", index.IndexTmplHandler);
	App.get("/create", blogCreate.BlogCreateTmplHandler);
	App.post("/edit", blogEdit.BlogEditTmplHandler);
	App.get("/page_:PageID([0-9]+)", blog.BlogDisplayTmplHandler);
	App.get("/signin", signin.SigninTmplHandler);
	App.get("/signup", signup.SignupTmplHandler);

	App.post(APIPrefix+"/create", blogCreate.BlogCreateHandler);
	App.post(APIPrefix+"/edit", blogEdit.BlogEditHandler);
	App.post(APIPrefix+"/signin", signin.SigninHandler);
	App.get(APIPrefix+"/signout", signout.SignoutHandler);

	App.get("*", errors.InvalidRouteHandler);
	
	App.listen(Port, function() {
		console.log(`Listening on port ${Port}`);
	});
}

blog.init();
sessions.init();
main();
