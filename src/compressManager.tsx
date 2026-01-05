import { useCallback, useEffect, useState } from "react";

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

  const videoToProcessCount = getVideoToProcessCount(queue);

  useEffect(() => {
    window.ffmpeg.notifyVideoToProcessCount(videoToProcessCount);
  }, [videoToProcessCount]);

  const updateVideoState = useCallback((path: string, state: State) => {
    setQueue((queue) =>
      queue.map((v) => (v.path === path ? { ...v, state } : v)),
    );
  }, []);

  const processNextVideo = useCallback(() => {
    setQueue((currentQueue) => {
      // Don't start if already processing
      if (currentQueue.some((v) => v.state.state === "PROGRESS")) {
        return currentQueue;
      }

      const nextVideo = currentQueue.find((v) => v.state.state === "INITIAL");
      if (!nextVideo) return currentQueue;

      window.ffmpeg.start(
        nextVideo.path,
        (p) => {
          // Progress callback
          updateVideoState(nextVideo.path, {
            state: "PROGRESS",
            progress: p,
            stop: () => window.ffmpeg.stop(),
          });
        },
        () => {
          // Completion callback
          updateVideoState(nextVideo.path, { state: "COMPLETE" });
          // Process next video after this one completes
          processNextVideo();
        },
        () => {
          // Cancel callback - stop everything
          setQueue((queue) => {
            const newQueue = queue.map((v) =>
              v.path === nextVideo.path
                ? { ...v, state: { state: "CANCEL" as const } }
                : v,
            );
            return newQueue.map((v) =>
              v.state.state === "INITIAL"
                ? { ...v, state: { state: "CANCEL" as const } }
                : v,
            );
          });
        },
      );

      // Update queue to mark video as PROGRESS
      return currentQueue.map((v) =>
        v.path === nextVideo.path
          ? {
              ...v,
              state: {
                state: "PROGRESS" as const,
                progress: { percent: 0 },
                stop: () => window.ffmpeg.stop(),
              },
            }
          : v,
      );
    });
  }, [updateVideoState]);

  const onNewVideos = (paths: string[]): "NO_NEW_VIDEOS" | "NEW_VIDEOS" => {
    const videosPathsAlreadyDone = queue
      .filter((v) => ["PROGRESS", "COMPLETE"].includes(v.state.state))
      .map((v) => v.path);

    const newPaths = paths.filter(
      (p) => videosPathsAlreadyDone.indexOf(p) === -1,
    );

    if (newPaths.length === 0) {
      return "NO_NEW_VIDEOS";
    }

    setQueue((queue) => [
      ...queue.filter(
        (v) => !(v.state.state === "CANCEL" && newPaths.includes(v.path)),
      ),
      ...newPaths.map((p) => ({
        path: p,
        state: { state: "INITIAL" as const },
      })),
    ]);

    // Start processing directly from the event handler
    processNextVideo();

    return "NEW_VIDEOS";
  };

  return {
    queue,
    onNewVideos,
  };
}
