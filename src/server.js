import cors from "cors";
import express from "express";
import { routes } from "./routes.js";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(cors());
app.use("/", routes);

export { app };
