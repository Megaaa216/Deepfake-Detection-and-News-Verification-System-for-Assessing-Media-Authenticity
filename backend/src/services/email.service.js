const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("EMAIL ERROR:", error);
    } else {
        console.log("EMAIL SERVER READY");
    }
});

exports.sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        html: `
            <h2>Your OTP</h2>
            <h1>${otp}</h1>
        `
    });
};