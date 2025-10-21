import { Request, Response } from "express"
import { CompanyService } from "../../core/services/CompanyService"
import { ZodError } from "zod"
import {
  createCompanySchema,
  updateCompanySchema,
  idParamSchema,
} from "../validators/companySchemas"

export class CompanyController {
  constructor(private companyService: CompanyService) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = createCompanySchema.parse(req.body)
      const company = await this.companyService.create(data)
      return res.status(201).json(company)
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues,
        })
      }
      throw error
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const companies = await this.companyService.findAll()
    return res.status(200).json(companies)
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = idParamSchema.parse(req.params)
      const company = await this.companyService.findById(id)
      return res.status(200).json(company)
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues,
        })
      }
      throw error
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = idParamSchema.parse(req.params)
      const data = updateCompanySchema.parse(req.body)
      const company = await this.companyService.update(id, data)
      return res.status(200).json(company)
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues,
        })
      }
      throw error
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = idParamSchema.parse(req.params)
      await this.companyService.delete(id)
      return res.status(204).send()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues,
        })
      }
      throw error
    }
  }
}
