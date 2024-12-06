import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
});
export default transporter