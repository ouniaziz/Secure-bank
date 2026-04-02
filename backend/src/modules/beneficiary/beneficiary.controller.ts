import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { CreateBeneficiaryDto } from "./dto/create-beneficiary.dto"
import { BeneficiaryService } from "./beneficiary.service";

@Controller("beneficiaries")
@UseGuards(AuthGuard("jwt"))
export class BeneficiaryController {
  constructor(private beneficiaryService: BeneficiaryService) {}

  @Get()
  async getBeneficiaries(@Request() req: any) {
    return this.beneficiaryService.getUserBeneficiaries(req.user.userId);
  }

  @Post()
  async addBeneficiary(@Body() createBeneficiaryDto: CreateBeneficiaryDto, @Request() req: any,) {
    return this.beneficiaryService.addBeneficiary(req.user.userId, createBeneficiaryDto)
  }
}
