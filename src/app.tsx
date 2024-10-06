import { MantineProvider, Stack } from "@mantine/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Drop } from "./drop";
import { GlobalCss } from "./global";
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion";
import "@mantine/core/styles.css";

export const App = () => {
  return (
    <MantineProvider stylesTransform={emotionTransform}>
      <MantineEmotionProvider>
        <GlobalCss />
        <Stack align="center" justify="center" style={{ height: "100%" }}>
          <Drop />
        </Stack>
      </MantineEmotionProvider>
    </MantineProvider>
  );
};

function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

render();
