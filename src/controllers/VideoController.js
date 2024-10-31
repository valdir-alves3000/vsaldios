import path from "path";
import { FOLDER } from "../../config.js";
import { VideoService } from "../services/VideoService.js";

function isYouTubeUrl(url) {
  let youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  return youtubeRegex.test(url);
}

export class VideoController {
  async getInfo(req, res) {
    const videoService = new VideoService();
    const { url } = req.query;
    if (!url || !isYouTubeUrl(url)) {
      return res.status(400).json("URL inválida");
    }

    try {
      const info = await videoService.getVideoInfo(url);
      res.json(info);
    } catch (error) {
      console.error("Error searching for video information", error);
      res.status(500).json({ error: error.message });
    }
  }

  async download(req, res) {
    const videoService = new VideoService();
    const { url, format } = req.query;

    if (!isYouTubeUrl(url) || !format)
      return res.status(400).json({ error: "Url and format required" });

    try {
      const { filename } = await videoService.downloadVideo(url, format);

      return res.status(200).json({ message: "Download full video", filename });
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  }

  async video(req, res) {
    const videoService = new VideoService();
    const { filename } = req.query;

    if (!filename) return res.status(400).json({ message: "Media not found!" });

    const filePath = path.join(FOLDER, filename);
    const fileExists = await videoService.checkFileExists(filePath);

    if (!fileExists)
      return res.status(400).json({ message: "Media not found!" });

    const mimeType = await videoService.getMimeType(filename);
    if (!mimeType) return res.status(400).json({ message: "Media not found!" });

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", `${mimeType}`);
    res.sendFile(filePath, async (sendFileErr) => {
      if (sendFileErr) {
        return console.error("Error sending file:", sendFileErr);
      }

      await videoService.deleteFile(filePath);
    });
  }
}
