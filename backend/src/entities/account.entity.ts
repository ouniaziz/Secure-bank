import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { UserEntity } from "./user.entity"

@Entity("accounts")
export class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  accountNumber: string

  @Column("decimal", { precision: 15, scale: 2 })
  balance: number

  @Column({ default: "USD" })
  currency: string

  @Column({ default: "Premium Checking" })
  accountType: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(
    () => UserEntity,
    (user) => user.account,
  )
  @JoinColumn()
  user: UserEntity
}
