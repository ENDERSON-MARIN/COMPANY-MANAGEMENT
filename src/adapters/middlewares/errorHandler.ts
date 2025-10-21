import { Request, Response } from "express"
import { AppError } from "../../core/errors/AppError"

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response
): Response => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    })
  }

  console.error("Internal server error:", err)

  return res.status(500).json({
    error: "Internal server error",
  })
}
