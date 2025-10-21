import { Company } from "../entities/Company"
import { ICompanyRepository } from "../ports/ICompanyRepository"
import { AppError } from "../errors/AppError"

export interface CreateCompanyDTO {
  name: string
  cnpj: string
  email: string
  phone?: string
  address?: string
}

export interface UpdateCompanyDTO {
  name?: string
  cnpj?: string
  email?: string
  phone?: string
  address?: string
}

export class CompanyService {
  constructor(private companyRepository: ICompanyRepository) {}

  async create(data: CreateCompanyDTO): Promise<Company> {
    const existingCompany = await this.companyRepository.findByCnpj(data.cnpj)

    if (existingCompany) {
      throw new AppError("Company with this CNPJ already exists", 409)
    }

    const company = new Company(
      "",
      data.name,
      data.cnpj,
      data.email,
      data.phone,
      data.address
    )

    return await this.companyRepository.create(company)
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.findAll()
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companyRepository.findById(id)

    if (!company) {
      throw new AppError("Company not found", 404)
    }

    return company
  }

  async update(id: string, data: UpdateCompanyDTO): Promise<Company> {
    const company = await this.companyRepository.findById(id)

    if (!company) {
      throw new AppError("Company not found", 404)
    }

    if (data.cnpj && data.cnpj !== company.cnpj) {
      const existingCompany = await this.companyRepository.findByCnpj(data.cnpj)
      if (existingCompany) {
        throw new AppError("Company with this CNPJ already exists", 409)
      }
    }

    company.update(data)

    return await this.companyRepository.update(id, company)
  }

  async delete(id: string): Promise<void> {
    const company = await this.companyRepository.findById(id)

    if (!company) {
      throw new AppError("Company not found", 404)
    }

    await this.companyRepository.delete(id)
  }
}
