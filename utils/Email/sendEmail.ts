import { HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { vacuaEmail, vacuaPassword } from '../Templates/emailConstants';


export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: vacuaEmail,
    pass: vacuaPassword,
  },
});

export const sendEmail = async ( 
  toEmail: string,
  subject: string,
  body: string,
) => {
  transporter.verify(function(error, success) {
    if (error) {
          console.log(error);
    } else {
          console.log('Server is ready to take our messages');
    }
  });
  await transporter.sendMail(
    {
      from: vacuaEmail,
      to: toEmail,
      subject: subject,
      text: subject,
      html: body,
    },
    async (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return info;
      }
    },
  );
};
