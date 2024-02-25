const nodemailer = require('nodemailer')
 
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = transporter