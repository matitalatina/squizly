// {"frames":302,"currentFps":57,"currentKbps":553.9,"targetSize":256,"timemark":"00:00:03.78","percent":25.062988993502184}
export interface FfmpegProgress {
  pathIn: string;
  frames: number;
  currentFps: number;
  currentKbps: number;
  targetSize: number;
  timemark: string;
  percent?: number;
}
