"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportStatus = exports.UserCodes = exports.ErrorCodes = exports.UserDocumentKeys = exports.COMMON_HTTP_ERROR_CODES = exports.Stripe_Price_Intervals = exports.MessageLimit = exports.StripeStatus = void 0;
var StripeStatus;
(function (StripeStatus) {
    StripeStatus["ACTIVE"] = "active";
    StripeStatus["FREE"] = "free";
    StripeStatus["CANCELED"] = "canceled";
    StripeStatus["TRIALING"] = "trialing";
    StripeStatus["INCOMPLETE"] = "incomplete";
    StripeStatus["INCOMPLETE_EXPIRED"] = "incomplete_expired";
    StripeStatus["PAST_DUE"] = "past_due";
    StripeStatus["UNPAID"] = "unpaid";
    StripeStatus["USER_HAS_ALREADY_SUBSCRIBED"] = "user_has_already_subscribed";
    StripeStatus["SUBSCRIPTION_ID_NOT_FOUND"] = "subscription_id_not_found";
    StripeStatus["DISCOUNT_APPLIED"] = "discount_applied";
})(StripeStatus = exports.StripeStatus || (exports.StripeStatus = {}));
var MessageLimit;
(function (MessageLimit) {
    MessageLimit["Unlimited"] = "Unlimited";
})(MessageLimit = exports.MessageLimit || (exports.MessageLimit = {}));
var Stripe_Price_Intervals;
(function (Stripe_Price_Intervals) {
    Stripe_Price_Intervals["DAY"] = "day";
    Stripe_Price_Intervals["WEEK"] = "week";
    Stripe_Price_Intervals["MONTH"] = "month";
    Stripe_Price_Intervals["YEAR"] = "year";
})(Stripe_Price_Intervals = exports.Stripe_Price_Intervals || (exports.Stripe_Price_Intervals = {}));
exports.COMMON_HTTP_ERROR_CODES = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    413: 'Entity Too Large',
    405: 'Method Not Allowed',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
};
var UserDocumentKeys;
(function (UserDocumentKeys) {
    UserDocumentKeys["SUBSCRIPTION_ID"] = "subscriptionID";
    UserDocumentKeys["EMAIL"] = "email";
    UserDocumentKeys["NAME"] = "name";
    UserDocumentKeys["STRIPE_CUSTOMER_ID"] = "stripeCustomerId";
})(UserDocumentKeys = exports.UserDocumentKeys || (exports.UserDocumentKeys = {}));
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["EMAIL_NOT_VERIFIED"] = "auth/email-not-verified";
    ErrorCodes["INVALID_VERIFICATION_CODE"] = "auth/invalid-verification-code";
    ErrorCodes["INVALID_EMAIL"] = "auth/invalid-email";
    ErrorCodes["INVALID_CREDENTIALS"] = "auth/invalid-credentials";
    ErrorCodes["PAYMENT_FAILED"] = "payment_failed";
    ErrorCodes["USER_NOT_FOUND"] = "user_not_found";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
var UserCodes;
(function (UserCodes) {
    UserCodes["USER_FOUND"] = "user_found";
})(UserCodes = exports.UserCodes || (exports.UserCodes = {}));
var SupportStatus;
(function (SupportStatus) {
    SupportStatus["RESOLVED"] = "resolved";
    SupportStatus["UNRESOLVED"] = "unresolved";
})(SupportStatus = exports.SupportStatus || (exports.SupportStatus = {}));
//# sourceMappingURL=common.enum.js.map