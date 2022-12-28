const nodemailer = require("nodemailer")

/* Mail Setup*/
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendGenericEmail(email, subject, content) {
    try {
        var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: content
        };

        await transporter.sendMail(mailOptions)
    } catch (err) {
        console.log("Mail not sent", err)
    }
}

module.exports = { transporter, sendGenericEmail }