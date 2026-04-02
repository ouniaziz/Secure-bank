import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import type { Request } from "express"
import { TransferService } from "./transfer.service"
import { CreateTransferDto } from "./dto/create-transfer.dto"

@Controller("transfer")
@UseGuards(AuthGuard("jwt"))
export class TransferController {
  constructor(private transferService: TransferService) {}

  @Post()
  async executeTransfer(@Body() createTransferDto: CreateTransferDto, @Req() req: any) {
    return this.transferService.executeTransfer(req.user.userId, createTransferDto)
  }
  
}
