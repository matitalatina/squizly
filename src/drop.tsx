import {
  Box,
  Center,
  Group,
  MantineTheme,
  Progress,
  useMantineTheme,
  Text,
} from "@mantine/core";
import React, { Reducer, useReducer } from "react";
import { Check, FileDownload } from "tabler-icons-react";

type DropStateInitial = {
  state: "INITIAL";
};

type DropStateComplete = {
  state: "COMPLETE";
};

type DropStateProgress = {
  state: "PROGRESS";
  progress: { percent: number };
  stop: () => void;
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
  const theme = useMantineTheme();
  const accentColors = colorFromState(theme, state);
  return (
    <Box
      className={className}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (
          e.dataTransfer.files[0] &&
          e.dataTransfer.files[0].type.startsWith("video")
        ) {
          const stop = window.ffmpeg.start(
            e.dataTransfer.files[0].path,
            (p, stop) => {
              dispatch({
                state: "PROGRESS",
                progress: p,
                stop
              });
            },
            () => {
              dispatch({ state: "COMPLETE" });
            },
            () => {
              dispatch({ state: "COMPLETE" });
            }
          );
          dispatch({ state: "PROGRESS", progress: { percent: 0 }, stop });
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
        backgroundColor: accentColors[1],
        padding: 0,
        margin: 0,
      })}
    >
      <Center
        sx={(theme) => ({
          transition: "all 300ms ease-out",
          border: `5px dashed ${accentColors[2]}`,
          borderRadius: 30,
          padding: 0,
          margin: 10,
          boxSizing: "border-box",
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          pointerEvents: "none",
        })}
      >
        {["INITIAL"].includes(state.state) && (
          <Group position="center" direction="column">
            <FileDownload size={100} color={accentColors[2]} />
            <Text size="xl" color={accentColors[5]}>
              Drop the video here
            </Text>
          </Group>
        )}
        {state.state === "HOVER_FORBIDDEN" && (
          <Group position="center" direction="column">
            <FileDownload size={100} color={accentColors[2]} />
            <Text size="xl" color={accentColors[5]}>
              The file is not a video
            </Text>
          </Group>
        )}
        {state.state === "HOVER_ALLOWED" && (
          <Group position="center" direction="column">
            <FileDownload size={100} color={accentColors[2]} />
            <Text size="xl" color={accentColors[5]}>
              Drop it!
            </Text>
          </Group>
        )}
        {state.state === "PROGRESS" && (
          <Group direction="column" position="center">
            <Text size="xl" color={accentColors[5]}>
              Working on it...{" "}
            </Text>
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
        {state.state === "COMPLETE" && (
          <Group position="center" direction="column">
            <Check size={100} color={accentColors[2]} />
            <Text size="xl" color={accentColors[5]}>
              Completed!
            </Text>
          </Group>
        )}
      </Center>
    </Box>
  );
};
