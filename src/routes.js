import express from "express";
import { VideoController } from "./controllers/VideoController.js";

const routes = express.Router();
const videoController = new VideoController();

routes.get("/video", videoController.video);
routes.get("/info", videoController.getInfo);
routes.get("/download", videoController.download);

export { routes };
