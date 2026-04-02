import { IsString, IsEmail, IsEnum, Matches, MinLength } from "class-validator"
import { BankType } from "../../../entities/beneficiary.entity"

export class CreateBeneficiaryDto {
  @IsString()
  @MinLength(2)
  fullName: string

  @Matches(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/)
  iban: string

  @IsEnum(BankType)
  bankType: BankType

  @IsEmail()
  email: string
}
