import Ffmpeg from "fluent-ffmpeg";
import { shell } from "electron";

// {"frames":302,"currentFps":57,"currentKbps":553.9,"targetSize":256,"timemark":"00:00:03.78","percent":25.062988993502184}
export interface FfmpegProgress {
  frames: number;
  currentFps: number;
  currentKbps: number;
  targetSize: number;
  timemark: string;
  percent: number;
}
export const ffmpeg = {
  start: (
    pathIn: string,
    onProgress: (progress: FfmpegProgress) => void,
    onEnd: () => void
  ) => {
    const command = Ffmpeg();
    const pathSplit = pathIn.split(".");
    const extension = pathSplit.pop();
    const pathOut = pathSplit.join(".") + "-squizly." + extension;
    command
      .input(pathIn)
      .videoCodec("libx264")
      .audioCodec("aac")
      .audioBitrate("128k")
      .addOptions(["-crf 35", "-preset slow"])
      .on("progress", onProgress)
      .on("end", () => {
        shell.showItemInFolder(pathOut);
        onEnd();
      })
      .saveToFile(pathOut);
  },
};
