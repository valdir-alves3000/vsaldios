import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { routes } from "./routes.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());
app.use("/", routes);

export { app };
