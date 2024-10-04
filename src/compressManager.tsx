import { useEffect, useState } from "react";

type StateInitial = {
  state: "INITIAL";
};

type StateComplete = {
  state: "COMPLETE";
};

type StateCancel = {
  state: "CANCEL";
};

export type StateProgress = {
  state: "PROGRESS";
  progress: { percent: number };
  stop: () => void;
};

type State = StateInitial | StateComplete | StateProgress | StateCancel;

export type Video = {
  path: string;
  state: State;
};

export function useCompressManager() {
  const [queue, setQueue] = useState<Video[]>([]);
  useEffect(() => {
    if (queue.findIndex((v) => v.state.state === "PROGRESS") !== -1) {
      return;
    }
    const nextVideo = queue.find((v) => v.state.state === "INITIAL");

    if (nextVideo) {
      window.ffmpeg.start(
        nextVideo.path,
        (p, stop) => {
          updateVideoState(nextVideo.path, {
            state: "PROGRESS",
            progress: p,
            stop,
          });
        },
        () => {
          updateVideoState(nextVideo.path, { state: "COMPLETE" });
        },
        () => {
          // Stop everything
          setQueue((queue) => {
            const newQueue = queue.map((v) =>
              v.path === nextVideo.path
                ? { ...v, state: { state: "CANCEL" as const } }
                : v
            );
            return newQueue.map((v) =>
              v.state.state === "INITIAL"
                ? { ...v, state: { state: "CANCEL" as const } }
                : v
            );
          });
        }
      );
    }
  }, [queue]);
  const onNewVideos = (paths: string[]) => {
    setQueue((queue) => {
      const videosPathsAlreadyDone = queue
        .filter((v) => ["PROGRESS", "COMPLETED"].includes(v.state.state))
        .map((v) => v.path);
      const newPaths = paths.filter(
        (p) => videosPathsAlreadyDone.indexOf(p) === -1
      );

      return [
        ...queue.filter(
          (v) => !(v.state.state === "CANCEL" && newPaths.includes(v.path))
        ),
        ...newPaths.map((p) => ({
          path: p,
          state: { state: "INITIAL" as const },
        })),
      ];
    });
  };

  const updateVideoState = (path: string, state: State) => {
    setQueue((queue) =>
      queue.map((v) => (v.path === path ? { ...v, state } : v))
    );
  };

  return {
    queue,
    onNewVideos,
  };
}
