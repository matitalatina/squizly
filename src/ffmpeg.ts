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
    onProgress: (progress: FfmpegProgress, stop: () => void) => void,
    onEnd: () => void,
    onError: () => void,
  ) => {
    const command = Ffmpeg();
    const pathSplit = pathIn.split(".");
    pathSplit.pop();
    const pathOut = pathSplit.join(".") + "-squizly.mp4";
    const stopCommand = () => command.kill('SIGSTOP');
    command
      .input(pathIn)
      .videoCodec("libx264")
      .audioCodec("aac")
      .audioBitrate("128k")
      .addOptions(["-crf 35", "-preset slow"])
      .on("progress", (p) => onProgress(p, stopCommand))
      .on("end", () => {
        shell.showItemInFolder(pathOut);
        onEnd();
      })
      .on("error", onError)
      .saveToFile(pathOut);
    command.ffprobe((err, data) => {
      if (err) {
        console.error(err)
      } else {
        console.info(data)
      }
    })
    return stopCommand;
  },
};
