import { type Configuration } from "webpack";

import { plugins } from "./webpack.plugins";

// Renderer-specific rules (without asset-relocator-loader which requires __dirname)
const rendererRules = [
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.css$/i,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
  },
];

export const rendererConfig: Configuration = {
  module: {
    rules: rendererRules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: { path: false, util: false, stream: false, os: false },
  },
};
