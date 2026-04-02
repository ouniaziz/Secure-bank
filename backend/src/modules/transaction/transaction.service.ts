import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { TransactionEntity } from "../../entities/transaction.entity"
import { UserEntity } from "../../entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async getUserTransactions(userId: string, filters: { type?: string; date?: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    let query = this.transactionRepository
      .createQueryBuilder("transaction")
      .where("transaction.senderId = :userId OR transaction.recipientId = :userId", {
        userId,
      })

    if (filters.type && filters.type !== "all") {
      query = query.andWhere("transaction.type = :type", { type: filters.type })
    }

    if (filters.date) {
      const startDate = new Date(filters.date)
      const endDate = new Date(filters.date)
      endDate.setDate(endDate.getDate() + 1)

      query = query.andWhere("transaction.date >= :startDate AND transaction.date < :endDate", {
        startDate,
        endDate,
      })
    }

    const transactions = await query.orderBy("transaction.date", "DESC").getMany()

    return transactions.map((tx) => ({
      id: tx.id,
      recipient: tx.recipientName,
      amount: `$${tx.amount.toFixed(2)}`,
      type: tx.type,
      date: tx.date.toISOString().split("T")[0],
      description: tx.description,
      status: tx.status,
      fee: tx.fee,
    }))
  }
}
