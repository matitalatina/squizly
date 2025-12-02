import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import * as path from "path";
import * as fs from "fs/promises";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "resources/icon",
    osxSign: {},
    osxNotarize: {
      appleId: process.env.APPLE_ID ?? "",
      appleIdPassword: process.env.APPLE_PASSWORD ?? "",
      teamId: process.env.APPLE_TEAM_ID ?? "",
    },
  },
  hooks: {
    packageAfterCopy: async (
      _config,
      buildPath,
      _electronVersion,
      platform,
      arch,
    ) => {
      if (platform !== "darwin") return;

      const resourceDir = path.join(
        process.cwd(),
        "resources",
        `${platform}-${arch}`,
      );
      const targetDir = path.join(buildPath, "..");

      await fs.mkdir(targetDir, { recursive: true });

      const binaries = ["ffmpeg", "ffprobe"];
      await Promise.all(
        binaries.map(async (binary) => {
          const src = path.join(resourceDir, binary);
          const dest = path.join(targetDir, binary);

          try {
            await fs.copyFile(src, dest);
            await fs.chmod(dest, 0o755);
            console.log(`Copied ${binary} for ${platform}-${arch}`);
          } catch {
            console.warn(`Warning: ${src} not found`);
          }
        }),
      );
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
