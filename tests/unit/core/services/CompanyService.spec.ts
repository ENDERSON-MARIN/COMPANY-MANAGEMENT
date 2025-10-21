import { describe, it, expect, beforeEach, vi } from "vitest"
import { CompanyService } from "@/core/services/CompanyService"
import { ICompanyRepository } from "@/core/ports/ICompanyRepository"
import { Company } from "@/core/entities/Company"
import { AppError } from "@/core/errors/AppError"

// Mock do repositório
const mockRepository: ICompanyRepository = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  findByCnpj: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

describe("CompanyService", () => {
  let service: CompanyService

  beforeEach(() => {
    service = new CompanyService(mockRepository)
    vi.clearAllMocks()
  })

  describe("create", () => {
    it("should create a new company", async () => {
      const createDTO = {
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
      }

      const createdCompany = new Company(
        "123",
        createDTO.name,
        createDTO.cnpj,
        createDTO.email
      )

      vi.mocked(mockRepository.findByCnpj).mockResolvedValue(null)
      vi.mocked(mockRepository.create).mockResolvedValue(createdCompany)

      const result = await service.create(createDTO)

      expect(mockRepository.findByCnpj).toHaveBeenCalledWith(createDTO.cnpj)
      expect(mockRepository.create).toHaveBeenCalled()
      expect(result).toEqual(createdCompany)
    })

    it("should throw error if CNPJ already exists", async () => {
      const createDTO = {
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
      }

      const existingCompany = new Company(
        "456",
        "Existing Company",
        createDTO.cnpj,
        "existing@company.com"
      )

      vi.mocked(mockRepository.findByCnpj).mockResolvedValue(existingCompany)

      await expect(service.create(createDTO)).rejects.toThrow(AppError)
      await expect(service.create(createDTO)).rejects.toThrow(
        `Company with this CNPJ ${createDTO.cnpj} already exists`
      )
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it("should create company with all optional fields", async () => {
      const createDTO = {
        name: "Test Company",
        cnpj: "12345678901234",
        email: "test@company.com",
        phone: "47999999999",
        address: "Rua Teste, 123",
      }

      const createdCompany = new Company(
        "123",
        createDTO.name,
        createDTO.cnpj,
        createDTO.email,
        createDTO.phone,
        createDTO.address
      )

      vi.mocked(mockRepository.findByCnpj).mockResolvedValue(null)
      vi.mocked(mockRepository.create).mockResolvedValue(createdCompany)

      const result = await service.create(createDTO)

      expect(result.phone).toBe(createDTO.phone)
      expect(result.address).toBe(createDTO.address)
    })
  })

  describe("findAll", () => {
    it("should return all companies", async () => {
      const companies = [
        new Company("1", "Company 1", "11111111111111", "company1@test.com"),
        new Company("2", "Company 2", "22222222222222", "company2@test.com"),
      ]

      vi.mocked(mockRepository.findAll).mockResolvedValue(companies)

      const result = await service.findAll()

      expect(mockRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(companies)
      expect(result).toHaveLength(2)
    })

    it("should return empty array when no companies exist", async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
    })
  })

  describe("findById", () => {
    it("should return a company by id", async () => {
      const company = new Company(
        "123",
        "Test Company",
        "12345678901234",
        "test@company.com"
      )

      vi.mocked(mockRepository.findById).mockResolvedValue(company)

      const result = await service.findById("123")

      expect(mockRepository.findById).toHaveBeenCalledWith("123")
      expect(result).toEqual(company)
    })

    it("should throw error if company not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      await expect(service.findById("999")).rejects.toThrow(AppError)
      await expect(service.findById("999")).rejects.toThrow("Company not found")
    })
  })

  describe("update", () => {
    it("should update a company", async () => {
      const existingCompany = new Company(
        "123",
        "Old Name",
        "12345678901234",
        "old@company.com"
      )

      const updateDTO = {
        name: "New Name",
        email: "new@company.com",
      }

      const updatedCompany = new Company(
        "123",
        updateDTO.name,
        "12345678901234",
        updateDTO.email
      )

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCompany)
      vi.mocked(mockRepository.update).mockResolvedValue(updatedCompany)

      const result = await service.update("123", updateDTO)

      expect(mockRepository.findById).toHaveBeenCalledWith("123")
      expect(mockRepository.update).toHaveBeenCalledWith("123", existingCompany)
      expect(result.name).toBe(updateDTO.name)
      expect(result.email).toBe(updateDTO.email)
    })

    it("should throw error if company not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      await expect(service.update("999", { name: "New Name" })).rejects.toThrow(
        AppError
      )
    })

    it("should throw error if updating to existing CNPJ", async () => {
      const existingCompany = new Company(
        "123",
        "Company 1",
        "11111111111111",
        "company1@test.com"
      )

      const otherCompany = new Company(
        "456",
        "Company 2",
        "22222222222222",
        "company2@test.com"
      )

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCompany)
      vi.mocked(mockRepository.findByCnpj).mockResolvedValue(otherCompany)

      await expect(
        service.update("123", { cnpj: "22222222222222" })
      ).rejects.toThrow(
        `Company with this CNPJ ${otherCompany.cnpj} already exists`
      )
    })

    it("should allow updating to same CNPJ", async () => {
      const existingCompany = new Company(
        "123",
        "Test Company",
        "12345678901234",
        "test@company.com"
      )

      const updatedCompany = new Company(
        "123",
        "Updated Name",
        "12345678901234",
        "test@company.com"
      )

      vi.mocked(mockRepository.findById).mockResolvedValue(existingCompany)
      vi.mocked(mockRepository.update).mockResolvedValue(updatedCompany)

      const result = await service.update("123", {
        name: "Updated Name",
        cnpj: "12345678901234",
      })

      expect(result.name).toBe("Updated Name")
      expect(mockRepository.findByCnpj).not.toHaveBeenCalled()
    })
  })

  describe("delete", () => {
    it("should delete a company", async () => {
      const company = new Company(
        "123",
        "Test Company",
        "12345678901234",
        "test@company.com"
      )

      vi.mocked(mockRepository.findById).mockResolvedValue(company)
      vi.mocked(mockRepository.delete).mockResolvedValue()

      await service.delete("123")

      expect(mockRepository.findById).toHaveBeenCalledWith("123")
      expect(mockRepository.delete).toHaveBeenCalledWith("123")
    })

    it("should throw error if company not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null)

      await expect(service.delete("999")).rejects.toThrow(AppError)
      await expect(service.delete("999")).rejects.toThrow("Company not found")
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })
  })
})
