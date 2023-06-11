"use strict";

module.exports = { SigninTmplHandler, SigninHandler };

const errors = require("./errors.js");
const sessions = require("./sessions.js");
const tmpl = require("./tmpl.js");
const utils = require("./utils.js");

function SigninTmplHandler(r, w) {
	tmpl.WriteTemplate(w, "signin.hbs", 200, null, null);
}

function SigninHandler(r, w) {
	if (!utils.ParamsValidate(r.body, true, "Email", "Password")) {
		tmpl.WriteTemplate(w, "signin.hbs", 400, r.body, errors.ReloadPageError);
		return;
	}

	if (r.body.Email != "admin@express.blog") {
		tmpl.WriteTemplate(w, "signin.hbs", 404, r.body, "user with this email does not exist");
		return;
	}

	if (r.body.Password != "why-not-use-go") {
		tmpl.WriteTemplate(w, "signin.hbs", 409, r.body, "provided password is incorrect");
		return;
	}

	const oneWeek = 7 * 24 * 60 * 60 * 1000;
	var token = sessions.GenerateSessionToken();
	var expiry = new Date(Date.now() + oneWeek);
	sessions.Sessions.set(token, {
		"ID": 1,
		"Expiry": expiry,
	});

	w.cookie('token', token, { expires: expiry, httpOnly: true, sameSite: "strict" });
	w.redirect(303, "/");
}
