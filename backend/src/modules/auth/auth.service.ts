import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { UserEntity } from "../../entities/user.entity"
import { AccountEntity } from "../../entities/account.entity"
import { OtpEntity } from "../../entities/otp.entity"
import type { LoginDto } from "./dto/login.dto"
import type { VerifyOtpDto } from "./dto/verify-otp.dto"
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt"
import { MailService } from "../mail/mail.service";
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,

    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,

    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    // Generate OTP
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.otpRepository.save({
      code: otp,
      email: user.email,
      expiresAt,
      user,
    });

    // In production, send OTP via email
    await this.mailService.sendOtpEmail(user.email, user.name ?? user.email, otp);


    return {
      message: "OTP sent to your email",
      email: user.email,
      // For testing: include OTP in response (remove in production)
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const otp = await this.otpRepository.findOne({
      where: { email: verifyOtpDto.email, code: verifyOtpDto.otp },
      relations: ["user", "user.account"],
    });

    if (!otp) {
      throw new BadRequestException("Invalid OTP");
    }

    if (otp.isUsed) {
      throw new BadRequestException("OTP already used");
    }

    if (new Date() > otp.expiresAt) {
      throw new BadRequestException("OTP expired");
    }

    otp.isUsed = true;
    await this.otpRepository.save(otp);

    const user = otp.user;
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: "refresh" },
      { expiresIn: "7d" }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.account?.balance || 0,
        accountNumber: user.account?.accountNumber || "****5678",
        currency: user.account?.currency || "USD",
        createdAt: user.account?.createdAt || new Date(),
        updatedAt: user.account?.updatedAt || new Date(),
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ["account"],
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const newAccessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
