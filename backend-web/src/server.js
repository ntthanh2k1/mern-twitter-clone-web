import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoDbConnection from "./db/mongoDbConnection.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // To parse req.body
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(cookieParser()); // To parse cookie

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  mongoDbConnection();
  console.log(`Server is running at http://localhost:${port}`);
});
