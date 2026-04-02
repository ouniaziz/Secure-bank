import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TransferController } from "./transfer.controller"
import { TransferService } from "./transfer.service"
import { TransactionEntity } from "../../entities/transaction.entity"
import { UserEntity } from "../../entities/user.entity"
import { AccountEntity } from "../../entities/account.entity"
import { BeneficiaryEntity } from "../../entities/beneficiary.entity"

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, UserEntity, AccountEntity, BeneficiaryEntity])],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
