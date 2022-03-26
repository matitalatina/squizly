import { contextBridge } from "electron";
import Ffmpeg from "fluent-ffmpeg";
import { join } from "path";
import { isProduction } from "./env";
import { ffmpeg } from "./ffmpeg";
window.addEventListener("DOMContentLoaded", () => {
  console.log("Preload enabled!");
  const resourcePath = isProduction()
    ? process.resourcesPath
    : join(__dirname, "../../../resources/mac");
  Ffmpeg.setFfmpegPath(join(resourcePath, "ffmpeg"));
  Ffmpeg.setFfprobePath(join(resourcePath, "ffprobe"));
});

contextBridge.exposeInMainWorld("ffmpeg", ffmpeg);
