import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

const otp = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  specialChars: false,
});

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sarthak8544@gmail.com",
    pass: "erym fced zxya njqi",
  },
});

export const sendOtp = (data) => {
  let isSent = false;
  //Generate OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  //Set User Email
  let mailOptions = {
    from: "sarthak8544@gmail.com",
    to: data.email,
    subject: "OTP | Account Verification (WebCooks)",
    text: `Your OTP for account Verification is ${otp}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      isSent = false;
    } else {
      isSent = true;
    }
  });
  return { otp, sent: isSent };
};
