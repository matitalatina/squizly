import {
  Box,
  Center,
  Group,
  MantineTheme,
  Progress,
  useMantineTheme,
  Text,
  RingProgress,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Check, FileDownload, X } from "tabler-icons-react";
import { StateProgress, Video, useCompressManager } from "./compressManager";
import { useHover } from "@mantine/hooks";
import { ProgressLabel } from "./progressLabel";

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

function renderDrop(accentColors: string[], dropState: DropState, videoToProcess: number) {

  if (dropState.state === "PROGRESS") {
    const percent = Math.round(dropState.currentVideo.state.progress.percent) || 0;
    return <Stack align="center">
      <Text size="xl" color={accentColors[5]}>
        Videos to process: {videoToProcess}
      </Text>
      <RingProgress
        size={140}
        roundCaps
        rootColor={accentColors[2]}
        sections={[{ value: percent, color: accentColors[5] }]}
        label={<ProgressLabel color={accentColors[5]} onStop={dropState.currentVideo.state.stop} percent={percent} />} />
    </Stack>
  }
  if (dropState.state === "HOVER_FORBIDDEN") {
    return <Stack align="center">
      <FileDownload size={100} color={accentColors[2]} />
      <Text size="xl" color={accentColors[5]}>
        The file is not a video
      </Text>
    </Stack>
  }
  if (dropState.state === "HOVER_ALLOWED") {
    return <Stack align="center">
      <FileDownload size={100} color={accentColors[2]} />
      <Text size="xl" color={accentColors[5]}>
        Drop it!
      </Text>
    </Stack>
  }
  if (dropState.state === "COMPLETE") {
    return <Stack align="center">
      <Check size={100} color={accentColors[2]} />
      <Text size="xl" color={accentColors[5]}>
        Completed!
      </Text>
    </Stack>
  }
  if (dropState.state === "INITIAL") {
    return <Stack align="center">
      <FileDownload size={100} color={accentColors[2]} />
      <Text size="xl" color={accentColors[5]}>
        Drop the video here
      </Text>
    </Stack>;
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
    else if (currentVideo === null) {
      setDropState({
        state: "INITIAL",
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
        })}
      >
        {/* {JSON.stringify(queue, null, 2)} */}
        {renderDrop(accentColors, dropState, queue.filter((v) => ["INITIAL", "PROGRESS"].includes(v.state.state)).length)}
      </Center>
    </Box>
  );
};
