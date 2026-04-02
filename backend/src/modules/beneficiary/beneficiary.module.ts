import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BeneficiaryController } from "./beneficiary.controller"
import { BeneficiaryService } from "./beneficiary.service"
import { BeneficiaryEntity } from "../../entities/beneficiary.entity"
import { UserEntity } from "../../entities/user.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([BeneficiaryEntity, UserEntity])
  ],
  controllers: [BeneficiaryController],
  providers: [BeneficiaryService],
  exports: [BeneficiaryService],
})
export class BeneficiaryModule {}
