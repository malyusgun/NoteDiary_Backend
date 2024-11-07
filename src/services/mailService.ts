import nodemailer from 'nodemailer';

class MailService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_NAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
  }

  async sendActivationEmail(to: string, code: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_NAME,
      to,
      subject: 'Activation email',
      text: '',
      html: `
        <div> 
          <h1>Активация аккаунта</h1>
          <p>Для активации аккаунта в сервисе "NoteDiary" введите код, представленный ниже:</p>
          <p style="font-size: 24px; font-weight: bold;">${code}</p>
          <p><span style="font-style: italic; color: red">Внимание:<span/> код действует в течение 5 минут, после чего он будет недействителен.</p>
      `
    });
  }
}

export default new MailService();
