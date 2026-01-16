import { Document } from 'mongoose';
import { StripeStatus } from 'src/types/enums/common.enum';
import { SHEER_ID_STATUS, UserTypes } from 'src/types/enums/user.enum';
interface IUser extends Document {
    email: string;
    type: UserTypes;
    profilePicture: string;
    password: string;
    createdAt: Date;
    sheerIdApprovalStatus: SHEER_ID_STATUS | null;
    fullName: string;
    age: number;
    languages: string[] | [];
    branchOfService: string | null;
    militaryRank: string | null;
    workExperience: {
        _id: string;
        careerField: string;
        jobTitle: string;
        skillsLeveragedInCareerField: string[];
    }[];
    industryOfInterest?: string;
    jobPositionOfInterest?: string;
    jobPositionLevel?: string;
    JobLocation?: string;
    education: {
        _id: string;
        levelOfEducation: string;
        nameOfInstitution: string;
        degreeAndFieldOfStudy: string;
    }[];
    certificates?: {
        _id: string;
        name: string;
    }[];
    stripeCustomerId: string;
    stripeSubscriptionId: string | null;
    stripeSubscriptionStatus: StripeStatus;
    freeMessagesLimitExhausted: boolean;
    messagesConsumed: number;
    freeUserHoursLimit: number;
    messagesLimit: number;
    profileStatus: 'incomplete' | 'complete' | null;
    resumeLink: string | null;
    isAdmin: boolean;
}
export default IUser;
