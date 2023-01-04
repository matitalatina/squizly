resources/darwin-arm64/ffmpeg:
	echo 'darwin arm64'
	mkdir -p resources/darwin-arm64
	curl -L -# --compressed -o darwin-arm64.zip 'https://www.osxexperts.net/FFmpeg501ARM.zip'
	echo '  extracting'
	unzip -o -d resources/darwin-arm64 -j darwin-arm64.zip ffmpeg
	rm darwin-arm64.zip

resources/darwin-arm64/ffprobe:
	mkdir -p resources/darwin-arm64
	curl -L -# --compressed -o resources/darwin-arm64/ffprobe 'https://github.com/SavageCore/node-ffprobe-installer/raw/master/platforms/darwin-arm64/ffprobe'
	chmod +x resources/darwin-x64/ffprobe

resources/darwin-x64/ffmpeg:
	echo 'darwin x64'
	mkdir -p resources/darwin-x64
	curl -L -# --compressed -o darwin-x64.zip 'https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip' 
	echo '  extracting'
	unzip -o -d resources/darwin-x64 -j darwin-x64.zip ffmpeg
	rm darwin-x64.zip

resources/darwin-x64/ffprobe:
	mkdir -p resources/darwin-x64
	curl -L -# --compressed -o resources/darwin-x64/ffprobe 'https://github.com/joshwnj/ffprobe-static/raw/master/bin/darwin/x64/ffprobe'
	chmod u+x resources/darwin-x64/ffprobe

arm64-resources: resources/darwin-arm64/ffmpeg resources/darwin-arm64/ffprobe
	mkdir -p resources/mac/
	ln -f "${PWD}/resources/darwin-arm64/ffmpeg" 'resources/mac/ffmpeg'
	ln -f "${PWD}/resources/darwin-arm64/ffprobe" 'resources/mac/ffprobe'

x64-resources: resources/darwin-x64/ffmpeg resources/darwin-x64/ffprobe
	mkdir -p resources/mac/
	ln -f "${PWD}/resources/darwin-x64/ffmpeg" 'resources/mac/ffmpeg'
	ln -f "${PWD}/resources/darwin-x64/ffprobe" 'resources/mac/ffprobe'

arm64-%: arm64-resources
	${MAKE} .$* ARCH=arm64

x64-%: x64-resources
	${MAKE} .$* ARCH=x64

.package:
	npx electron-forge package --arch=${ARCH} --platform=darwin

.make:
	npx electron-forge make --arch=${ARCH} --platform=darwin