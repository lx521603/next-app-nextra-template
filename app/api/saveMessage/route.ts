const transporter = nodemailer.createTransport({
  host: 'swednesday.mxrouting.net', // 你邮箱对应的 SMTP
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.MAIL_USER,
  to: process.env.MAIL_TO,
  subject: '新留言通知',
  text: `名字: ${name}\n电话: ${phone}\n留言: ${message}`,
};
