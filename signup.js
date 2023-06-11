"use strict";

module.exports = { SignupTmplHandler };

const tmpl = require("./tmpl.js");

function SignupTmplHandler(r, w) {
	tmpl.WriteTemplate(w, "signup.hbs", 200, null, null);
}
