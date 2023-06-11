"use strict";

module.exports = { init, Sessions, GetSessionFromToken, GenerateSessionToken };

const crypto = require("crypto");

/* NOTE(anton2920):
 * type SessionInfo struct {
 * 	ID int
 * 	Expiry time.Time
 * }
 */

/* NOTE(anton2920):
 * map[string]SessionInfo
 * I also hope that there won't be any race conditions. */
var Sessions; 

function init() {
	Sessions = new Map()
	module.exports.Sessions = Sessions;
}

function GetSessionFromToken(token) {
	var session = Sessions.get(token)
	if (session == undefined) {
		return undefined;
	}

	if (session.Expiry < Date.now()) {
		Sessions.delete(token);
		return undefined;
	}

	return session;
}

function GenerateSessionToken() {
	return Buffer.from(Date.now() + crypto.randomBytes(56)).toString("base64");
}
