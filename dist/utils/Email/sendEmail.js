"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer = require("nodemailer");
const emailConstants_1 = require("../Templates/emailConstants");
exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailConstants_1.vacuaEmail,
        pass: emailConstants_1.vacuaPassword,
    },
});
const sendEmail = async (toEmail, subject, body) => {
    exports.transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Server is ready to take our messages');
        }
    });
    await exports.transporter.sendMail({
        from: emailConstants_1.vacuaEmail,
        to: toEmail,
        subject: subject,
        text: subject,
        html: body,
    }, async (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            return info;
        }
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map