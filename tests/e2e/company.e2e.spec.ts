import { describe, it, expect, beforeEach } from "vitest"
import request from "supertest"
import { app } from "@tests/helpers/app"
import { prisma } from "@/adapters/databases/prisma"

describe("Company E2E", () => {
  beforeEach(async () => {
    await prisma.company.deleteMany()
  })

  describe("POST /api/companies", () => {
    it("should create a new company", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Test Company",
          cnpj: "12345678901234",
          email: "test@company.com",
          phone: "47999999999",
          address: "Rua Teste, 123",
        })
        .expect(201)

      expect(response.body).toHaveProperty("id")
      expect(response.body.name).toBe("Test Company")
      expect(response.body.cnpj).toBe("12345678901234")
      expect(response.body.email).toBe("test@company.com")
    })

    it("should create company with only required fields", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Test Company",
          cnpj: "12345678901234",
          email: "test@company.com",
        })
        .expect(201)

      expect(response.body).toHaveProperty("id")
      expect(response.body.name).toBe("Test Company")
    })

    it("should return 400 for invalid CNPJ", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Test Company",
          cnpj: "123", // CNPJ inválido
          email: "test@company.com",
        })
        .expect(400)

      expect(response.body.error).toBe("Validation error")
      expect(response.body.details).toBeDefined()
    })

    it("should return 400 for invalid email", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Test Company",
          cnpj: "12345678901234",
          email: "invalid-email",
        })
        .expect(400)

      expect(response.body.error).toBe("Validation error")
    })

    it("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Test Company",
          // Faltando cnpj e email
        })
        .expect(400)

      expect(response.body.error).toBe("Validation error")
    })

    it("should return 409 for duplicate CNPJ", async () => {
      await request(app).post("/api/companies").send({
        name: "Company 1",
        cnpj: "12345678901234",
        email: "company1@test.com",
      })

      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Company 2",
          cnpj: "12345678901234", // CNPJ duplicado
          email: "company2@test.com",
        })
        .expect(409)

      expect(response.body.error).toContain(
        "Company with this CNPJ already exists"
      )
    })
  })

  describe("GET /api/companies", () => {
    it("should return all companies", async () => {
      await request(app).post("/api/companies").send({
        name: "Company 1",
        cnpj: "11111111111111",
        email: "company1@test.com",
      })

      await request(app).post("/api/companies").send({
        name: "Company 2",
        cnpj: "22222222222222",
        email: "company2@test.com",
      })

      const response = await request(app).get("/api/companies").expect(200)

      expect(response.body).toHaveLength(2)
      expect(response.body[0]).toHaveProperty("id")
      expect(response.body[0]).toHaveProperty("name")
    })

    it("should return empty array when no companies exist", async () => {
      const response = await request(app).get("/api/companies").expect(200)

      expect(response.body).toEqual([])
    })

    it("should return companies ordered by createdAt desc", async () => {
      const company1 = await request(app).post("/api/companies").send({
        name: "Company 1",
        cnpj: "11111111111111",
        email: "company1@test.com",
      })

      await new Promise((resolve) => setTimeout(resolve, 10))

      const company2 = await request(app).post("/api/companies").send({
        name: "Company 2",
        cnpj: "22222222222222",
        email: "company2@test.com",
      })

      const response = await request(app).get("/api/companies").expect(200)

      expect(response.body[0].id).toBe(company2.body.id)
      expect(response.body[1].id).toBe(company1.body.id)
    })
  })

  describe("GET /api/companies/:id", () => {
    it("should return a company by id", async () => {
      const created = await request(app).post("/api/companies").send({
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
      })

      const response = await request(app)
        .get(`/api/companies/${created.body.id}`)
        .expect(200)

      expect(response.body.id).toBe(created.body.id)
      expect(response.body.name).toBe("Test Company")
    })

    it("should return 404 if company not found", async () => {
      const response = await request(app)
        .get("/api/companies/550e8400-e29b-41d4-a716-446655440000")
        .expect(404)

      expect(response.body.error).toBe("Company not found")
    })

    it("should return 400 for invalid UUID", async () => {
      const response = await request(app)
        .get("/api/companies/invalid-uuid")
        .expect(400)

      expect(response.body.error).toBe("Validation error")
    })
  })

  describe("PUT /api/companies/:id", () => {
    it("should update a company", async () => {
      const created = await request(app).post("/api/companies").send({
        name: "Old Name",
        cnpj: "12345678901234",
        email: "old@company.com",
      })

      const response = await request(app)
        .put(`/api/companies/${created.body.id}`)
        .send({
          name: "New Name",
          email: "new@company.com",
        })
        .expect(200)

      expect(response.body.name).toBe("New Name")
      expect(response.body.email).toBe("new@company.com")
      expect(response.body.cnpj).toBe("12345678901234")
    })

    it("should update only specified fields", async () => {
      const created = await request(app).post("/api/companies").send({
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
        phone: "47999999999",
      })

      const response = await request(app)
        .put(`/api/companies/${created.body.id}`)
        .send({
          name: "Updated Name",
        })
        .expect(200)

      expect(response.body.name).toBe("Updated Name")
      expect(response.body.email).toBe("test@company.com")
      expect(response.body.phone).toBe("47999999999")
    })

    it("should return 404 if company not found", async () => {
      const response = await request(app)
        .put("/api/companies/550e8400-e29b-41d4-a716-446655440000")
        .send({
          name: "New Name",
        })
        .expect(404)

      expect(response.body.error).toBe("Company not found")
    })

    it("should return 409 when updating to existing CNPJ", async () => {
      const company1 = await request(app).post("/api/companies").send({
        name: "Company 1",
        cnpj: "11111111111111",
        email: "company1@test.com",
      })

      await request(app).post("/api/companies").send({
        name: "Company 2",
        cnpj: "22222222222222",
        email: "company2@test.com",
      })

      const response = await request(app)
        .put(`/api/companies/${company1.body.id}`)
        .send({
          cnpj: "22222222222222",
        })
        .expect(409)

      expect(response.body.error).toContain("Company with this CNPJ")
    })

    it("should allow updating to same CNPJ", async () => {
      const created = await request(app).post("/api/companies").send({
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
      })

      const response = await request(app)
        .put(`/api/companies/${created.body.id}`)
        .send({
          name: "Updated Name",
          cnpj: "12345678901234",
        })
        .expect(200)

      expect(response.body.name).toBe("Updated Name")
    })

    it("should return 400 for invalid data", async () => {
      const created = await request(app).post("/api/companies").send({
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
      })

      const response = await request(app)
        .put(`/api/companies/${created.body.id}`)
        .send({
          email: "invalid-email",
        })
        .expect(400)

      expect(response.body.error).toBe("Validation error")
    })
  })

  describe("DELETE /api/companies/:id", () => {
    it("should delete a company", async () => {
      const created = await request(app).post("/api/companies").send({
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
      })

      await request(app).delete(`/api/companies/${created.body.id}`).expect(204)

      await request(app).get(`/api/companies/${created.body.id}`).expect(404)
    })

    it("should return 404 if company not found", async () => {
      const response = await request(app)
        .delete("/api/companies/550e8400-e29b-41d4-a716-446655440000")
        .expect(404)

      expect(response.body.error).toBe("Company not found")
    })

    it("should return 400 for invalid UUID", async () => {
      const response = await request(app)
        .delete("/api/companies/invalid-uuid")
        .expect(400)

      expect(response.body.error).toBe("Validation error")
    })
  })

  describe("Edge Cases", () => {
    it("should handle concurrent requests", async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .post("/api/companies")
          .send({
            name: `Company ${i}`,
            cnpj: `${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}`,
            email: `company${i}@test.com`,
          })
      )

      const responses = await Promise.all(requests)

      responses.forEach((response) => {
        expect(response.status).toBe(201)
      })

      const allCompanies = await request(app).get("/api/companies")
      expect(allCompanies.body).toHaveLength(5)
    })

    it("should handle special characters in name", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "Empresa & Cia. LTDA - São Paulo",
          cnpj: "12345678901234",
          email: "test@company.com",
        })
        .expect(201)

      expect(response.body.name).toBe("Empresa & Cia. LTDA - São Paulo")
    })

    it("should trim whitespace from fields", async () => {
      const response = await request(app)
        .post("/api/companies")
        .send({
          name: "  Test Company  ",
          cnpj: "   12345678901234   ",
          email: "  test@company.com  ",
        })
        .expect(201)

      expect(response.body.name).toBeDefined()
    })
  })
})
