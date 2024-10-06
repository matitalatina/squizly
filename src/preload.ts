import { contextBridge, ipcRenderer } from "electron";
import { FfmpegProgress } from "./ffmpeg";
window.addEventListener("DOMContentLoaded", () => {
  console.log("Preload enabled!");
});

export type FfmpegBridge = {
  start: (
    pathIn: string,
    onProgress: (progress: FfmpegProgress) => void,
    onEnd: () => void,
    onError: () => void
  ) => void;
  stop: () => void;
};

const bridge: FfmpegBridge = {
  start: (
    pathIn: string,
    onProgress: (progress: FfmpegProgress) => void,
    onEnd: () => void,
    onError: () => void
  ) => {
    ipcRenderer.send("ffmpeg-start", pathIn);
    ipcRenderer.on("ffmpeg-progress", (_, progress) => {
      if (progress.pathIn === pathIn) {
        onProgress(progress);
      }
    });
    ipcRenderer.on("ffmpeg-end", onEnd);
    ipcRenderer.on("ffmpeg-error", onError);
  },
  stop: () => ipcRenderer.send("ffmpeg-stop"),
};

contextBridge.exposeInMainWorld("ffmpeg", bridge);
