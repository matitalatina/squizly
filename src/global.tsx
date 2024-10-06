import { Global } from "@mantine/emotion";
import React from "react";

export const GlobalCss = () => (
  <Global
    styles={() => ({
      "html, body, #root": {
        margin: 0,
        height: "100%",
      },
    })}
  />
);
