import { MantineProvider, Stack } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./global.css";
import { createRoot } from "react-dom/client";
import { Drop } from "./drop";

export const App = () => {
  return (
    <MantineProvider>
      <Notifications position="top-right" />
      <Stack align="center" justify="center" style={{ height: "100%" }}>
        <Drop />
      </Stack>
    </MantineProvider>
  );
};

function render() {
  const container = document.getElementById("root") as HTMLElement;
  const root = createRoot(container);
  root.render(<App />);
}

render();
