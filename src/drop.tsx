import { Box, Center, Group, MantineTheme, Progress } from "@mantine/core";
import React, { Reducer, useReducer } from "react";

type DropStateInitial = {
  state: "INITIAL";
};

type DropStateComplete = {
  state: "COMPLETE";
};

type DropStateProgress = {
  state: "PROGRESS";
  progress: { percent: number };
};

type DropHoverAllowed = {
  state: "HOVER_ALLOWED";
};

type DropHoverForbidden = {
  state: "HOVER_FORBIDDEN";
};

type DropState =
  | DropStateInitial
  | DropStateComplete
  | DropStateProgress
  | DropHoverAllowed
  | DropHoverForbidden;

export const colorFromState = (theme: MantineTheme, state: DropState) => {
  switch (state.state) {
    case "HOVER_ALLOWED":
      return theme.colors.green;
    case "HOVER_FORBIDDEN":
      return theme.colors.red;
    case "PROGRESS":
      return theme.colors.orange;
    case "COMPLETE":
      return theme.colors.cyan;
    default:
      return theme.colors.blue;
  }
};

export const Drop = ({ className }: { className?: string }) => {
  const [state, dispatch] = useReducer<Reducer<DropState, Partial<DropState>>>(
    (state: DropState, action: DropState) => ({ ...state, ...action }),
    {
      state: "INITIAL",
    }
    // {
    //   state: "PROGRESS",
    //   progress: {
    //     percent: 30,
    //   },
    // }
  );
  return (
    <Box
      className={className}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (
          e.dataTransfer.files[0] &&
          e.dataTransfer.files[0].type.startsWith("video")
        ) {
          window.ffmpeg.start(
            e.dataTransfer.files[0].path,
            (p) => {
              dispatch({
                state: "PROGRESS",
                progress: {
                  percent: Math.max(
                    p.percent,
                    state.state === "PROGRESS" ? state.progress.percent : 0
                  ),
                },
              });
            },
            () => {
              dispatch({ state: "COMPLETE" });
            }
          );
          dispatch({ state: "PROGRESS", progress: { percent: 0 } });
        } else {
          dispatch({ state: "INITIAL" });
        }
        console.log(e);
      }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dispatch({
          state: e.dataTransfer.items[0].type.startsWith("video")
            ? "HOVER_ALLOWED"
            : "HOVER_FORBIDDEN",
        });
      }}
      onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dispatch({
          state: "INITIAL",
        });
      }}
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        transition: "all 300ms ease-out",
        backgroundColor: colorFromState(theme, state)[1],
        padding: 0,
        margin: 0,
      })}
    >
      <Center
        sx={(theme) => ({
          transition: "all 300ms ease-out",
          border: `5px dashed ${colorFromState(theme, state)[2]}`,
          borderRadius: 30,
          padding: 0,
          margin: 10,
          boxSizing: "border-box",
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        })}
      >
        {["INITIAL"].includes(state.state) && "Drop the video here"}
        {state.state === "HOVER_FORBIDDEN" && "The file is not a video"}
        {state.state === "HOVER_ALLOWED" && "Drop it!"}
        {state.state === "PROGRESS" && (
          <Group direction="column" position="center">
            <p>Working on it... </p>
            <Progress
              sx={{
                width: 300,
              }}
              value={state.progress.percent}
              label={`${Math.round(state.progress.percent)}%`}
              size="xl"
              color={"orange"}
              striped
              animate
            />
          </Group>
        )}
        {state.state === "COMPLETE" && <p>Completed!</p>}
      </Center>
    </Box>
  );
};
