//const youtubedl = window.require('youtube-dl')
import ytdl from 'ytdl-core'
const request = window.require('request')

export async function getVideoInfos(url) {
    return await ytdl.getInfo(url, {lang: 'fr'});
}

export function getVideoFormat(formats) {
    return ytdl.chooseFormat(formats, {quality: 'highestaudio'});
}

export async function download(url) {
    return ytdl(url, {quality: 'highestaudio'});
}

export function downloadThumb(url) {
    return request(url)
}