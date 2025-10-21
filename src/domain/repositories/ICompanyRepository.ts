import { Company } from "../entities/Company"

export interface ICompanyRepository {
  create(company: Company): Promise<Company>
  findAll(): Promise<Company[]>
  findById(id: string): Promise<Company | null>
  findByCnpj(cnpj: string): Promise<Company | null>
  update(id: string, company: Company): Promise<Company>
  delete(id: string): Promise<void>
}
