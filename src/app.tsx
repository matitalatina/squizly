import { MantineProvider, Stack } from "@mantine/core";
import "@mantine/core/styles.css";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Drop } from "./drop";
import { GlobalCss } from "./global";

export const App = () => {
  return (
    <MantineProvider stylesTransform={emotionTransform}>
      <MantineEmotionProvider>
        <Notifications position="top-right" />
        <GlobalCss />
        <Stack align="center" justify="center" style={{ height: "100%" }}>
          <Drop />
        </Stack>
      </MantineEmotionProvider>
    </MantineProvider>
  );
};

function render() {
  const container = document.getElementById("root") as HTMLElement;
  const root = createRoot(container);
  root.render(<App />);
}

render();
