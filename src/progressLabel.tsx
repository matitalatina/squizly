import { Center, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import React from "react";
import { X } from "tabler-icons-react";

type ProgressLabelProps = {
  onStop: () => void;
  percent: number;
  color: string;
};

export function ProgressLabel({
  onStop,
  percent,
  color,
}: ProgressLabelProps): React.JSX.Element {
  const { hovered, ref } = useHover();

  return (
    <div ref={ref}>
      {hovered ? (
        <Center onClick={onStop}>
          <X size={30} color={color} />
        </Center>
      ) : (
        <Text
          size="xl"
          ta="center"
          fw={700}
          style={{ pointerEvents: "none" }}
          c="orange"
        >
          {percent}%
        </Text>
      )}
    </div>
  );
}
