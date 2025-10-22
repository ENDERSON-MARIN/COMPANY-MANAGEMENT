import { PrismaClient } from "@prisma/client"
import { Company } from "../../core/entities/Company"
import { ICompanyRepository } from "../../core/ports/ICompanyRepository"

export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private prisma: PrismaClient) {}

  async create(company: Company): Promise<Company> {
    const created = await this.prisma.company.create({
      data: {
        name: company.name,
        cnpj: company.cnpj,
        email: company.email,
        phone: company.phone,
        address: company.address,
      },
    })

    return this.toDomain(created)
  }

  async findAll(): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      orderBy: { createdAt: "desc" },
    })

    return companies.map(this.toDomain)
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    })

    return company ? this.toDomain(company) : null
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { cnpj },
    })

    return company ? this.toDomain(company) : null
  }

  async update(id: string, company: Company): Promise<Company> {
    const updated = await this.prisma.company.update({
      where: { id },
      data: {
        name: company.name,
        cnpj: company.cnpj,
        email: company.email,
        phone: company.phone,
        address: company.address,
      },
    })

    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({
      where: { id },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(data: any): Company {
    return new Company(
      data.id,
      data.name,
      data.cnpj,
      data.email,
      data.phone,
      data.address
    )
  }
}
