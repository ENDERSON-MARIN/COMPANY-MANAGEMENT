import { beforeAll, afterAll, beforeEach, afterEach } from "vitest"
import { prisma } from "../adapters/databases/prisma"

beforeAll(async () => {
  console.log("🔧 Setting up test environment...")

  await prisma.$connect()

  console.log("✅ Test database connected")
})

beforeEach(async () => {
  await prisma.company.deleteMany()
})

afterEach(async () => {})

afterAll(async () => {
  console.log("🧹 Cleaning up test environment...")

  await prisma.company.deleteMany()

  await prisma.$disconnect()

  console.log("✅ Test database disconnected")
})
