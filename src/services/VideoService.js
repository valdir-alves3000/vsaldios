import fs from "node:fs";
import path from "node:path";
import ytdlp from "yt-dlp-exec";
import { FOLDER } from "../../config.js";

const { exec } = ytdlp;

function generateID() {
  return Math.floor(Math.random() * (99999 - 10000) + 10000);
}

export class VideoService {
  async getVideoInfo(url) {
    try {
      const { stdout } = await exec([url, "--dump-json"]);
      const videoDetails = JSON.parse(stdout);

      const result = {
        formats: videoDetails.formats.map((format) => {
          return {
            abr: format.abr,
            qualityLabel: format.format_note,
            formatID: format.format_id,
            mimeType: format.ext,
            size: format.filesize_approx,
            hasVideo: format.vcodec !== "none",
            hasAudio: format.acodec !== "none",
            url: format.url,
          };
        }),
      };

      const videos = result.formats.filter(
        (format) => format.hasVideo && format.hasAudio
      );

      const audioFormats = ["m4a", "mp3"];

      const audios = result.formats
        .filter(
          ({ hasAudio, hasVideo, mimeType }) =>
            hasAudio && !hasVideo && audioFormats.includes(mimeType)
        )
        .map((format) => ({
          ...format,
          qualityLabel: `${format.abr.toFixed(0)} Kbps`,
        }));

      return {
        description: videoDetails.description,
        iframeUrl: videoDetails.thumbnail,
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

  async downloadVideo(url, formatID) {
    try {
      const { stdout } = await exec([url, "--dump-json"]);
      const videoDetails = JSON.parse(stdout);

      const selectedFormat = videoDetails.formats.find(
        (format) => format.format_id === formatID
      );

      if (!selectedFormat) throw new Error("Format not Found!");

      const videoTitle = videoDetails.title
        .replace(/[^\w\sÀ-ÿ]/gi, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const id = generateID();
      const filename = `${videoTitle}-${id}.${selectedFormat.ext}`;
      const filePath = path.join(FOLDER, filename);

      await exec([url, "-f", `${formatID}`, "-o", filePath]);

      console.log(`Download full video '${filename}'.`);
      return { filename };
    } catch (error) {
      console.error("Error while downloading:", error);
    }
  }

  async deleteFile(fileToDelete) {
    fs.unlink(fileToDelete, (err) => {
      if (err) {
        console.error(err);
        throw new Error("File not found!");
      }
    });
  }

  async checkFileExists(file) {
    return fs.existsSync(file);
  }

  async getMimeType(file) {
    const ext = file.slice(file.lastIndexOf("."));
    switch (ext) {
      case ".mp4":
        return "video/mp4";
      case ".webm":
        return "video/webm";
      default:
        return "audio/mp3";
    }
  }
}
