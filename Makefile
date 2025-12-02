resources/darwin-arm64/ffmpeg:
	echo 'darwin arm64'
	mkdir -p resources/darwin-arm64
	curl -L -# --compressed -o darwin-arm64.zip 'https://www.osxexperts.net/FFmpeg501ARM.zip'
	echo '  extracting'
	unzip -o -d resources/darwin-arm64 -j darwin-arm64.zip ffmpeg
	rm darwin-arm64.zip
	chmod u+x resources/darwin-arm64/ffmpeg

resources/darwin-arm64/ffprobe:
	mkdir -p resources/darwin-arm64
	curl -L -# --compressed -o resources/darwin-arm64/ffprobe 'https://github.com/SavageCore/node-ffprobe-installer/raw/master/platforms/darwin-arm64/ffprobe'
	chmod u+x resources/darwin-arm64/ffprobe

resources/darwin-x64/ffmpeg:
	echo 'darwin x64'
	mkdir -p resources/darwin-x64
	curl -L -# --compressed -o darwin-x64.zip 'https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip' 
	echo '  extracting'
	unzip -o -d resources/darwin-x64 -j darwin-x64.zip ffmpeg
	rm darwin-x64.zip
	chmod u+x resources/darwin-x64/ffmpeg

resources/darwin-x64/ffprobe:
	mkdir -p resources/darwin-x64
	curl -L -# --compressed -o resources/darwin-x64/ffprobe 'https://github.com/joshwnj/ffprobe-static/raw/master/bin/darwin/x64/ffprobe'
	chmod u+x resources/darwin-x64/ffprobe

arm64-%: resources/darwin-arm64/ffmpeg resources/darwin-arm64/ffprobe
	${MAKE} .$* ARCH=arm64

x64-%: resources/darwin-x64/ffmpeg resources/darwin-x64/ffprobe
	${MAKE} .$* ARCH=x64

download-all: resources/darwin-arm64/ffmpeg resources/darwin-arm64/ffprobe \
              resources/darwin-x64/ffmpeg resources/darwin-x64/ffprobe

.package:
	npx electron-forge package --arch=${ARCH} --platform=darwin

# Example: APPLE_ID=XXX APPLE_PASSWORD=XXX APPLE_TEAM_ID=XXX make arm64-make
.make:
	npx electron-forge make --arch=${ARCH} --platform=darwin
