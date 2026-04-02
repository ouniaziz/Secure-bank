import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

import { UserEntity } from "./entities/user.entity";
import { AccountEntity } from "./entities/account.entity";
import { TransactionEntity } from "./entities/transaction.entity";
import { OtpEntity } from "./entities/otp.entity";
import { BeneficiaryEntity } from "./entities/beneficiary.entity"; // <-- ADD THIS

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3307,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bank-app",
  synchronize: false,
  logging: true,
  entities: [
    UserEntity,
    AccountEntity,
    TransactionEntity,
    OtpEntity,
    BeneficiaryEntity, // <-- ADD THIS TOO
  ],
  migrations: ["src/migrations/*.ts"],
});
