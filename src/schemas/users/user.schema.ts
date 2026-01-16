// Nest JS imports
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Mongoose imports
import { HydratedDocument } from 'mongoose';

// Class Validator imports
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
} from 'class-validator';

// Type & Schema imports
import { StripeStatus } from 'src/types/enums/common.enum';
import { SHEER_ID_STATUS, UserTypes } from 'src/types/enums/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  // ===================================== Basic Details =====================================

  @Prop({ required: true })
  @IsEmail()
  email: string;

  @IsDate()
  @Prop({ default: Date.now })
  createdAt: Date;

  @IsString()
  @Prop({ required: false })
  profilePicture: string;

  @IsString()
  @Prop({ required: true })
  type: UserTypes;

  @IsString()
  @Prop({ required: false })
  sheerIdApprovalStatus: SHEER_ID_STATUS | null;

  @IsString()
  @Prop({ required: true })
  password: string;

  // ===================================== Personal Details =====================================

  @IsString()
  @Prop({ required: true })
  fullName: string;

  @IsNumber()
  @Prop({ required: false })
  age: number;

  @IsString({ each: true })
  @Prop({ required: true })
  languages: string[];

  @IsString()
  @Prop({ required: true })
  branchOfService: string;

  @IsString()
  @Prop({ required: true })
  militaryRank: string;

  // ===================================== Work Experience =====================================

  @Prop({ required: true })
  workExperience: {
    // id
    _id: string;
    careerField: string;
    jobTitle: string;
    skillsLeveragedInCareerField: string[];
  }[];

  // ===================================== Career Aspiration =====================================

  @IsString()
  @Prop({ required: false, default: '' })
  industryOfInterest: string;

  @IsString()
  @Prop({ required: false, default: '' })
  jobPositionOfInterest: string;

  @IsString()
  @Prop({ required: false, default: '' })
  jobPositionLevel: string;

  @IsString()
  @Prop({ required: false, default: '' })
  JobLocation: string;

  // ===================================== Education =====================================

  @Prop({ required: false })
  education: {
    _id: string;
    levelOfEducation: string;
    nameOfInstitution: string;
    degreeAndFieldOfStudy: string;
  }[];

  // ===================================== Certificates =====================================

  @Prop({ required: false })
  certificates: {
    _id: string;
    name: string;
  }[];

  // ===================================== Stripe =====================================

  @Prop({ required: false })
  @IsString()
  stripeCustomerId: string;

  @IsString()
  @Prop({ required: false })
  stripeSubscriptionId: string;

  @IsString()
  @Prop({ required: false, default: null })
  stripePriceId: string;

  @IsString()
  @Prop({ required: false })
  stripeSubscriptionStatus: StripeStatus;

  // ===================================== User Profile Status Information Keys =====================================

  @IsBoolean()
  @Prop({ required: true })
  isAdmin: boolean;

  @Prop({ required: false })
  @IsBoolean()
  freeMessagesLimitExhausted: boolean;

  @Prop({ required: false })
  @IsNumber()
  messagesConsumed: number;

  @Prop({ required: false })
  @IsNumber()
  messagesLimit: number;

  @Prop({ required: false })
  @IsNumber()
  freeUserHoursLimit: number;

  @Prop({ required: false })
  @IsString()
  profileStatus: 'complete' | 'incomplete' | null;

  @Prop({ required: false })
  @IsString()
  resumeLink: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
