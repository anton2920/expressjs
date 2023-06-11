"use strict";

module.exports = { IsStringLengthInRange, ParamsValidate };

function IsStringLengthInRange(s, min, max) {
	return ((s.length >= min) && (s.length <= max));
}

function ParamsValidate(form, disallowUnknown, ...fields) {
	if (disallowUnknown && (Object.keys(form).length > fields.length)) {
		return false;
	}

	for (const field of fields) {
		if (form[field] == undefined) {
			return false;
		}
	}

	return true;
}
