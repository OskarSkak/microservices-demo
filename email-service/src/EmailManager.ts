import * as nodemailer from "nodemailer";

const dotenv = require("dotenv");
dotenv.config();

export async function sendEmail(to: string, pdfPath: string): Promise<void> {
  try {
    // Create a nodemailer transporter using Fastmail SMTP service
    const transporter = nodemailer.createTransport({
      host: "smtp.fastmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.FASTMAIL_EMAIL,
        pass: process.env.FASTMAIL_APP_PASSWORD,
      },
    });

    // Setup email data with attachments
    const mailOptions = {
      from: process.env.FASTMAIL_EMAIL, // Sender address
      to,
      subject: "Transaction Statement",
      text: "Please find your transaction statement attached.",
      attachments: [
        {
          path: pdfPath,
        },
      ],
    };

    // Send mail with defined transport object
    const info = (await transporter.sendMail(
      mailOptions
    )) as nodemailer.SentMessageInfo;

    // Log the URL to view the sent email in the Fastmail interface
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Propagate the error
  }
}