export declare enum StripeStatus {
    ACTIVE = "active",
    FREE = "free",
    CANCELED = "canceled",
    TRIALING = "trialing",
    INCOMPLETE = "incomplete",
    INCOMPLETE_EXPIRED = "incomplete_expired",
    PAST_DUE = "past_due",
    UNPAID = "unpaid",
    USER_HAS_ALREADY_SUBSCRIBED = "user_has_already_subscribed",
    SUBSCRIPTION_ID_NOT_FOUND = "subscription_id_not_found",
    DISCOUNT_APPLIED = "discount_applied"
}
export declare enum MessageLimit {
    Unlimited = "Unlimited"
}
export declare enum Stripe_Price_Intervals {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}
export declare const COMMON_HTTP_ERROR_CODES: {
    400: string;
    401: string;
    403: string;
    404: string;
    413: string;
    405: string;
    500: string;
    502: string;
    503: string;
    504: string;
};
export declare enum UserDocumentKeys {
    SUBSCRIPTION_ID = "subscriptionID",
    EMAIL = "email",
    NAME = "name",
    STRIPE_CUSTOMER_ID = "stripeCustomerId"
}
export declare enum ErrorCodes {
    EMAIL_NOT_VERIFIED = "auth/email-not-verified",
    INVALID_VERIFICATION_CODE = "auth/invalid-verification-code",
    INVALID_EMAIL = "auth/invalid-email",
    INVALID_CREDENTIALS = "auth/invalid-credentials",
    PAYMENT_FAILED = "payment_failed",
    USER_NOT_FOUND = "user_not_found"
}
export declare enum UserCodes {
    USER_FOUND = "user_found"
}
export declare enum SupportStatus {
    RESOLVED = "resolved",
    UNRESOLVED = "unresolved"
}
