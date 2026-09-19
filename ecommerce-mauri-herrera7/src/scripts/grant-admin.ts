import { AppDataSource } from '../config/typeorm';
import { Users } from '../modules/users/entities/user.entity';

async function grantAdmin(): Promise<void> {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error('Usage: npm run admin:grant -- user@example.com');

  await AppDataSource.initialize();
  try {
    const user = await AppDataSource.getRepository(Users).findOneBy({ email });
    if (!user) throw new Error('User not found');
    await AppDataSource.getRepository(Users).update(user.id, { isAdmin: true });
    console.log(`Admin access granted to ${email}`);
  } finally {
    await AppDataSource.destroy();
  }
}

grantAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
