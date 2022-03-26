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
rm darwin-x64.zip
```