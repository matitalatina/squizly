import { Center, Grid, Group, MantineProvider } from "@mantine/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Drop } from "./drop";
import { GlobalCss } from "./global";

export const App = () => {
  return (
    <MantineProvider withNormalizeCSS>
      <GlobalCss />
      <Group position="center" style={{ height: "100%" }} direction="column">
        <Drop />
      </Group>
    </MantineProvider>
  );
};

function render() {
  ReactDOM.render(<App />, document.body);
}

render();
