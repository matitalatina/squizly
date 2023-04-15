import {
  Box,
  Center,
  Group,
  MantineTheme,
  Progress,
  useMantineTheme,
  Text,
} from "@mantine/core";
import React, { Reducer, useEffect, useReducer, useState } from "react";
import { Check, FileDownload } from "tabler-icons-react";
import { StateProgress, Video, useCompressManager } from "./compressManager";

type DropStateInitial = {
  state: "INITIAL";
};

type DropStateComplete = {
  state: "COMPLETE";
};

type DropStateProgress = {
  state: "PROGRESS";
  currentVideo: {
    path: string;
    state: StateProgress;
  };
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
    case "INITIAL":
      return theme.colors.blue;
    case "PROGRESS":
      return theme.colors.orange;
    case "COMPLETE":
      return theme.colors.cyan;
    case "INITIAL":
      return theme.colors.blue;
    case "HOVER_ALLOWED":
      return theme.colors.green;
    case "HOVER_FORBIDDEN":
      return theme.colors.red;
  }
};

function renderDrop(accentColors: string[], dropState: DropState) {
  if (dropState.state === "PROGRESS") {
    return <Group direction="column" position="center">
      <Text size="xl" color={accentColors[5]}>
        Working on it...{" "}
      </Text>
      <Progress
        sx={{
          width: 300,
        }}
        value={dropState.currentVideo.state.progress.percent}
        label={`${Math.round(dropState.currentVideo.state.progress.percent)}%`}
        size="xl"
        color={"orange"}
        striped
        animate
      />
    </Group>
  }
  if (dropState.state === "HOVER_FORBIDDEN") {
    return <Group position="center" direction="column">
      <FileDownload size={100} color={accentColors[2]} />
      <Text size="xl" color={accentColors[5]}>
        The file is not a video
      </Text>
    </Group>
  }
  if (dropState.state === "HOVER_ALLOWED") {
    return <Group position="center" direction="column">
      <FileDownload size={100} color={accentColors[2]} />
      <Text size="xl" color={accentColors[5]}>
        Drop it!
      </Text>
    </Group>
  }
  if (dropState.state === "COMPLETE") {
    return <Group position="center" direction="column">
      <Check size={100} color={accentColors[2]} />
      <Text size="xl" color={accentColors[5]}>
        Completed!
      </Text>
    </Group>
  }
  if (dropState.state === "INITIAL") {
    return <Group position="center" direction="column">
      <FileDownload size={100} color={accentColors[2]} />
      <Text size="xl" color={accentColors[5]}>
        Drop the video here
      </Text>
    </Group>;
  }
  return null;
}
export const Drop = ({ className }: { className?: string }) => {
  const [dropState, setDropState] = useState<DropState>({ state: "INITIAL" });
  const { queue, onNewVideos } = useCompressManager();
  const currentVideo: Video | null = queue.find((v) => v.state.state === "PROGRESS") ?? queue.find((v) => v.state.state === "COMPLETE") ?? null;
  useEffect(() => {
    if (currentVideo?.state?.state === "PROGRESS") {
      setDropState({
        state: "PROGRESS",
        currentVideo: {
          path: currentVideo.path,
          state: currentVideo.state,
        },
      });
    } else if (currentVideo?.state?.state === "COMPLETE" && !["HOVER_FORBIDDEN", "HOVER_ALLOWED", "INITIAL"].includes(dropState.state)) {
      setDropState({
        state: "COMPLETE",
      });
    }
  }, [currentVideo]);
  const theme = useMantineTheme();
  const accentColors = colorFromState(theme, dropState);


  return (
    <Box
      className={className}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const newVideos = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("video")).map((f) => f.path);
        if (
          newVideos.length > 0
        ) {
          onNewVideos(newVideos);
        }
      }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDropState({
          state: Array.from(e.dataTransfer.items).findIndex(f => f.type.startsWith("video")) !== -1
            ? "HOVER_ALLOWED"
            : "HOVER_FORBIDDEN",
        });
      }}
      onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDropState({
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
        {/* {JSON.stringify(queue, null, 2)} */}
        {renderDrop(accentColors, dropState)}
      </Center>
    </Box>
  );
};
