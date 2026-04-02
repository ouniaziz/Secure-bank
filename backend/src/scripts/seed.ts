import { AppDataSource } from "../data-source";
import { UserEntity } from "../entities/user.entity";
import { AccountEntity } from "../entities/account.entity";
import { BeneficiaryEntity, BankType } from "../entities/beneficiary.entity";
import * as bcrypt from "bcrypt";

async function seed() {
  try {
    // Initialize DB connection
    await AppDataSource.initialize();
    console.log("Database connection established!");

    const userRepository = AppDataSource.getRepository(UserEntity);
    const accountRepository = AppDataSource.getRepository(AccountEntity);
    const beneficiaryRepository = AppDataSource.getRepository(BeneficiaryEntity);

    // Create demo user if not exists
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    let user = await userRepository.findOne({
      where: { email: "john.doe@example.com" },
    });

    if (!user) {
      user = userRepository.create({
        email: "john.doe@example.com",
        password: hashedPassword,
        name: "John Doe",
        phone: "+1 (555) 123-4567",
      });

      user = await userRepository.save(user);
      console.log("User created");
    }

    // Create account if not exists
    let account = await accountRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!account) {
      account = accountRepository.create({
        accountNumber: "****5678",
        balance: 45250.5,
        currency: "USD",
        accountType: "Premium Checking",
        user,
      });
      await accountRepository.save(account);
      console.log("Account created");
    }

    // Create beneficiaries
    const beneficiaries = [
      {
        fullName: "Sarah Johnson",
        iban: "DE89370400440532013000",
        bankType: BankType.NATIONAL,
        email: "sarah.johnson@email.com",
      },
      {
        fullName: "Michael Chen",
        iban: "GB82WEST12345698765432",
        bankType: BankType.INTERNATIONAL,
        email: "m.chen@email.com",
      },
      {
        fullName: "Emma Williams",
        iban: "FR1420041010050500013M02606",
        bankType: BankType.INTERNATIONAL,
        email: "emma.w@email.com",
      },
      {
        fullName: "Alex Martinez",
        iban: "ES9121000418450200051332",
        bankType: BankType.SAME_BANK,
        email: "alex.martinez@email.com",
      },
    ];

    for (const benefData of beneficiaries) {
      const exists = await beneficiaryRepository.findOne({
        where: { iban: benefData.iban },
      });

      if (!exists) {
        const beneficiary = beneficiaryRepository.create({
          ...benefData,
          user,
        });
        await beneficiaryRepository.save(beneficiary);
      }
    }

    console.log("Database seeded successfully!");
    console.log("Demo login: john.doe@example.com / Password123!");

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
