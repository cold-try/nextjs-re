const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { id: '4', name: 'new user 4' },
      { id: '5', name: 'new user 5' },
      { id: '6', name: 'new user 6' },
    ],
  });
  console.log('Database populated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
