import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendActivationMail(to: string, code: string) {
    try {
      await this.mailerService.sendMail({
        from: process.env.MAIL_NAME,
        to,
        subject: 'Activation mail',
        text: '',
        html: `
        <div> 
          <p>To activate your account in the "NoteDiary" service, enter the code below:</p>
          <p style="font-size: 24px; font-weight: bold;">${code}<br>
          <span style="color: red">Attention:<span/> the code is valid for 5 minutes, after which it will be invalid.</p>
      `,
      });
    } catch (e) {
      console.log('error: ', e);
    }
  }
}
