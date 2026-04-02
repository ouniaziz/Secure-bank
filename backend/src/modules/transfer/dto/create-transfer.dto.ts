import { IsUUID, IsString, IsNumberString, IsOptional } from "class-validator"

export class CreateTransferDto {
  @IsUUID()
  beneficiaryId: string

  @IsNumberString()
  amount: string

  @IsOptional()
  @IsString()
  description?: string
}
