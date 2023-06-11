"use strict";

const index = require("./index.js");
const signin = require("./signin.js");
const signup = require("./signup.js");
const tmpl = require("./tmpl.js");

const express = require("express");
const cookieParser = require("cookie-parser");

const App = express();
const Port = 8080;
const APIPrefix = "/api";

function main() {
	App.use(express.urlencoded({ extended: true }));
	App.use(cookieParser());

	App.get("/", index.IndexTmplHandler);
	App.get("/signin", signin.SigninTmplHandler);
	App.get("/signup", signup.SignupTmplHandler);
	
	App.post(APIPrefix+"/signin", signin.SigninHandler);
	
	App.listen(Port, function() {
		tmpl.InitTemplates();
		console.log(`Listening on port ${Port}`);
	});
}

main();
