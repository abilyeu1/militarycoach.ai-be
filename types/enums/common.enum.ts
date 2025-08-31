export enum StripeStatus {
  ACTIVE = 'active',
  FREE = 'free',
  CANCELED = 'canceled',
  TRIALING = 'trialing',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  USER_HAS_ALREADY_SUBSCRIBED = 'user_has_already_subscribed',
  SUBSCRIPTION_ID_NOT_FOUND = 'subscription_id_not_found',
  DISCOUNT_APPLIED = 'discount_applied',
}

export enum MessageLimit {
  Unlimited = 'Unlimited',
}

export enum Stripe_Price_Intervals {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export const COMMON_HTTP_ERROR_CODES = {
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

export enum UserDocumentKeys {
  SUBSCRIPTION_ID = 'subscriptionID',
  EMAIL = 'email',
  NAME = 'name',
  STRIPE_CUSTOMER_ID = 'stripeCustomerId',
}

export enum ErrorCodes {
  EMAIL_NOT_VERIFIED = 'auth/email-not-verified',
  INVALID_VERIFICATION_CODE = 'auth/invalid-verification-code',
  INVALID_EMAIL = 'auth/invalid-email',
  INVALID_CREDENTIALS = 'auth/invalid-credentials',
  PAYMENT_FAILED = 'payment_failed',
  USER_NOT_FOUND = 'user_not_found',
}

export enum UserCodes {
  USER_FOUND = 'user_found',
}

export enum SupportStatus {
  RESOLVED = 'resolved',
  UNRESOLVED = 'unresolved',
}
