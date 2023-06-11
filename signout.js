"use strict";

module.exports = { SignoutHandler };

const sessions = require("./sessions.js");

function SignoutHandler(r, w) {
	var token = r.cookies["token"];
	if (token == undefined) {
		w.status(401);
	}

	var session = sessions.GetSessionFromToken(token);
	if (session == undefined) {
		w.status(401);
	}

	w.clearCookie("token");
	w.redirect(303, "/");
}
