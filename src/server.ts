import express from "express"
import cors from "cors"
import { router } from "./adapters/routes"
import { errorHandler } from "./adapters/middlewares/errorHandler"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use(router)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
