"use strict";

const blog = require("./blog.js");
const index = require("./index.js");
const sessions = require("./sessions.js");
const signin = require("./signin.js");
const signout = require("./signout.js");
const signup = require("./signup.js");
const tmpl = require("./tmpl.js");

const express = require("express");
const cookieParser = require("cookie-parser");

const App = express();
const Port = 8080;
const APIPrefix = "/api";

function main() {
	tmpl.InitTemplates();

	App.use(express.urlencoded({ extended: true }));
	App.use(cookieParser());

	App.get("/", index.IndexTmplHandler);
	App.get("/create", blog.BlogCreateTmplHandler);
	App.get("/page_:PageNumber([0-9]+)", blog.BlogDisplayTmplHandler);
	App.get("/signin", signin.SigninTmplHandler);
	App.get("/signup", signup.SignupTmplHandler);

	App.post(APIPrefix+"/create", blog.BlogCreateHandler);
	App.post(APIPrefix+"/signin", signin.SigninHandler);
	App.get(APIPrefix+"/signout", signout.SignoutHandler);
	
	App.listen(Port, function() {
		console.log(`Listening on port ${Port}`);
	});
}

blog.init();
main();
