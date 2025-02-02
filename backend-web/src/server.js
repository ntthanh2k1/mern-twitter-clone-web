import express from "express";
import dotenv from "dotenv";
import mongoDbConnection from "./db/mongoDbConnection.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // To parse req.body

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  mongoDbConnection();
  console.log(`Server is running at http://localhost:${port}`);
});
