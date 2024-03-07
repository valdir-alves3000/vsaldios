import fs from "node:fs";
import path from "node:path";
import ytdl from "ytdl-core";
import { FOLDER } from "../../config.js";

export class VideoService {
  async getVideoInfo(url) {
    try {
      const { formats, videoDetails } = await ytdl.getInfo(url);

      const result = {
        description: videoDetails.description,
        iframeUrl: videoDetails.embed.iframeUrl,
        formats: formats.map((format, index) => {
          const mimeType = format.mimeType.split(";")[0];
          const qualityLabel = format.quality.startsWith("hd")
            ? format.qualityLabel + " HD"
            : format.qualityLabel;

          return {
            qualityLabel,
            indexFormat: index,
            mimeType,
            bitrate: format.bitrate,
            approxDurationMs: format.approxDurationMs,
            hasVideo: format.hasVideo,
            hasAudio: format.hasAudio,
            container: format.container,
            url: format.url,
          };
        }),
      };

      const audios = result.formats.filter(
        (format) => format.hasAudio && !format.hasVideo
      );
      const videos = result.formats.filter(
        (format) => format.hasVideo && format.hasAudio
      );

      return {
        ...result,
        formats: {
          audios,
          videos,
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error("Video não localizado");
    }
  }

  async downloadVideo(url, index) {
    await this.#clearFolderContents();
    try {
      const videoInfo = await ytdl.getInfo(url);
      const videoFormat = videoInfo.formats[index];
      const videoStrem = ytdl(url, {
        quality: videoFormat.quality || "highest",
        format: videoFormat,
      });

      const title = videoInfo.videoDetails.title
        .replace(/[^\w\sÀ-ÿ]/gi, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      const filename = `${title}.${videoFormat.container}`;
      const mimeType = videoFormat.mimeType.split(";")[0];

      const filePath = path.join(FOLDER, filename);
      const video = videoStrem.pipe(fs.createWriteStream(filePath));

      videoStrem.on("end", () => {
        console.log(`Download do vídeo '${filename}' completo.`);
      });

      videoStrem.on("error", (error) => {
        console.error("Ocorreu um erro durante o download:", error);
      });

      return { video, filename, mimeType };
    } catch (error) {
      console.error(error);
    }
  }

  async #clearFolderContents() {
    if (!fs.existsSync(FOLDER)) return this.#createFolder(FOLDER);

    fs.readdir(FOLDER, (err, files) => {
      if (err) console.error(err);
      files.forEach((file) => {
        const fileToDelete = path.join(FOLDER, file);
        fs.unlink(fileToDelete, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
    });
  }

  async #createFolder(folder) {
    fs.mkdir(folder, { recursive: true }, (err) => {
      if (err) console.error(err);
    });
  }

  async checkFileExists(file) {
    return fs.existsSync(file);
  }

  async getMimeType(file) {
    const ext = file.slice(file.lastIndexOf("."));
    switch (ext) {
      case ".mp3":
        return "audio/mp3";
      case ".mp4":
        return "video/mp4";
      case ".webm":
        return "video/webm";
      default:
        return undefined;
    }
  }
}
