import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { router } from "./adapters/routes"
import { errorHandler } from "./adapters/middlewares/errorHandler"
import { swaggerDocument } from "./config/swagger"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #303b93; }
  `,
    customSiteTitle: "Company API Documentation",
  })
)

// API Routes
app.use("/api", router)

// Error Handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(
    `📚 API Documentation available at http://localhost:${PORT}/api-docs`
  )
})
