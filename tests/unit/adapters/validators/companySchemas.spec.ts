import { describe, it, expect } from "vitest"
import {
  createCompanySchema,
  updateCompanySchema,
  idParamSchema,
} from "@/adapters/validators/companySchemas"

describe("Company Schemas", () => {
  describe("createCompanySchema", () => {
    it("should validate valid company data", () => {
      const validData = {
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
        phone: "47999999999",
        address: "Rua Teste, 123",
      }

      const result = createCompanySchema.safeParse(validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it("should validate with only required fields", () => {
      const validData = {
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
      }

      const result = createCompanySchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it("should fail for missing name", () => {
      const invalidData = {
        cnpj: "12345678901234",
        email: "test@company.com",
      }

      const result = createCompanySchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("name")
      }
    })

    it("should fail for short name", () => {
      const invalidData = {
        name: "AB",
        cnpj: "12345678901234",
        email: "test@company.com",
      }

      const result = createCompanySchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "at least 3 characters"
        )
      }
    })

    it("should fail for invalid CNPJ format", () => {
      const testCases = [
        { cnpj: "123" }, // Muito curto
        { cnpj: "123456789012345" }, // Muito longo
        { cnpj: "1234567890123A" }, // Com letra
        { cnpj: "12.345.678/0001-23" }, // Com formatação
      ]

      testCases.forEach(({ cnpj }) => {
        const invalidData = {
          name: "Test Company",
          cnpj,
          email: "test@company.com",
        }

        const result = createCompanySchema.safeParse(invalidData)

        expect(result.success).toBe(false)
      })
    })

    it("should fail for invalid email format", () => {
      const testCases = [
        { email: "invalid" },
        { email: "invalid@" },
        { email: "@invalid.com" },
        { email: "invalid@com" },
        { email: "invalid email@test.com" },
      ]

      testCases.forEach(({ email }) => {
        const invalidData = {
          name: "Test Company",
          cnpj: "12345678901234",
          email,
        }

        const result = createCompanySchema.safeParse(invalidData)

        expect(result.success).toBe(false)
      })
    })

    it("should fail for invalid phone format", () => {
      const testCases = [
        { phone: "123" }, // Muito curto
        { phone: "123456789012" }, // Muito longo
        { phone: "4799999999A" }, // Com letra
        { phone: "(47) 99999-9999" }, // Com formatação
      ]

      testCases.forEach(({ phone }) => {
        const invalidData = {
          name: "Test Company",
          cnpj: "12345678901234",
          email: "test@company.com",
          phone,
        }

        const result = createCompanySchema.safeParse(invalidData)

        expect(result.success).toBe(false)
      })
    })

    it("should accept valid phone formats", () => {
      const testCases = ["4712345678", "47999999999"]

      testCases.forEach((phone) => {
        const validData = {
          name: "Test Company",
          cnpj: "12345678901234",
          email: "test@company.com",
          phone,
        }

        const result = createCompanySchema.safeParse(validData)

        expect(result.success).toBe(true)
      })
    })
  })

  describe("updateCompanySchema", () => {
    it("should validate partial updates", () => {
      const validData = {
        name: "Updated Name",
      }

      const result = updateCompanySchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it("should allow empty object", () => {
      const result = updateCompanySchema.safeParse({})

      expect(result.success).toBe(true)
    })

    it("should validate all fields when provided", () => {
      const validData = {
        name: "Updated Company",
        cnpj: "98765432109876",
        email: "updated@company.com",
        phone: "47888888888",
        address: "Nova Rua, 456",
      }

      const result = updateCompanySchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it("should fail for invalid fields", () => {
      const invalidData = {
        name: "AB", // Muito curto
      }

      const result = updateCompanySchema.safeParse(invalidData)

      expect(result.success).toBe(false)
    })
  })

  describe("idParamSchema", () => {
    it("should validate valid UUID", () => {
      const validData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
      }

      const result = idParamSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it("should fail for invalid UUID", () => {
      const testCases = [
        { id: "invalid-uuid" },
        { id: "123" },
        { id: "550e8400-e29b-41d4-a716" }, // UUID incompleto
        { id: "" },
      ]

      testCases.forEach(({ id }) => {
        const result = idParamSchema.safeParse({ id })

        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            "Invalid UUID format"
          )
        }
      })
    })
  })
})
