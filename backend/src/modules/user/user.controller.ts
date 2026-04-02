import { Controller, Get, Patch, Body, UseGuards, Request as Req, BadRequestException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UpdateUserDto } from "./dto/update-user.dto";
import type { Request } from 'express';
import { UserService } from "./user.service";

// Define a type for Request with JWT user
interface JwtRequest extends Request {
  user: {
    userId: string;
    email?: string;
    name?: string;
    // Add other JWT payload fields if needed
  };
}

@Controller("user")
@UseGuards(AuthGuard("jwt"))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req: JwtRequest) {
    return this.userService.getUserProfile(req.user.userId);
  }

  @Patch("update-email")
  async updateEmail(@Req() req: JwtRequest, @Body() updateUserDto: UpdateUserDto) {
    if (!updateUserDto.email) {
      throw new BadRequestException("Email is required");
    }
    return this.userService.updateEmail(req.user.userId, updateUserDto.email);
  }

  @Patch("update-phone")
  async updatePhone(@Req() req: JwtRequest, @Body() updateUserDto: UpdateUserDto) {
    if (!updateUserDto.phone) {
      throw new BadRequestException("Phone number is required");
    }
    return this.userService.updatePhone(req.user.userId, updateUserDto.phone);
  }
}
