# Squizly

![Squizly](resources/icon.png)

# Download ffmpeg static files

The script comes from [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static/blob/master/build/index.sh | width=50).

```bash
mkdir -p resources/mac

# Mac x64
echo 'darwin x64'
echo '  downloading from evermeet.cx'
mkdir -p resources/darwin-x64
curl -L -# --compressed -o darwin-x64.zip 'https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip' 
echo '  extracting'
unzip -o -d resources/darwin-x64 -j darwin-x64.zip ffmpeg
curl -L -# --compressed -o resources/darwin-x64/ffprobe 'https://github.com/joshwnj/ffprobe-static/raw/master/bin/darwin/x64/ffprobe'
chmod +x resources/darwin-x64/ffprobe
rm darwin-x64.zip

# Mac arm64
echo 'darwin arm64'
mkdir -p resources/darwin-arm64
curl -L -# --compressed -o darwin-arm64.zip 'https://www.osxexperts.net/FFmpeg501ARM.zip' darwin-arm64.zip
echo '  extracting'
unzip -o -d resources/darwin-arm64 -j darwin-arm64.zip ffmpeg
curl -L -# --compressed -o resources/darwin-arm64/ffprobe 'https://github.com/joshwnj/ffprobe-static/raw/master/bin/darwin/arm64/ffprobe'
chmod +x resources/darwin-arm64/ffprobe
rm darwin-arm64.zip

# Link value to resources
ln -s resources/darwin-arm64/ffmpeg resources/mac/ffmpeg
ln -s resources/darwin-arm64/ffprobe resources/mac/ffprobe
```

## Credits

Icon provided by <a href="https://www.flaticon.com/free-icons/compress" title="compress icons">Compress icons created by Smashicons - Flaticon</a>