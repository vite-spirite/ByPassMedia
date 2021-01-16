<template>
    <div style='-webkit-app-region: no-drag;'>
        <span v-if='!isDownload'>Aucun téléchargement</span>
        <span v-if='isDownload'>
            {{currentDownloadInfo.title}}
            <v-progress-linear v-model='currentDownloadInfo.progress'></v-progress-linear>
        </span>
    </div>
</template>

<script>
import {download, downloadThumb, getVideoFormat} from '../utils/backend';
import {addTrack} from '../utils/db';
//const {Notification} = require('electron').remote;
const fs = require('fs');
export default {
    name: 'downloader',
    data: () => ({
        isDownload: false,
        attemptList: [],
        currentDownload: [],
        currentDownloadInfo: {},
    }),
    methods: {
        addAttemptList(data) {
            this.attemptList.push(data);
        },
        async download(attemptListIndex) {
            if(this.isDownload === true) {
                return false;
            }

            this.isDownload = true;

            this.currentDownload = [];
            this.currentDownloadInfo = {};

            this.currentDownload = this.attemptList[attemptListIndex];

            this.attemptList.splice(attemptListIndex, 1);

            const video = await download(this.currentDownload.url);
            const thumbUrl = this.currentDownload.videoDetails.thumbnails[this.currentDownload.videoDetails.thumbnails.length-1].url.split('?')[0];

            this.currentDownloadInfo = {
                progress: 0,
                thumb: `${this.$basePath}/thumbs/${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}.${thumbUrl.split('.')[thumbUrl.split('.').length-1]}`,
                track: `${this.$basePath}/tracks/${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}.${getVideoFormat(this.currentDownload.formats).container}`,
                duration: this.currentDownload.videoDetails.lengthSeconds,
                title: this.currentDownload.videoDetails.title,
                author: this.currentDownload.videoDetails.author.name
            };

            downloadThumb(this.currentDownload.videoDetails.thumbnails[this.currentDownload.videoDetails.thumbnails.length-1].url).pipe(fs.createWriteStream(this.currentDownloadInfo.thumb));
            video.pipe(fs.createWriteStream(this.currentDownloadInfo.track));

            video.on('progress', async (bytes, totalDownloaded, total) => {
                this.currentDownloadInfo.progress = ((totalDownloaded / total)*100).toFixed(0);
                
                if(totalDownloaded == total) {
                    const id = await addTrack(this.currentDownloadInfo.title, this.currentDownloadInfo.author, this.currentDownloadInfo.duration, this.currentDownloadInfo.track, this.currentDownloadInfo.thumb);
                    this.isDownload = false;
                    console.log(id);
                    this.$emit('fullyDownloaded', {id: id});
                }
            });
        }
    },
    watch: {
        isDownload() {
            if(this.isDownload === true || this.attemptList.length === 0) {
                return false;
            }

            this.download(0);
        },
        attemptList() {
            if(this.attemptList.length > 0) {
                if(this.isDownload === false) {
                    this.download(0);
                }
            }
        }
    }
}
</script>

<style>

</style>