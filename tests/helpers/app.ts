import express from "express"
import cors from "cors"
import { router } from "@/adapters/routes"
import { errorHandler } from "@/adapters/middlewares/errorHandler"

export const app = express()

app.use(cors())
app.use(express.json())
app.use("/api", router)
app.use(errorHandler)
