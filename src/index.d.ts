import { FfmpegBridge, ElectronBridge } from "./preload";
declare global {
  interface Window {
    ffmpeg: FfmpegBridge;
    electron: ElectronBridge;
  }
}
