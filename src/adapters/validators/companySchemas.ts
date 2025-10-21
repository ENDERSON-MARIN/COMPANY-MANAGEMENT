import { z } from "zod"

const cnpjRegex = /^\d{14}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\d{10,11}$/

export const createCompanySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  cnpj: z.string().regex(cnpjRegex, "CNPJ must have 14 digits"),
  email: z.string().regex(emailRegex, "Invalid email format"),
  phone: z
    .string()
    .regex(phoneRegex, "Phone must have 10 or 11 digits")
    .optional(),
  address: z.string().max(255).optional(),
})

export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(255)
    .optional(),
  cnpj: z.string().regex(cnpjRegex, "CNPJ must have 14 digits").optional(),
  email: z.string().regex(emailRegex, "Invalid email format").optional(),
  phone: z
    .string()
    .regex(phoneRegex, "Phone must have 10 or 11 digits")
    .optional(),
  address: z.string().max(255).optional(),
})

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
})
