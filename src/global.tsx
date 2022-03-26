import { Global } from "@mantine/core";
import React from "react";

export const GlobalCss = () => (
  <Global
    styles={() => ({
      "html, body": {
        margin: 0,
        height: "100%",
      },
    })}
  />
);
