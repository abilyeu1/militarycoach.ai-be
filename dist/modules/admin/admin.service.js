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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const otp_schema_1 = require("../../schemas/otp/otp.schema");
const support_schema_1 = require("../../schemas/support/support.schema");
const tools_schema_1 = require("../../schemas/tools/tools.schema");
const user_schema_1 = require("../../schemas/users/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const stripe_service_1 = require("../stripe/stripe.service");
const common_enum_1 = require("../../types/enums/common.enum");
const user_enum_1 = require("../../types/enums/user.enum");
const moment = require("moment");
const sendEmail_1 = require("../../utils/Email/sendEmail");
const otpGenerator_1 = require("../../utils/OTP/otpGenerator");
const emailConstants_1 = require("../../utils/Templates/emailConstants");
const bycrpt_1 = require("../../utils/bycrpt");
let AdminService = class AdminService {
    constructor(jwtService, stripeService, userModel, OtpModel, ToolModel, supportModel) {
        this.jwtService = jwtService;
        this.stripeService = stripeService;
        this.userModel = userModel;
        this.OtpModel = OtpModel;
        this.ToolModel = ToolModel;
        this.supportModel = supportModel;
    }
    async adminLogin(admin) {
        try {
            const adminExist = await this.userModel.findOne({
                email: admin.email,
                isAdmin: true,
            });
            if (!adminExist) {
                throw new common_1.HttpException('admin does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            const isPasswordValid = await (0, bycrpt_1.comparePassword)(admin.password, adminExist.password);
            if (!isPasswordValid) {
                throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            const authPayload = {
                email: adminExist.email,
                id: adminExist._id.toString(),
                type: adminExist.type,
                role: user_enum_1.AUTH_ROLES.ADMIN,
            };
            const token = this.jwtService.sign(authPayload);
            return {
                message: 'Admin Login successfully',
                admin: adminExist,
                token,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async adminRequestResetPassword(resetPasswordDTO) {
        try {
            let otpCode;
            let currTime = new Date();
            console.log('currTime', currTime);
            let expiryTime = moment().add(15, 'minutes').format();
            console.log('expiryTime', expiryTime);
            const isAdminExist = await this.userModel.findOne({
                email: resetPasswordDTO.email,
                isAdmin: true,
            });
            if (!isAdminExist) {
                throw new common_1.HttpException('Admin not found with this email.', common_1.HttpStatus.NOT_FOUND);
            }
            const otpAlreadyExist = await this.OtpModel.findOne({
                email: resetPasswordDTO.email,
            });
            if (otpAlreadyExist) {
                if (otpAlreadyExist.expiry > currTime) {
                    otpCode = otpAlreadyExist.code;
                }
                else {
                    otpCode = (0, otpGenerator_1.generateOtpCode)(4);
                }
            }
            else {
                otpCode = (0, otpGenerator_1.generateOtpCode)(4);
            }
            var mailOptions = {
                from: emailConstants_1.vacuaEmail,
                to: isAdminExist.email,
                subject: 'OTP CHANGED',
                html: `<h1>Your code is ${otpCode}</h1>`,
            };
            sendEmail_1.transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log('Error transporter email', error);
                }
                else {
                    const insertForgotPassData = {
                        email: isAdminExist.email,
                        code: otpCode,
                        expiry: expiryTime,
                    };
                    const insertedRes = new this.OtpModel(insertForgotPassData);
                    const getInsertedRes = await insertedRes.save();
                    console.log(getInsertedRes);
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
    async adminVerifyOtp(otpCode) {
        try {
            let currTime = new Date();
            const isCodeVerified = await this.OtpModel.findOne({
                code: otpCode.code,
            });
            if (!isCodeVerified) {
                throw new common_1.HttpException('Invalid OTP code', common_1.HttpStatus.NOT_FOUND);
            }
            if (currTime > isCodeVerified.expiry) {
                await this.OtpModel.deleteOne({ _id: isCodeVerified._id });
                throw new common_1.HttpException('OTP code expired. Please generate new!', common_1.HttpStatus.NOT_FOUND);
            }
            const token = this.jwtService.sign({
                email: isCodeVerified.email,
            });
            return {
                token,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async adminResetPass(newPass) {
        try {
            const decodedToken = await this.jwtService.verifyAsync(newPass.token);
            const otp = await this.OtpModel.findOne({
                email: decodedToken.email,
            });
            if (!otp) {
                throw new common_1.HttpException('Bad Request', common_1.HttpStatus.NOT_FOUND);
            }
            const admin = await this.userModel.findOne({
                email: decodedToken.email,
                isAdmin: true,
            });
            const isSameNewPass = await (0, bycrpt_1.comparePassword)(newPass.password, admin.password);
            if (isSameNewPass) {
                throw new common_1.HttpException('Cannot set this password', common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const decodedPass = await (0, bycrpt_1.hashPassword)(newPass.password);
            admin.password = decodedPass;
            const updatedAdmin = new this.userModel(admin);
            await updatedAdmin.save();
            await this.OtpModel.deleteOne({ email: decodedToken.email });
            return {
                message: 'Password has been changed successfully. Redirecting to Login Page',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addUser(userDocument) {
        try {
            const isEmailExist = await this.userModel.findOne({
                email: userDocument.email,
                isAdmin: false,
            });
            if (isEmailExist) {
                throw new common_1.HttpException('User Already Exist', common_1.HttpStatus.CONFLICT);
            }
            const saltedPassword = await (0, bycrpt_1.hashPassword)(userDocument.password);
            const newUser = new this.userModel(Object.assign(Object.assign({}, userDocument), { password: saltedPassword, createdAt: new Date(), stripeSubscriptionId: null, stripeSubscriptionStatus: 'free', freeUserHoursLimit: 72, messagesLimit: 1, messagesConsumed: 0, freeMessagesLimitExhausted: false, profileStatus: null }));
            const savedUser = await newUser.save();
            const stripeCustomer = await this.stripeService.createCustomer({
                email: savedUser.email.toLowerCase(),
                name: `${savedUser.fullName}`,
            });
            if (!stripeCustomer)
                throw new common_1.HttpException('User not updated', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            const user = await this.userModel.findByIdAndUpdate(savedUser._id, {
                stripeCustomerId: stripeCustomer.id,
            }, { new: true, upsert: true });
            return {
                user,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllUsers(limit, page, email, sub) {
        try {
            const pageNo = page || 1;
            const lm = limit || 10;
            let query = {
                isAdmin: false,
            };
            if (email) {
                query.email = { $regex: email, $options: 'i' };
            }
            if (sub) {
                query.stripeSubscriptionStatus = sub;
            }
            const users = await this.userModel
                .find(query)
                .skip((pageNo - 1) * lm)
                .limit(lm);
            const count = await this.userModel.countDocuments(query);
            if (users.length === 0) {
                throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                message: 'users found successfully',
                users: users,
                total: count,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserById(user_id) {
        try {
            const isUserExist = await this.userModel.findOne({
                _id: user_id,
                isAdmin: false,
            });
            if (!isUserExist) {
                throw new common_1.HttpException('User by id not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                message: 'User by Id found successfully',
                user: isUserExist,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUserProfile(user_id, userProfile) {
        try {
            if (userProfile.workExperience &&
                userProfile.workExperience.length === 0) {
                throw new common_1.HttpException('Work Experience array can not be empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const isUserExist = await this.userModel.findOne({
                _id: user_id,
                isAdmin: false,
            });
            if (!isUserExist) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.BAD_REQUEST);
            }
            if (Array.isArray(userProfile.workExperience)) {
                isUserExist.workExperience = userProfile.workExperience;
            }
            if (Array.isArray(userProfile.certificates)) {
                isUserExist.certificates = userProfile.certificates;
            }
            if (Array.isArray(userProfile.education)) {
                isUserExist.education = userProfile.education;
            }
            if (userProfile.industryOfInterest !== undefined) {
                isUserExist.industryOfInterest = userProfile.industryOfInterest;
            }
            if (userProfile.jobPositionLevel !== undefined) {
                isUserExist.jobPositionLevel = userProfile.jobPositionLevel;
            }
            if (userProfile.jobPositionOfInterest !== undefined) {
                isUserExist.jobPositionOfInterest = userProfile.jobPositionOfInterest;
            }
            if (userProfile.age !== undefined) {
                isUserExist.age = userProfile.age;
            }
            if (!!userProfile.fullName)
                isUserExist.fullName = userProfile.fullName;
            if (!!userProfile.branchOfService)
                isUserExist.branchOfService = userProfile.branchOfService;
            const areFieldsEmpty = !isUserExist.industryOfInterest ||
                !isUserExist.jobPositionOfInterest ||
                !isUserExist.jobPositionLevel ||
                !isUserExist.education ||
                !isUserExist.certificates ||
                isUserExist.education.length === 0 ||
                isUserExist.certificates.length === 0;
            isUserExist.profileStatus = areFieldsEmpty ? 'incomplete' : 'complete';
            const updatedUser = await this.userModel.findOneAndUpdate({ _id: isUserExist._id }, isUserExist, { new: true, upsert: true });
            return {
                message: 'User Profile updated successfully',
                user: updatedUser,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delUser(user_id) {
        try {
            const deletedUser = await this.userModel.findOneAndDelete({
                _id: user_id,
                isAdmin: false,
            });
            if (!deletedUser) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                message: 'User has been deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async overview() {
        try {
            const numOfActiveUsers = await this.userModel
                .find({
                isAdmin: false,
            })
                .count();
            const numOfPaidUsers = await this.userModel
                .find({
                isAdmin: false,
                stripeSubscriptionStatus: user_enum_1.STRIPE_SUBSCRIPTION_STATUS.ACTIVE,
            })
                .count();
            const mostUsedTool = await this.ToolModel.find({})
                .sort({ noOfTimeUsed: -1 })
                .limit(1)
                .then((tools) => tools[0].name);
            console.log('mostUsedTool', mostUsedTool);
            const toolsUsed = await this.ToolModel.find({}, 'name noOfTimeUsed')
                .sort({ noOfTimeUsed: -1 })
                .exec();
            const userCountByMonthArray = await this.getUsersPerMonth();
            return {
                message: 'The data for the Analytic Dashboard page found successfully',
                numOfActiveUsers: numOfActiveUsers,
                mostUsedTool: mostUsedTool,
                numOfPaidUsers: numOfPaidUsers,
                toolsUsed: toolsUsed,
                userCountByMonthArray: userCountByMonthArray,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUsersPerMonth() {
        try {
            const result = await this.userModel.aggregate([
                {
                    $match: {
                        isAdmin: false,
                    },
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        count: { $sum: 1 },
                    },
                },
            ]);
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            const userCountByMonth = {};
            result.forEach((group) => {
                const monthName = months[group._id - 1];
                userCountByMonth[monthName] = group.count;
            });
            const userCountByMonthArray = months.map((monthName) => ({
                [monthName]: userCountByMonth[monthName] || 0,
            }));
            return userCountByMonthArray;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProducts() {
        try {
            const plans = await stripe_service_1.StripeService.stripe.products.list({
                expand: ['data.default_price'],
                active: true,
            });
            return plans;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addProduct(body) {
        try {
            const newProduct = await stripe_service_1.StripeService.stripe.products.create({
                name: body.name,
                features: body.features,
                description: body.description,
                metadata: {
                    subHeading: 'Full Access',
                },
                default_price_data: {
                    unit_amount: body.unit_amount,
                    currency: 'usd',
                    recurring: {
                        interval: common_enum_1.Stripe_Price_Intervals.MONTH,
                        interval_count: body.interval_count,
                    },
                },
            });
            if (!newProduct.id) {
                throw new common_1.HttpException('Error in create product by stripe', common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                message: 'New product created successfully',
                product: newProduct,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProduct(product_id, body) {
        try {
            const updatedProduct = await stripe_service_1.StripeService.stripe.products.update(product_id, {
                description: body.description,
                features: body.features,
                name: body.name,
            });
            if (!updatedProduct.id) {
                throw new common_1.HttpException('Error in updating product by stripe', common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                message: 'Product updated successfully by stripe',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSupports(limit, page, email, status) {
        try {
            const pageNo = page || 1;
            const lm = limit || 10;
            let query = {};
            if (email) {
                query.email = { $regex: email, $options: 'i' };
            }
            if (status) {
                query.status = status;
            }
            const allSupports = await this.supportModel
                .find(query)
                .skip((pageNo - 1) * lm)
                .limit(lm);
            const total = await this.supportModel.countDocuments(query);
            if (allSupports.length === 0) {
                throw new common_1.HttpException('No support found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                message: 'Supports found successfully',
                supports: allSupports,
                total: total,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSupportById(support_id) {
        try {
            const supportById = await this.supportModel.findById(support_id);
            if (!supportById) {
                throw new common_1.HttpException('No support by id found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                message: 'Support by Id found successfully',
                support: supportById,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async replySupport(body) {
        try {
            const { supportId, reply } = body;
            const supportExist = await this.supportModel.findById(supportId);
            if (!supportExist) {
                throw new common_1.HttpException('No support by id found', common_1.HttpStatus.NOT_FOUND);
            }
            const mailOptions = {
                from: emailConstants_1.vacuaEmail,
                to: supportExist.email,
                subject: 'ADMIN SUPPORT REPLY',
                html: `
          <h1>Support Information:</h1>
          <p><strong>Name:</strong> ${supportExist.name}</p>
          <p><strong>Email:</strong> ${supportExist.email}</p>
          <p><strong>Question:</strong> ${supportExist.question}</p>
          <p><strong>Answer:</strong> ${reply}</p>
        `,
            };
            sendEmail_1.transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                    throw new common_1.HttpException('Unable to reply to the user via email', common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    supportExist.reply = reply;
                    supportExist.status = common_enum_1.SupportStatus.RESOLVED;
                    const updatedSupport = await this.supportModel.findByIdAndUpdate(supportExist._id, supportExist, { new: true, upsert: false });
                }
            });
            return {
                message: 'Admin successfully replied to the user',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __param(4, (0, mongoose_1.InjectModel)(tools_schema_1.Tool.name)),
    __param(5, (0, mongoose_1.InjectModel)(support_schema_1.Support.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        stripe_service_1.StripeService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map