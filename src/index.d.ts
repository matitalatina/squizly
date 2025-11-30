import { FfmpegBridge } from "./preload";
declare global {
  interface Window {
    ffmpeg: FfmpegBridge;
  }
  // Electron extends the File interface with a path property
  interface File {
    path: string;
  }
}
