"use strict";

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
const Sessions = new Map();

module.exports = { Sessions, GetSessionFromToken, GenerateSessionToken };

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
