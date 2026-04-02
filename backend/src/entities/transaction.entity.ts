import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "./user.entity"

export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
}

export enum TransactionType {
  SENT = "sent",
  RECEIVED = "received",
}

@Entity("transactions")
export class TransactionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("decimal", { precision: 15, scale: 2, transformer:
    {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
   })
  amount: number

  @Column({ type: "enum", enum: TransactionType })
  type: TransactionType

  @Column({ type: "enum", enum: TransactionStatus, default: TransactionStatus.COMPLETED })
  status: TransactionStatus

  @Column({ nullable: true })
  description: string

  @Column("decimal", { precision: 15, scale: 2, default: 2.5,transformer:
    {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
   })
  fee: number

  @Column({ nullable: true })
  recipientName: string

  @CreateDateColumn()
  date: Date

  @ManyToOne(
    () => UserEntity,
    (user) => user.sentTransactions,
  )
  @JoinColumn({ name: "senderId" })
  sender: UserEntity

  @ManyToOne(
    () => UserEntity,
    (user) => user.receivedTransactions,
  )
  @JoinColumn({ name: "recipientId" })
  recipient: UserEntity
}
