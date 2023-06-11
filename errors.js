"use strict";

const ReloadPageError = "whoops... Something went wrong. Please reload this page and try again";
const TryAgainLaterError = "whoops... Something went wrong. Please try again later";

module.exports = { ReloadPageError, TryAgainLaterError, InvalidRouteHandler };

const tmpl = require("./tmpl.js");

function InvalidRouteHandler(r, w) {
	tmpl.WriteTemplate(w, "error.hbs", 404, null, "page you are looking for does not exist");
}
