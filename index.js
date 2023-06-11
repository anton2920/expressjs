"use strict";

module.exports = { IndexTmplHandler };

const sessions = require("./sessions.js");
const tmpl = require("./tmpl.js");

function IndexTmplHandler(r, w) {
	var signedIn = false;

	const token = r.cookies["token"];
	if (token != undefined) {
		const session = sessions.GetSessionFromToken(token);
		if (session != undefined) {
			signedIn = true;
		}
	}

	tmpl.WriteTemplate(w, "index.hbs", 200, { signedIn }, null);
}
