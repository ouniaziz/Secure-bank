import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(to: string, username: string, otp: string) {
    return this.mailerService.sendMail({
      to,
      subject: "Your Secure Bank OTP",
      template: "otp",
      context: {
        username,
        otp,
      },
    });
  }
}
