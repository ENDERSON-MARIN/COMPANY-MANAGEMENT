import { describe, it, expect, beforeEach } from "vitest"
import { PrismaCompanyRepository } from "@/adapters/repositories/PrismaCompanyRepository"
import { Company } from "@/core/entities/Company"
import { prisma } from "@/adapters/databases/prisma"

describe("PrismaCompanyRepository (Integration)", () => {
  let repository: PrismaCompanyRepository

  beforeEach(async () => {
    repository = new PrismaCompanyRepository(prisma)
    // Limpar banco antes de cada teste
    await prisma.company.deleteMany()
  })

  describe("create", () => {
    it("should create a company in database", async () => {
      const company = new Company(
        "",
        "Test Company",
        "12345678901234",
        "test@company.com",
        "47999999999",
        "Rua Teste, 123"
      )

      const result = await repository.create(company)

      expect(result.id).toBeDefined()
      expect(result.name).toBe("Test Company")
      expect(result.cnpj).toBe("12345678901234")
      expect(result.email).toBe("test@company.com")

      // Verificar no banco
      const dbCompany = await prisma.company.findUnique({
        where: { id: result.id },
      })
      expect(dbCompany).not.toBeNull()
      expect(dbCompany?.name).toBe("Test Company")
    })

    it("should throw error on duplicate CNPJ", async () => {
      const company1 = new Company(
        "",
        "Company 1",
        "12345678901234",
        "company1@test.com"
      )

      await repository.create(company1)

      const company2 = new Company(
        "",
        "Company 2",
        "12345678901234",
        "company2@test.com"
      )

      await expect(repository.create(company2)).rejects.toThrow()
    })
  })

  describe("findAll", () => {
    it("should return all companies", async () => {
      await repository.create(
        new Company("", "Company 1", "11111111111111", "company1@test.com")
      )
      await repository.create(
        new Company("", "Company 2", "22222222222222", "company2@test.com")
      )
      await repository.create(
        new Company("", "Company 3", "33333333333333", "company3@test.com")
      )

      const result = await repository.findAll()

      expect(result).toHaveLength(3)
      expect(result[0].name).toBeDefined()
    })

    it("should return empty array when no companies exist", async () => {
      const result = await repository.findAll()

      expect(result).toEqual([])
    })

    it("should return companies ordered by createdAt desc", async () => {
      const company1 = await repository.create(
        new Company("", "Company 1", "11111111111111", "company1@test.com")
      )

      // Pequeno delay para garantir ordem
      await new Promise((resolve) => setTimeout(resolve, 10))

      const company2 = await repository.create(
        new Company("", "Company 2", "22222222222222", "company2@test.com")
      )

      const result = await repository.findAll()

      expect(result[0].id).toBe(company2.id) // Mais recente primeiro
      expect(result[1].id).toBe(company1.id)
    })
  })

  describe("findById", () => {
    it("should return company by id", async () => {
      const created = await repository.create(
        new Company("", "Test Company", "12345678901234", "test@company.com")
      )

      const result = await repository.findById(created.id)

      expect(result).not.toBeNull()
      expect(result?.id).toBe(created.id)
      expect(result?.name).toBe("Test Company")
    })

    it("should return null if company not found", async () => {
      const result = await repository.findById("non-existent-id")

      expect(result).toBeNull()
    })
  })

  describe("findByCnpj", () => {
    it("should return company by CNPJ", async () => {
      await repository.create(
        new Company("", "Test Company", "12345678901234", "test@company.com")
      )

      const result = await repository.findByCnpj("12345678901234")

      expect(result).not.toBeNull()
      expect(result?.cnpj).toBe("12345678901234")
      expect(result?.name).toBe("Test Company")
    })

    it("should return null if CNPJ not found", async () => {
      const result = await repository.findByCnpj("99999999999999")

      expect(result).toBeNull()
    })
  })

  describe("update", () => {
    it("should update company", async () => {
      const created = await repository.create(
        new Company("", "Old Name", "12345678901234", "old@company.com")
      )

      const companyToUpdate = new Company(
        created.id,
        "New Name",
        "12345678901234",
        "new@company.com",
        "47999999999"
      )

      const result = await repository.update(created.id, companyToUpdate)

      expect(result.name).toBe("New Name")
      expect(result.email).toBe("new@company.com")
      expect(result.phone).toBe("47999999999")

      // Verificar no banco
      const dbCompany = await prisma.company.findUnique({
        where: { id: created.id },
      })
      expect(dbCompany?.name).toBe("New Name")
    })

    it("should throw error if company not found", async () => {
      const company = new Company(
        "non-existent",
        "Test",
        "12345678901234",
        "test@test.com"
      )

      await expect(repository.update("non-existent", company)).rejects.toThrow()
    })
  })

  describe("delete", () => {
    it("should delete company", async () => {
      const created = await repository.create(
        new Company("", "Test Company", "12345678901234", "test@company.com")
      )

      await repository.delete(created.id)

      const result = await prisma.company.findUnique({
        where: { id: created.id },
      })
      expect(result).toBeNull()
    })

    it("should throw error if company not found", async () => {
      await expect(repository.delete("non-existent-id")).rejects.toThrow()
    })
  })

  describe("toDomain", () => {
    it("should convert Prisma object to Domain entity", async () => {
      const created = await repository.create(
        new Company(
          "",
          "Test Company",
          "12345678901234",
          "test@company.com",
          "47999999999",
          "Rua Teste"
        )
      )

      expect(created).toBeInstanceOf(Company)
      expect(created.update).toBeDefined()
      expect(typeof created.update).toBe("function")
    })
  })
})
