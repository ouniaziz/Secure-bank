import { IsOptional, IsEmail, IsPhoneNumber } from "class-validator"

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsPhoneNumber()
  phone?: string
}
