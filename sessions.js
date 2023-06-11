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
	const session = Sessions.get(token)
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
	var bytes = Date.now();
	bytes += crypto.randomBytes(64);
	return Buffer.from(bytes).toString("base64");
}
