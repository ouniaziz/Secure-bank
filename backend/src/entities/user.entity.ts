import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm"
import { AccountEntity } from "./account.entity"
import { BeneficiaryEntity } from "./beneficiary.entity"
import { TransactionEntity } from "./transaction.entity"
import { OtpEntity } from "./otp.entity"

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  name: string

  @Column({ nullable: true })
  phone: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(
    () => AccountEntity,
    (account) => account.user,
    { cascade: true },
  )
  account: AccountEntity

  @OneToMany(
    () => BeneficiaryEntity,
    (beneficiary) => beneficiary.user,
  )
  beneficiaries: BeneficiaryEntity[]

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.sender,
  )
  sentTransactions: TransactionEntity[]

  @OneToMany(
    () => TransactionEntity,
    (transaction) => transaction.recipient,
  )
  receivedTransactions: TransactionEntity[]

  @OneToMany(
    () => OtpEntity,
    (otp) => otp.user,
  )
  otps: OtpEntity[]
}
