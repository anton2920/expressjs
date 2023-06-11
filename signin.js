"use strict";

module.exports = { SigninTmplHandler, SigninHandler };

const sessions = require("./sessions.js");
const tmpl = require("./tmpl.js");

function SigninTmplHandler(r, w) {
	tmpl.WriteTemplate(w, "signin.hbs", 200, null, null);
}

function SigninHandler(r, w) {
	/* TODO(anton2920): store users in DB. */
	if (r.body.Email != "admin@express.blog") {
		tmpl.WriteTemplate(w, "signin.hbs", 404, r.body, "user with this email doesn't exist");
	}

	/* TODO(anton2920): use something like 'bcrypt.CompareHashAndPassword()'
	 * instead of strings comparison.
	 */
	if (r.body.Password != "why-not-use-go") {
		tmpl.WriteTemplate(w, "signin.hbs", 409, r.body, "provided password is incorrect");
	}

	const oneWeek = 7 * 24 * 60 * 60 * 1000;
	const token = sessions.GenerateSessionToken();
	const expiry = new Date(Date.now() + oneWeek);
	sessions.Sessions.set(token, {
		"ID": 1,
		"Expiry": expiry,
	});

	w.cookie('token', token, { expires: expiry, httpOnly: true, sameSite: "strict" });
	w.redirect(303, "/");
}
