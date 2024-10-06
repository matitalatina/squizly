import { FfmpegBridge } from "./preload";
declare global {
  interface Window {
    ffmpeg: FfmpegBridge;
  }
}
