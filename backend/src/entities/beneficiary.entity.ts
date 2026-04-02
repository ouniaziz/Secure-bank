import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { UserEntity } from "./user.entity"

export enum BankType {
  SAME_BANK = "same-bank",
  NATIONAL = "national",
  INTERNATIONAL = "international",
}

@Entity("beneficiaries")
export class BeneficiaryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  fullName: string

  @Column()
  iban: string

  @Column({ type: "enum", enum: BankType })
  bankType: BankType

  @Column()
  email: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => UserEntity,
    (user) => user.beneficiaries,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: UserEntity
}
