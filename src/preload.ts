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
  notifyVideoToProcessCount: (count: number) => void;
};

const bridge: FfmpegBridge = {
  start: (
    pathIn: string,
    onProgress: (progress: FfmpegProgress) => void,
    onEnd: () => void,
    onError: () => void
  ) => {
    const progressListener = (
      _: Electron.IpcRendererEvent,
      progress: FfmpegProgress
    ) => {
      if (progress.pathIn === pathIn) {
        onProgress(progress);
      }
    };
    ipcRenderer.send("ffmpeg-start", pathIn);
    ipcRenderer.on("ffmpeg-progress", progressListener);
    ipcRenderer.once("ffmpeg-end", () => {
      ipcRenderer.off("ffmpeg-progress", progressListener);
      onEnd();
    });
    ipcRenderer.once("ffmpeg-error", () => {
      ipcRenderer.off("ffmpeg-progress", progressListener);
      onError();
    });
  },
  stop: () => ipcRenderer.send("ffmpeg-stop"),
  notifyVideoToProcessCount: (count: number) =>
    ipcRenderer.send("video-to-process-count", count),
};

contextBridge.exposeInMainWorld("ffmpeg", bridge);
