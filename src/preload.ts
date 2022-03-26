import { contextBridge } from 'electron'
import Ffmpeg from 'fluent-ffmpeg'
import { join } from 'path'
import { ffmpeg } from './ffmpeg'
window.addEventListener("DOMContentLoaded", () => {
    console.log('Preload enabled!')
    console.log(process.env.NODE_ENV)
    const resourcePath = process.env.NODE_ENV === 'production' ? process.resourcesPath : join(__dirname, '../../../resources/mac')
    Ffmpeg.setFfmpegPath(join(resourcePath, 'ffmpeg'))
    
})

contextBridge.exposeInMainWorld(
    'ffmpeg', ffmpeg
)