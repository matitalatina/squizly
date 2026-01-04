import { contextBridge, ipcRenderer, webUtils } from "electron";
import type { FfmpegProgress } from "./ffmpeg";

window.addEventListener("DOMContentLoaded", () => {
  console.log("Preload enabled!");
});

export type FfmpegBridge = {
  start: (
    pathIn: string,
    onProgress: (progress: FfmpegProgress) => void,
    onEnd: () => void,
    onError: () => void,
  ) => void;
  stop: () => void;
  notifyVideoToProcessCount: (count: number) => void;
};

export type ElectronBridge = {
  getPathForFile: (file: File) => string;
};

const bridge: FfmpegBridge = {
  start: (
    pathIn: string,
    onProgress: (progress: FfmpegProgress) => void,
    onEnd: () => void,
    onError: () => void,
  ) => {
    const progressListener = (
      _: Electron.IpcRendererEvent,
      progress: FfmpegProgress,
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

const electronBridge: ElectronBridge = {
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
};

contextBridge.exposeInMainWorld("ffmpeg", bridge);
contextBridge.exposeInMainWorld("electronUtils", electronBridge);

declare global {
  interface Window {
    ffmpeg: FfmpegBridge;
    electronUtils: ElectronBridge;
  }
}
