"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_SUBSCRIPTION_STATUS = exports.AUTH_ROLES = exports.FOR_ARRAY = exports.SHEER_ID_STATUS = exports.Gender = exports.UserStatus = exports.UserTypes = void 0;
var UserTypes;
(function (UserTypes) {
    UserTypes["CIVILIAN"] = "civilian";
    UserTypes["MILITARY"] = "military";
})(UserTypes = exports.UserTypes || (exports.UserTypes = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["PENDING"] = "pending";
    UserStatus["DELETE"] = "delete";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender = exports.Gender || (exports.Gender = {}));
var SHEER_ID_STATUS;
(function (SHEER_ID_STATUS) {
    SHEER_ID_STATUS["APPROVED"] = "approved";
    SHEER_ID_STATUS["PENDING"] = "pending";
    SHEER_ID_STATUS["REJECTED"] = "rejected";
})(SHEER_ID_STATUS = exports.SHEER_ID_STATUS || (exports.SHEER_ID_STATUS = {}));
var FOR_ARRAY;
(function (FOR_ARRAY) {
    FOR_ARRAY["EDUCATION"] = "education";
    FOR_ARRAY["CERTIFICATES"] = "certificates";
    FOR_ARRAY["WORK_EXPERIENCE"] = "workExperience";
})(FOR_ARRAY = exports.FOR_ARRAY || (exports.FOR_ARRAY = {}));
var AUTH_ROLES;
(function (AUTH_ROLES) {
    AUTH_ROLES["ADMIN"] = "admin";
    AUTH_ROLES["USER"] = "user";
})(AUTH_ROLES = exports.AUTH_ROLES || (exports.AUTH_ROLES = {}));
var STRIPE_SUBSCRIPTION_STATUS;
(function (STRIPE_SUBSCRIPTION_STATUS) {
    STRIPE_SUBSCRIPTION_STATUS["ACTIVE"] = "active";
    STRIPE_SUBSCRIPTION_STATUS["FREE"] = "free";
    STRIPE_SUBSCRIPTION_STATUS["PAST_DUE"] = "past_due";
    STRIPE_SUBSCRIPTION_STATUS["UNPAID"] = "unpaid";
    STRIPE_SUBSCRIPTION_STATUS["CANCELED"] = "canceled";
    STRIPE_SUBSCRIPTION_STATUS["INCOMPLETE"] = "incomplete";
    STRIPE_SUBSCRIPTION_STATUS["INCOMPLETE_EXPIRED"] = "incomplete_expired";
    STRIPE_SUBSCRIPTION_STATUS["TRAILING"] = "trialing";
    STRIPE_SUBSCRIPTION_STATUS["PAUSED"] = "paused";
    STRIPE_SUBSCRIPTION_STATUS["ALL"] = "all";
    STRIPE_SUBSCRIPTION_STATUS["ENDED"] = "ended";
})(STRIPE_SUBSCRIPTION_STATUS = exports.STRIPE_SUBSCRIPTION_STATUS || (exports.STRIPE_SUBSCRIPTION_STATUS = {}));
//# sourceMappingURL=user.enum.js.map