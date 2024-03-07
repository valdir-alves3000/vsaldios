import fs from "node:fs";
import path from "path";
import ytdl from "ytdl-core";
import { FOLDER } from "../../config.js";
import { VideoService } from "../services/VideoService.js";

export class VideoController {
  async getInfo(req, res) {
    const videoService = new VideoService();
    const { url } = req.query;
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json("URL inválida");
    }

    try {
      const info = await videoService.getVideoInfo(url);
      res.json(info);
    } catch (error) {
      console.error("Erro na busca de informações sobre o vídeo", error);
      res.status(500).json({ error: error.message });
    }
  }

  async download(req, res) {
    const videoService = new VideoService();
    const { url, format } = req.query;

    if (!ytdl.validateURL(url) || !format)
      return res.status(400).json({ error: "Url and format required" });

    try {
      const { video, filename, mimeType } = await videoService.downloadVideo(
        url,
        format
      );

      const videoPath = path.join(FOLDER, filename);
      video.on("finish", () => {
        const videoStream = fs.createReadStream(videoPath);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
        res.writeHead(200, { "Content-Type": mimeType });
        videoStream.pipe(res);
      });
    } catch (error) {
      console.error("Erro no download do vídeo", error);
      res.status(500).json(error.message);
    }
  }

  async video(req, res) {
    const videoService = new VideoService();
    fs.readdir(FOLDER, (err, files) => {
      if (err) console.error(err);
      if (files.length < 1)
        return res.status(400).json({ message: "No media files found" });

      files.forEach(async (file) => {
        const videoPath = path.join(FOLDER, file);
        const mimeType = await videoService.getMimeType(file);
        if (!mimeType)
          return res.status(400).json({ message: "No media files found" });

        // res.setHeader("Content-Disposition", `attachment; filename=${file}`);
        res.setHeader("Content-Type", `${mimeType}`);
        res.sendFile(videoPath);
        return;
      });
    });
  }
}
