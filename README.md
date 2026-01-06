# Squizly

The simplest video compressor on macOS.

![Squizly in action](resources/preview.gif)

## Download

You can find it in the [releases page](https://github.com/matitalatina/squizly/releases).

- [Squizly for Apple Intel](https://github.com/matitalatina/squizly/releases/download/v1.0.3/Squizly-darwin-x64-1.0.3.zip)
- [Squizly for Apple Silicon](https://github.com/matitalatina/squizly/releases/download/v1.0.3/Squizly-darwin-arm64-1.0.3.zip)

## Support my work

Everything I made is open source.
If you like what I'm doing and you want to support me, you can help me 😄!

- Sponsor me with [Github](https://github.com/sponsors/matitalatina)
- [Buy me a coffee](https://www.buymeacoffee.com/mattianatali)
- [Paypal](https://paypal.me/mattianatali)

## Credits

Thanks to [wavein.ch](https://www.wavein.ch/) for providing membership to the Apple Developer Program.

Icon provided by <a href="https://www.flaticon.com/free-icons/compress" title="compress icons">Compress icons created by Smashicons - Flaticon</a>

## Appendix

- [Sign macOS app](https://www.electronforge.io/guides/code-signing/code-signing-macos)

## Troubleshooting

- _When I run `npm run start`, the renderer breaks because it doesn't fine `__dirname`:_ Make sure `@vercel/webpack-asset-relocator-loader` has fixed version `1.7.3` in your `package.json`. [Here's](https://www.electronforge.io/config/plugins/webpack#native-node-modules) the explanation.
