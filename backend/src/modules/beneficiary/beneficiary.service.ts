import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import {  BeneficiaryEntity, type BankType } from "../../entities/beneficiary.entity"
import type { CreateBeneficiaryDto } from "./dto/create-beneficiary.dto"
import { InjectRepository } from "@nestjs/typeorm"; // <-- important
import { UserEntity } from "../../entities/user.entity";


@Injectable()
export class BeneficiaryService {
  constructor(
    @InjectRepository(BeneficiaryEntity)
    private beneficiaryRepository: Repository<BeneficiaryEntity>,
    
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserBeneficiaries(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    const beneficiaries = await this.beneficiaryRepository.find({
      where: { user: { id: userId } },
    })

    return beneficiaries.map((b) => ({
      id: b.id,
      name: b.fullName,
      iban: b.iban,
      bankType: b.bankType,
      email: b.email,
    }))
  }

  async addBeneficiary(userId: string, dto: CreateBeneficiaryDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    if (!this.validateIban(dto.iban)) {
      throw new BadRequestException("Invalid IBAN format")
    }

    const beneficiary = this.beneficiaryRepository.create({
      fullName: dto.fullName,
      iban: dto.iban,
      bankType: dto.bankType as BankType,
      email: dto.email,
      user,
    })

    const saved = await this.beneficiaryRepository.save(beneficiary)

    return {
      id: saved.id,
      name: saved.fullName,
      iban: saved.iban,
      bankType: saved.bankType,
      email: saved.email,
      message: "Beneficiary added successfully",
    }
  }

  private validateIban(iban: string): boolean {
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/
    return ibanRegex.test(iban)
  }
}
