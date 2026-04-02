import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { UserEntity } from "./user.entity"

@Entity("otps")
export class OtpEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  code: string

  @Column()
  email: string

  @Column()
  expiresAt: Date

  @Column({ default: false })
  isUsed: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => UserEntity,
    (user) => user.otps,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: UserEntity
}
