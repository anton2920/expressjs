"use strict";

const ReloadPageError = "whoops... Something went wrong. Please reload this page and try again";
const TryAgainLaterError = "whoops... Something went wrong. Please try again later";
const UnauthorizedError = "whoops... It appears you are not authorized to perform this action. Please sign in and try again";

module.exports = { ReloadPageError, TryAgainLaterError, InvalidRouteHandler, UnauthorizedError };

const tmpl = require("./tmpl.js");

function InvalidRouteHandler(r, w) {
	tmpl.WriteTemplate(w, "error.hbs", 404, null, "page you are looking for does not exist");
}
