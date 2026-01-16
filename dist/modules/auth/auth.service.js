"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_enum_1 = require("../../types/enums/user.enum");
const user_schema_1 = require("../../schemas/users/user.schema");
const otp_schema_1 = require("../../schemas/otp/otp.schema");
const bycrpt_1 = require("../../utils/bycrpt");
const stripe_service_1 = require("../stripe/stripe.service");
const moment = require("moment");
const getHours_1 = require("../../utils/getHours");
const otpGenerator_1 = require("../../utils/OTP/otpGenerator");
const emailConstants_1 = require("../../utils/Templates/emailConstants");
const sendEmail_1 = require("../../utils/Email/sendEmail");
let AuthService = class AuthService {
    constructor(jwtService, stripeService, userModel, OtpModel) {
        this.jwtService = jwtService;
        this.stripeService = stripeService;
        this.userModel = userModel;
        this.OtpModel = OtpModel;
    }
    async login(user) {
        try {
            const userExist = await this.userModel.findOne({ email: user.email });
            if (!userExist) {
                throw new common_1.HttpException('User does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            const isPasswordValid = await (0, bycrpt_1.comparePassword)(user.password, userExist.password);
            if (!isPasswordValid) {
                throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            const hoursConsumed = (0, getHours_1.getHoursLeft)(userExist.createdAt);
            if (Number(hoursConsumed) >= userExist.freeUserHoursLimit) {
                await this.userModel.findByIdAndUpdate(userExist._id, {
                    freeMessagesLimitExhausted: true,
                });
            }
            const areFieldsEmpty = !userExist.industryOfInterest ||
                !userExist.jobPositionOfInterest ||
                !userExist.jobPositionLevel ||
                !userExist.education ||
                !userExist.certificates ||
                userExist.education.length === 0 ||
                userExist.certificates.length === 0;
            const updateData = {
                profileStatus: areFieldsEmpty ? 'incomplete' : 'complete',
            };
            const updatedUser = await this.userModel.findOneAndUpdate({ email: user.email }, updateData, { new: true, upsert: true });
            const authPayload = {
                email: updatedUser.email,
                id: updatedUser._id.toString(),
                type: updatedUser.type,
                role: user_enum_1.AUTH_ROLES.USER,
            };
            const token = this.jwtService.sign(authPayload);
            return {
                user: updatedUser,
                token,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async register(userDocument) {
        try {
            const isEmailExist = await this.userModel.findOne({
                email: userDocument.email,
            });
            if (isEmailExist) {
                throw new common_1.HttpException('User Already Exist', common_1.HttpStatus.CONFLICT);
            }
            const saltedPassword = await (0, bycrpt_1.hashPassword)(userDocument.password);
            const newUser = new this.userModel(Object.assign(Object.assign({}, userDocument), { password: saltedPassword, createdAt: new Date(), stripeSubscriptionId: null, stripeSubscriptionStatus: 'free', freeUserHoursLimit: 72, messagesLimit: 12, messagesConsumed: 0, freeMessagesLimitExhausted: false, profileStatus: null }));
            const savedUser = await newUser.save();
            const authPayload = {
                email: savedUser.email,
                id: savedUser._id.toString(),
                type: savedUser.type,
                role: user_enum_1.AUTH_ROLES.USER,
            };
            if (!savedUser)
                throw new common_1.HttpException('User not saved', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            const token = await this.jwtService.sign(authPayload);
            if (!token)
                throw new common_1.HttpException('Token not generated', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            const user = await this.userModel.findByIdAndUpdate(savedUser._id, {
                stripeCustomerId: null,
            }, { new: true, upsert: true });
            return {
                user,
                token,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async requestResetPassword(resetPasswordDTO) {
        try {
            let otpCode;
            let currTime = new Date();
            let expiryTime = moment().add(15, 'minutes').format();
            const isUserExist = await this.userModel.findOne({
                email: resetPasswordDTO.email,
            });
            if (!isUserExist) {
                throw new common_1.HttpException('User not found with this email.', common_1.HttpStatus.NOT_FOUND);
            }
            const otpAlreadyExist = await this.OtpModel.findOne({
                email: resetPasswordDTO.email,
            });
            if (otpAlreadyExist) {
                if (otpAlreadyExist.expiry > currTime) {
                    otpCode = otpAlreadyExist.code;
                }
                else {
                    otpCode = (0, otpGenerator_1.generateOtpCode)(6);
                }
            }
            else {
                otpCode = (0, otpGenerator_1.generateOtpCode)(6);
            }
            var mailOptions = {
                from: emailConstants_1.vacuaEmail,
                to: isUserExist.email,
                subject: 'OTP CHANGED',
                html: `<h1>Your code is ${otpCode}</h1>`,
            };
            sendEmail_1.transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log('Error transporter email', error);
                }
                else {
                    const insertForgotPassData = {
                        email: isUserExist.email,
                        code: otpCode,
                        expiry: expiryTime,
                    };
                    if (otpAlreadyExist) {
                        const getInsertedRes = await this.OtpModel.findByIdAndUpdate(otpAlreadyExist._id, insertForgotPassData);
                    }
                    else {
                        const insertedRes = new this.OtpModel(insertForgotPassData);
                        const getInsertedRes = await insertedRes.save();
                    }
                }
            });
            return {
                message: 'Otp has been sent to your email successfully!',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPass(newPass) {
        try {
            let currTime = new Date();
            const otp = await this.OtpModel.findOne({
                code: newPass.code,
            });
            if (!otp) {
                throw new common_1.HttpException('Invalid OTP code', common_1.HttpStatus.NOT_FOUND);
            }
            if (currTime > otp.expiry) {
                await this.OtpModel.deleteOne({ _id: otp._id });
                throw new common_1.HttpException('OTP code expired. Please generate new!', common_1.HttpStatus.NOT_FOUND);
            }
            const user = await this.userModel.findOne({
                email: newPass.email,
            });
            if (!user) {
                throw new common_1.HttpException('User with this email not found', common_1.HttpStatus.NOT_FOUND);
            }
            const isSameNewPass = await (0, bycrpt_1.comparePassword)(newPass.password, user.password);
            if (isSameNewPass) {
                throw new common_1.HttpException('Cannot set this password', common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const decodedPass = await (0, bycrpt_1.hashPassword)(newPass.password);
            user.password = decodedPass;
            const updatedUser = new this.userModel(user);
            await updatedUser.save();
            await this.OtpModel.deleteOne({
                email: newPass.email,
            });
            return {
                message: 'Password has been changed successfully. Redirecting to Login Page',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        stripe_service_1.StripeService,
        mongoose_2.Model,
        mongoose_2.Model])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map