# Squizly

# Download ffmpeg static files

The script comes from [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static/blob/master/build/index.sh).

```bash
echo 'darwin x64'
echo '  downloading from evermeet.cx'
mkdir -p resources/mac
curl -L -# --compressed -o darwin-x64.zip 'https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip' 
echo '  extracting'
unzip -o -d resources/mac -j darwin-x64.zip ffmpeg
curl -L -# --compressed -o resources/mac/ffprobe 'https://github.com/joshwnj/ffprobe-static/raw/master/bin/darwin/x64/ffprobe'
chmod +x resources/mac/ffprobe
rm darwin-x64.zip
```