import Ffmpeg from "fluent-ffmpeg";
import { shell } from "electron";
import type { FfmpegProgress } from "./ffmpeg.types";

export const ffmpeg = {
  start: (
    pathIn: string,
    onProgress: (progress: FfmpegProgress) => void,
    onEnd: () => void,
    onError: () => void,
  ) => {
    const command = Ffmpeg();
    const pathSplit = pathIn.split(".");
    pathSplit.pop();
    const pathOut = pathSplit.join(".") + "-squizly.mp4";
    const stopCommand = () => command.kill("SIGTERM");
    command
      .input(pathIn)
      .videoCodec("libx264")
      .audioCodec("aac")
      .audioBitrate("128k")
      .addOptions(["-crf 35", "-preset slow"])
      .on("progress", (p) => onProgress({ ...p, pathIn }))
      .on("end", () => {
        shell.showItemInFolder(pathOut);
        onEnd();
      })
      .on("error", onError)
      .saveToFile(pathOut);
    command.ffprobe((err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.info(data);
      }
    });
    return stopCommand;
  },
};
