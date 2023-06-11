"use strict";

module.exports = { SignoutHandler };

const errors = require("./errors.js");
const sessions = require("./sessions.js");
const tmpl = require("./tmpl.js");

function SignoutHandler(r, w) {
	var token = r.cookies["token"];
	if (token == undefined) {
		tmpl.WriteTemplate(w, "error.hbs", 401, null, errors.UnauthorizedError);
		return;
	}

	var session = sessions.GetSessionFromToken(token);
	if (session == undefined) {
		tmpl.WriteTemplate(w, "error.hbs", 401, null, errors.UnauthorizedError);
		return;
	}

	w.clearCookie("token");
	w.redirect(303, "/");
}
