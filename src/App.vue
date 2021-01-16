<template>
    <v-app>
        <v-system-bar height="30" style='-webkit-app-region: drag' lights-out app>
            <span>ByPassMedia</span>
            <v-spacer></v-spacer>
            <downloader ref='download' @fullyDownloaded='fullyDownloaded'></downloader>
            <v-spacer></v-spacer>
            <v-btn @click='windowMinimize' icon width="15" height="15" style='background: #9e9e9e; margin-right: 5px; -webkit-app-region: no-drag;' :ripple="false" light></v-btn>
            <v-btn @click='windowMaximize' icon width="15" height="15" style='background: #fb8c00; margin-right: 5px; -webkit-app-region: no-drag;' :ripple="false"></v-btn>
            <v-btn @click='windowClose' icon width="15" height="15" style='background: #F44336; -webkit-app-region: no-drag;' :ripple="false"></v-btn>
        </v-system-bar>
        <v-main>
            <v-container fluid style='margin: 0 !important; padding: 0 !important;'>
                <v-row no-gutters>
                    <v-col cols="12" style='overflow-y: auto;'>
                        <v-col cols='12' class="d-flex flex-no-wrap justify-space-between align-center">
                            <h5 class='text-h5 mb-2 mt-2'>Mes titres:</h5>
                            
                            <v-btn color='primary' @click='dialogAddTitle = true'>Ajouter un titre</v-btn>
                        </v-col>
                        <track-list @play="play" ref="trackList"></track-list>
                    </v-col>
                </v-row>
            </v-container>

            <v-dialog v-model='dialogAddTitle' persistent width="600">
                <v-card flat>
                    <v-system-bar color="primary">
                        <span>Télécharger un titre</span>
                        <v-spacer></v-spacer>
                        <v-btn icon style='background: #F44336' width="15" height="15" @click="dialogAddTitle = false"></v-btn>
                    </v-system-bar>

                    <div class='pa-2'>
                        <v-text-field outlined label="Lien" dense v-model="url"></v-text-field>
                        <div class='text-right'>
                            <v-btn :loading='convertLoading' :disabled='(url.length > 0) ? (false) : (true)' color='primary' @click='videoInfo'>Convertir</v-btn>
                        </div>
                    </div>

                    <div v-if="convertInfo != null">
                        <v-divider></v-divider>

                        <v-card flat>
                            <div class="d-flex flex-no-wrap justify-space-between">
                                <div>
                                    <v-card-title v-text='convertInfo.videoDetails.title'></v-card-title>
                                    <v-card-subtitle>{{convertInfo.videoDetails.author.name}}<br />{{secondsToHms(convertInfo.videoDetails.lengthSeconds)}}</v-card-subtitle>
                                    <v-card-actions>
                                        <v-btn @click='downloadAudio' color='green'>Télécharger</v-btn>
                                    </v-card-actions>
                                </div>
                                <div>
                                    <v-avatar size='125' tile class='ma-3'>
                                        <v-img :src='convertInfo.videoDetails.thumbnails[convertInfo.videoDetails.thumbnails.length-1].url'></v-img>
                                    </v-avatar>
                                </div>
                            </div>
                        </v-card>
                    </div>
                </v-card>
            </v-dialog>
        </v-main>

        
        <player v-if='playing != null' :track="playing" @nextTrack='nextTrack' @previousTrack="previousTrack" ref='player'></player>
    </v-app>
</template>

<script>
const {BrowserWindow} = require('electron').remote;
import {getVideoInfos} from './utils/backend';
import downloader from './components/downloader.vue';
import TrackList from './components/TrackList.vue'
import Player from './components/Player.vue';

const fs = require('fs');

export default {
  name: 'App',

  components: {
    downloader,
    TrackList,
    Player
  },
  async mounted() {
      if(!fs.existsSync(`${this.$basePath}/tracks`)) {
          fs.mkdirSync(`${this.$basePath}/tracks`);
      }

      if(!fs.existsSync(`${this.$basePath}/thumbs`)) {
          fs.mkdirSync(`${this.$basePath}/thumbs`);
      }
  },

  data: () => ({
      dialogAddTitle: false,
      url: '',
      convertInfo: null,
      convertLoading: false,
      playing: null,
  }),
  methods: {
        windowMaximize() {
            const window = BrowserWindow.getFocusedWindow();
            if(window.isMaximized()) {
                window.unmaximize();
            }
            else {
                window.maximize();
            }
            return true;
        },
        windowClose() {
            const window = BrowserWindow.getFocusedWindow();
            window.close();
            return true;
        },
        windowMinimize() {
            const window = BrowserWindow.getFocusedWindow();
            window.minimize();
            return true;
        },
        async videoInfo() {
            this.convertLoading = true;
            const info = await getVideoInfos(this.url);
            this.convertInfo = info;
            this.convertInfo.url = this.url;
            this.convertLoading = false;
        },
        async downloadAudio() {
            this.$refs.download.addAttemptList(this.convertInfo);
        },
        secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            return `${h}h${m}m${s}s`;
        },
        fullyDownloaded(payload) {
            this.$refs.trackList.addTrack(payload.id);
        },
        play(track) {
            this.playing = null;
            this.playing = track;
        },
        nextTrack() {
            this.playing = this.$refs.trackList.nextTrack(this.playing.id);
        },
        previousTrack() {
            this.playing = this.$refs.trackList.previousTrack(this.playing.id);
        }
    },
};
</script>
