import {ffmpeg} from './ffmpeg'
declare global {
    interface Window {
        ffmpeg: typeof ffmpeg
    }
} 