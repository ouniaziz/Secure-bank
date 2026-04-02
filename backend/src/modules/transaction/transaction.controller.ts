import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { TransactionService } from "./transaction.service"

@Controller("transactions")
@UseGuards(AuthGuard("jwt"))
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getTransactions(
    @Req()req:any,
    @Query('type') type?: string, 
    @Query('date') date?: string
  ) {
    return this.transactionService.getUserTransactions(req.user.userId, {
      type,
      date,
    })
  }
}
