import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserController } from "./user.controller"
import { UserEntity } from "../../entities/user.entity"
import { AccountEntity } from "../../entities/account.entity"
import { UserService } from "./user.service"

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AccountEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
