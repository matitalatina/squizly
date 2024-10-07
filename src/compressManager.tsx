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
  progress: { percent?: number };
  videoToProcessCount: number;
  stop: () => void;
};

type State = StateInitial | StateComplete | StateProgress | StateCancel;

export type Video = {
  path: string;
  state: State;
};

export function getVideoToProcessCount(queue: Video[]): number {
  return queue.filter((v) => ["INITIAL", "PROGRESS"].includes(v.state.state))
    .length;
}

export function useCompressManager() {
  const [queue, setQueue] = useState<Video[]>([]);
  useEffect(() => {
    if (queue.findIndex((v) => v.state.state === "PROGRESS") !== -1) {
      return;
    }
    const nextVideo = queue.find((v) => v.state.state === "INITIAL");
    const videoToProcessCount = getVideoToProcessCount(queue);
    if (nextVideo) {
      window.ffmpeg.start(
        nextVideo.path,
        (p) => {
          updateVideoState(nextVideo.path, {
            state: "PROGRESS",
            progress: p,
            videoToProcessCount,
            stop: () => window.ffmpeg.stop(),
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
    window.ffmpeg.notifyVideoToProcessCount(videoToProcessCount);
  }, [queue]);
  const onNewVideos = (paths: string[]): "NO_NEW_VIDEOS" | "NEW_VIDEOS" => {
    const videosPathsAlreadyDone = queue
      .filter((v) => ["PROGRESS", "COMPLETE"].includes(v.state.state))
      .map((v) => v.path);

    const newPaths = paths.filter(
      (p) => videosPathsAlreadyDone.indexOf(p) === -1
    );

    setQueue((queue) => {
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
    return newPaths.length === 0 ? "NO_NEW_VIDEOS" : "NEW_VIDEOS";
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
