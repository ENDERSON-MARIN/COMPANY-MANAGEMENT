export class Company {
  constructor(
    public readonly id: string,
    public name: string,
    public cnpj: string,
    public email: string,
    public phone?: string,
    public address?: string,

    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  public update(
    data: Partial<Omit<Company, "id" | "createdAt" | "updatedAt">>
  ): void {
    if (data.name) this.name = data.name
    if (data.cnpj) this.cnpj = data.cnpj
    if (data.email) this.email = data.email
    if (data.phone !== undefined) this.phone = data.phone
    if (data.address !== undefined) this.address = data.address
  }
}
