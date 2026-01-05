import {
  Box,
  Center,
  type MantineColorsTuple,
  type MantineTheme,
  RingProgress,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { Check, FileDownload, AlertCircle } from "tabler-icons-react";
import {
  type StateProgress,
  type Video,
  getVideoToProcessCount,
  useCompressManager,
} from "./compressManager";
import { ProgressLabel } from "./progressLabel";
import * as classes from "./drop.module.css";

// Helper function to check if a file is a video based on MIME type or extension
const isVideoFile = (file: File | DataTransferItem): boolean => {
  if ("type" in file && file.type.startsWith("video")) {
    return true;
  }

  // Check file extension for common video formats
  const fileName = "name" in file ? file.name : "";
  const videoExtensions = [
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
    ".flv",
    ".wmv",
    ".ts",
    ".m2ts",
    ".mts",
    ".m4v",
    ".3gp",
    ".ogv",
    ".mpg",
    ".mpeg",
  ];

  return videoExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
};

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
    case "HOVER_ALLOWED":
      return theme.colors.green;
    case "HOVER_FORBIDDEN":
      return theme.colors.red;
  }
};

function renderDrop(
  accentColors: MantineColorsTuple,
  dropState: DropState,
  videoToProcessCount: number,
) {
  if (dropState.state === "PROGRESS") {
    const percent =
      Math.round(dropState.currentVideo.state.progress.percent ?? 0) || 0;
    return (
      <Stack align="center" justify="center">
        <Text size="xl" c={accentColors[5]}>
          Videos to process: {videoToProcessCount}
        </Text>
        <RingProgress
          size={140}
          roundCaps
          rootColor={accentColors[2]}
          sections={[{ value: percent, color: accentColors[5] }]}
          label={
            <ProgressLabel
              color={accentColors[5]}
              onStop={dropState.currentVideo.state.stop}
              percent={percent}
            />
          }
        />
      </Stack>
    );
  }
  if (dropState.state === "HOVER_FORBIDDEN") {
    return (
      <Stack align="center">
        <FileDownload size={100} color={accentColors[2]} />
        <Text size="xl" c={accentColors[5]}>
          The file is not a video
        </Text>
      </Stack>
    );
  }
  if (dropState.state === "COMPLETE") {
    return (
      <Stack align="center">
        <Check size={100} color={accentColors[2]} />
        <Text fz="xl" c={accentColors[5]}>
          Completed!
        </Text>
      </Stack>
    );
  }
  if (dropState.state === "HOVER_ALLOWED") {
    return (
      <Stack align="center">
        <FileDownload size={100} color={accentColors[2]} />
        <Text size="xl" c={accentColors[5]}>
          Drop it!
        </Text>
      </Stack>
    );
  }
  if (dropState.state === "INITIAL") {
    return (
      <Stack align="center">
        <FileDownload size={100} color={accentColors[2]} />
        <Text fz="xl" c={accentColors[5]}>
          Drop the video here
        </Text>
      </Stack>
    );
  }
  return null;
}

export const Drop = () => {
  const [dropState, setDropState] = useState<DropState>({ state: "INITIAL" });
  const { queue, onNewVideos } = useCompressManager();

  const videoToProcessCount = getVideoToProcessCount(queue);
  const currentVideo: Video | null =
    queue.find((v) => v.state.state === "PROGRESS") ??
    queue.find((v) => v.state.state === "COMPLETE") ??
    null;

  if (
    currentVideo?.state?.state === "PROGRESS" &&
    !(
      dropState.state == "PROGRESS" &&
      dropState.currentVideo.path == currentVideo.path &&
      dropState.currentVideo.state == currentVideo.state
    )
  ) {
    setDropState({
      state: "PROGRESS",
      currentVideo: {
        path: currentVideo.path,
        state: currentVideo.state,
      },
    });
  } else if (!["HOVER_FORBIDDEN", "HOVER_ALLOWED"].includes(dropState.state)) {
    if (
      currentVideo?.state?.state === "COMPLETE" &&
      dropState.state !== "COMPLETE"
    ) {
      setDropState({
        state: "COMPLETE",
      });
    } else if (currentVideo === null && dropState.state !== "INITIAL") {
      setDropState({
        state: "INITIAL",
      });
    }
  }

  const theme = useMantineTheme();
  const accentColors = colorFromState(theme, dropState);

  return (
    <Box
      className={classes.dropArea}
      style={{
        backgroundColor: accentColors[1],
      }}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const allFiles = Array.from(e.dataTransfer.files);
        const videoFiles = allFiles.filter((f) => isVideoFile(f));
        const newVideoPaths = videoFiles.map((f) =>
          window.electronUtils.getPathForFile(f),
        );

        // Show notification if some files were invalid
        if (allFiles.length > videoFiles.length) {
          const invalidCount = allFiles.length - videoFiles.length;
          notifications.show({
            title: "Invalid files detected",
            message: `${invalidCount} file${
              invalidCount > 1 ? "s are" : " is"
            } not a valid video format and will be ignored.`,
            color: "orange",
            icon: <AlertCircle size={18} />,
            autoClose: 5000,
          });
        }

        // Show notification if no valid videos were dropped
        if (videoFiles.length === 0) {
          notifications.show({
            title: "No valid videos",
            message: "Please drop video files (mp4, mov, avi, mkv, ts, etc.)",
            color: "red",
            icon: <AlertCircle size={18} />,
            autoClose: 5000,
          });
          return setDropState({
            state: "INITIAL",
          });
        }

        const status = onNewVideos(newVideoPaths);
        if (status === "NO_NEW_VIDEOS") {
          return setDropState({
            state: "COMPLETE",
          });
        }
      }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
      }}
      onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
        console.log(Array.from(e.dataTransfer.items).map((f) => f.type));
        e.preventDefault();
        // Check if there are any video file items being dragged
        // Accept if type starts with "video" or if type is empty (type not always available during drag)
        const hasVideoItems = Array.from(e.dataTransfer.items).some(
          (item) =>
            item.kind === "file" &&
            (item.type.startsWith("video") || item.type === ""),
        );
        setDropState({
          state: hasVideoItems ? "HOVER_ALLOWED" : "HOVER_FORBIDDEN",
        });
      }}
      onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDropState({
          state: "INITIAL",
        });
      }}
      onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDropState({
          state: "INITIAL",
        });
      }}
    >
      <Center
        className={classes.innerDropArea}
        style={{
          border: `5px dashed ${accentColors[2]}`,
          pointerEvents: dropState.state !== "PROGRESS" ? "none" : "auto",
        }}
      >
        {/* {JSON.stringify(queue, null, 2)} */}
        {renderDrop(accentColors, dropState, videoToProcessCount)}
      </Center>
    </Box>
  );
};
