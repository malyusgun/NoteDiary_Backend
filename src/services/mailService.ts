import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_NAME,
    pass: process.env.MAIL_PASSWORD
  }
});

const sendActivationMail = async (to: string, code: string) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_NAME,
      to,
      subject: 'Activation mail',
      text: '',
      html: `
        <div> 
          <p>To activate your account in the "NoteDiary" service, enter the code below:</p>
          <p style="font-size: 24px; font-weight: bold;">${code}<br>
          <span style="color: red">Attention:<span/> the code is valid for 5 minutes, after which it will be invalid.</p>
      `
    });
  } catch (e) {
    console.log('error: ', e);
  }
};

export default sendActivationMail;
