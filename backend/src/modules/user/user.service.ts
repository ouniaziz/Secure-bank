import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"; // <-- add this
import { UserEntity } from "../../entities/user.entity";
import { AccountEntity } from "../..//entities/account.entity"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(AccountEntity)

    private accountRepository: Repository<AccountEntity>,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["account"],
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: user.account?.balance || 0,
      accountNumber: user.account?.accountNumber || "****5678",
      accountType: user.account?.accountType || "Premium Checking",
      createdAt: user.createdAt,
      currency : user.account?.currency || "USD",
      updatedAt : user.account?.updatedAt || new Date(),
    }
  }

  async updateEmail(userId: string, newEmail: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: newEmail },
    })

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException("Email already in use")
    }

    user.email = newEmail
    await this.userRepository.save(user)

    return { message: "Email updated successfully", email: newEmail }
  }

  async updatePhone(userId: string, newPhone: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    user.phone = newPhone
    await this.userRepository.save(user)

    return { message: "Phone number updated successfully", phone: newPhone }
  }
}
