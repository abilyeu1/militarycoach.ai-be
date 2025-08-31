export enum UserTypes {
  CIVILIAN = 'civilian',
  MILITARY = 'military',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  DELETE = 'delete',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum SHEER_ID_STATUS {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum FOR_ARRAY {
  EDUCATION = 'education',
  CERTIFICATES = 'certificates',
  WORK_EXPERIENCE = 'workExperience'
}

export enum AUTH_ROLES {
  ADMIN = 'admin',
  USER = 'user'
}

export enum STRIPE_SUBSCRIPTION_STATUS {
  ACTIVE = "active",
  FREE = "free",
  PAST_DUE = "past_due",
  UNPAID = "unpaid",
  CANCELED = "canceled",
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  TRAILING = "trialing",
  PAUSED = "paused",
  ALL = "all",
  ENDED = "ended"
}
