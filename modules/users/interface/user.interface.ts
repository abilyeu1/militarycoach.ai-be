import { Document } from 'mongoose';
import { StripeStatus } from 'src/types/enums/common.enum';
import { SHEER_ID_STATUS, UserTypes } from 'src/types/enums/user.enum';

interface IUser extends Document {
  // ======================================= User Basic Details =======================================

  email: string;
  type: UserTypes;
  profilePicture: string;
  password: string;
  createdAt: Date;
  sheerIdApprovalStatus: SHEER_ID_STATUS | null;

  // ======================================= Personal Details =======================================

  fullName: string;
  age: number;
  languages: string[] | [];
  branchOfService: string | null;
  militaryRank: string | null;

  // ======================================= Work Experience =======================================

  workExperience: {
    _id: string;
    careerField: string;
    jobTitle: string;
    skillsLeveragedInCareerField: string[];
  }[];

  // ======================================= Career Aspiration =======================================

  industryOfInterest?: string;
  jobPositionOfInterest?: string;
  jobPositionLevel?: string;
  JobLocation?: string;

  // ======================================= Education =======================================

  education: {
    _id: string;
    levelOfEducation: string;
    nameOfInstitution: string;
    degreeAndFieldOfStudy: string;
  }[];

  // ======================================= Certificates =======================================

  certificates?: {
    _id: string;
    name: string;
  }[];

  // ======================================= Stripe =======================================

  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripeSubscriptionStatus: StripeStatus;

  // ======================================= User Profile Status Information Keys =======================================

  freeMessagesLimitExhausted: boolean;
  messagesConsumed: number;
  freeUserHoursLimit: number;
  messagesLimit: number;
  profileStatus: 'incomplete' | 'complete' | null;
  resumeLink: string | null;
  isAdmin: boolean;
}

export default IUser;
