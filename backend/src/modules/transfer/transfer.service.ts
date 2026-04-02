import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository, DataSource } from "typeorm"
import { TransactionEntity, TransactionType } from "../../entities/transaction.entity"
import { UserEntity } from "../../entities/user.entity"
import { BeneficiaryEntity } from "../../entities/beneficiary.entity"
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { CreateTransferDto } from "./dto/create-transfer.dto"
import { AccountEntity } from "../../entities/account.entity"


@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    
    @InjectRepository(BeneficiaryEntity)
    private beneficiaryRepository: Repository<BeneficiaryEntity>,
    
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async executeTransfer(userId: string, dto: CreateTransferDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Get sender
      const sender = await queryRunner.manager.findOne(UserEntity, {
        where: { id: userId },
        relations: ["account"],
      })

      if (!sender || !sender.account) {
        throw new NotFoundException("User or account not found")
      }

      // Get beneficiary
      const beneficiary = await queryRunner.manager.findOne(BeneficiaryEntity, {
        where: { id: dto.beneficiaryId },
      })

      if (!beneficiary) {
        throw new NotFoundException("Beneficiary not found")
      }

      // Validate amount
      const amount = Number.parseFloat(dto.amount)
      const fee = 2.5
      const totalDebit = amount + fee

      if (sender.account.balance < totalDebit) {
        throw new BadRequestException("Insufficient balance")
      }

      // Deduct from sender
      sender.account.balance -= totalDebit
      await queryRunner.manager.save(sender.account)

      // Create transaction record
      const transaction = queryRunner.manager.create(TransactionEntity, {
        amount,
        type: TransactionType.SENT,
        fee,
        description: dto.description,
        recipientName: beneficiary.fullName,
        sender,
      })

      await queryRunner.manager.save(transaction)

      // Commit transaction
      await queryRunner.commitTransaction()

      return {
        success: true,
        message: "Transfer completed successfully",
        transactionId: transaction.id,
        amount,
        fee,
        recipientName: beneficiary.fullName,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}
