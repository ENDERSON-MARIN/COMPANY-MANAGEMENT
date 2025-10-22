import { describe, it, expect } from "vitest"
import { Company } from "@/core/entities/Company"

describe("Company Entity", () => {
  describe("Constructor", () => {
    it("should create a company with all fields", () => {
      const company = new Company(
        "123",
        "Test Company",
        "12345678901234",
        "test@company.com",
        "47999999999",
        "Rua Teste, 123"
      )

      expect(company.id).toBe("123")
      expect(company.name).toBe("Test Company")
      expect(company.cnpj).toBe("12345678901234")
      expect(company.email).toBe("test@company.com")
      expect(company.phone).toBe("47999999999")
      expect(company.address).toBe("Rua Teste, 123")
    })

    it("should create a company with only required fields", () => {
      const company = new Company(
        "123",
        "Test Company",
        "12345678901234",
        "test@company.com"
      )

      expect(company.id).toBe("123")
      expect(company.name).toBe("Test Company")
      expect(company.phone).toBeUndefined()
      expect(company.address).toBeUndefined()
    })
  })

  describe("update", () => {
    it("should update company name", () => {
      const company = new Company(
        "123",
        "Old Name",
        "12345678901234",
        "test@company.com"
      )

      company.update({ name: "New Name" })

      expect(company.name).toBe("New Name")
    })

    it("should update company email", () => {
      const company = new Company(
        "123",
        "Test Company",
        "12345678901234",
        "old@company.com"
      )

      company.update({ email: "new@company.com" })

      expect(company.email).toBe("new@company.com")
    })

    it("should update multiple fields", () => {
      const company = new Company(
        "123",
        "Old Name",
        "12345678901234",
        "old@company.com"
      )

      company.update({
        name: "New Name",
        email: "new@company.com",
        phone: "47999999999",
      })

      expect(company.name).toBe("New Name")
      expect(company.email).toBe("new@company.com")
      expect(company.phone).toBe("47999999999")
    })

    it("should not update id and timestamps", () => {
      const createdAt = new Date()
      const company = new Company(
        "123",
        "Test Company",
        "12345678901234",
        "test@company.com",
        undefined,
        undefined,
        createdAt
      )

      company.update({ name: "New Name" })

      expect(company.id).toBe("123")
      expect(company.createdAt).toBe(createdAt)
    })
  })
})
