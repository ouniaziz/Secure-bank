import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TransactionController } from "./transaction.controller"
import { TransactionService } from "./transaction.service"
import { TransactionEntity } from "../../entities/transaction.entity"
import { UserEntity } from "../../entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, UserEntity])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
