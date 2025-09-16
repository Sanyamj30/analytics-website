const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanyam30jpr@gmail.com',
        pass: 'tfty tpoa zjul wubc'
    }
});

module.exports = transporter;