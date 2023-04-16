import { Group, MantineProvider, Stack } from "@mantine/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Drop } from "./drop";
import { GlobalCss } from "./global";

export const App = () => {
  return (
    <MantineProvider withNormalizeCSS>
      <GlobalCss />
      <Stack align="center" style={{ height: "100%" }}>
        <Drop />
      </Stack>
    </MantineProvider>
  );
};

function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

render();
