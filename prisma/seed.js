const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Doe' },
      { id: '3', name: 'Alice Doe' },
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
