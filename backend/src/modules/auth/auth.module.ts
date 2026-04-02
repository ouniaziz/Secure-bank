import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { UserEntity } from "../../entities/user.entity"
import { AccountEntity } from "../../entities/account.entity"
import { OtpEntity } from "../../entities/otp.entity"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { MailModule } from "../mail/mail.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AccountEntity, OtpEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "15m" },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
