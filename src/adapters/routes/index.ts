import { Router } from "express"
import { prisma } from "../databases/prisma"
import { PrismaCompanyRepository } from "../repositories/PrismaCompanyRepository"
import { CompanyService } from "../../core/services/CompanyService"
import { CompanyController } from "../controllers/CompanyController"

const router = Router()

const companyRepository = new PrismaCompanyRepository(prisma)
const companyService = new CompanyService(companyRepository)
const companyController = new CompanyController(companyService)

router.post("/companies", (req, res) => companyController.create(req, res))
router.get("/companies", (req, res) => companyController.getAll(req, res))
router.get("/companies/:id", (req, res) => companyController.getById(req, res))
router.put("/companies/:id", (req, res) => companyController.update(req, res))
router.delete("/companies/:id", (req, res) =>
  companyController.delete(req, res)
)

export { router }
