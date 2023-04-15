import { useEffect, useState } from "react";

type StateInitial = {
  state: "INITIAL";
};

type StateComplete = {
  state: "COMPLETE";
};

export type StateProgress = {
  state: "PROGRESS";
  progress: { percent: number };
  stop: () => void;
};

type State =
  | StateInitial
  | StateComplete
  | StateProgress;

export type Video = {
  path: string;
  state: State;
}


export function useCompressManager() {
  const [queue, setQueue] = useState<Video[]>([]);
  useEffect(() => {
    if (queue.findIndex(v => v.state.state === "PROGRESS") !== -1) {
      return;
    }
    const nextVideo = queue.find(v => v.state.state === "INITIAL");

    if (nextVideo) {
      window.ffmpeg.start(
        nextVideo.path,
        (p, stop) => {
          updateVideoState(nextVideo.path, { state: "PROGRESS", progress: p, stop });
        },
        () => {
          updateVideoState(nextVideo.path, { state: "COMPLETE" });
        },
        () => {
          updateVideoState(nextVideo.path, { state: "COMPLETE" });
        }
      );
    }
  }, [queue]);
  const onNewVideos = (paths: string[]) => {
    setQueue([...queue, ...paths.map(p => ({ path: p, state: { state: "INITIAL" as const } }))]);
  }

  const updateVideoState = (path: string, state: State) => {
    setQueue(queue.map(v => v.path === path ? { ...v, state } : v));
  }

  return {
    queue,
    onNewVideos,
  };
}
