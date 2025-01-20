import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const spaces = [
    { id: 'living', name: '거실' },
    { id: 'kitchen', name: '주방' },
    { id: 'bathroom', name: '화장실' },
    { id: 'bedroom', name: '침실' }
  ]

  for (const space of spaces) {
    await prisma.space.upsert({
      where: { id: space.id },
      update: {},
      create: space,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 