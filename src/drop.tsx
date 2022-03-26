import React, { useReducer, useState } from "react";
import { FfmpegProgress } from "./ffmpeg";

type DropStateInitial = {
  state: "INITIAL" | "COMPLETE";
};

type DropStateProgress = {
  state: "PROGRESS";
  progress: FfmpegProgress;
};

type DropState = DropStateInitial | DropStateProgress;

export const Drop = ({ className }: { className?: string }) => {
  const [state, dispatch] = useReducer(
    (state: DropState, action: Partial<DropState>) => ({ ...state, ...action }),
    {
      state: "INITIAL",
    }
  );
  return (
    <h1
      className={className}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) {
          window.ffmpeg.start(
            e.dataTransfer.files[0].path,
            (p) => dispatch({ state: "PROGRESS", progress: p }),
            () => dispatch({ state: "COMPLETE" })
          );
        }
        console.log(e);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      DROPPPPP2!
      {state.state === "PROGRESS" && <p>Progress: {state.progress.percent}</p>}
      {state.state === "COMPLETE" && <p>Completed!</p>}
    </h1>
  );
};
