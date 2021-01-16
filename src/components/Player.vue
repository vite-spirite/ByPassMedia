<template>
    <v-bottom-navigation app height="80" class='d-flex flex-row justify-space-between'>
        <video ref='player' :src="track.trackPath" style='display: none;' @timeupdate="updateTimeTrack" @ended="nextTrack"></video>
        <div class='d-flex flex-row align-center justify-start' style='padding: 5px;'>
            <v-avatar rounded="lg">
                <v-img :src='track.thumbPath'></v-img>
            </v-avatar>
            <div class='d-flex flex-column' style='margin-left: 5px;'>
                <span class='text-subtitle-1'>{{track.title}}</span>
                <span class='text-subtitle-1'>{{track.author}}</span>
            </div>
        </div>

        <div v-if='player != null' class='d-flex flex-column align-center justify-center' style='padding: 5px; min-width: 50%;'>
            <div class='d-flex flex-row justify-center align-center' style='width: 100%;'>
                <v-btn icon small @click='previousTrack'>
                    <v-icon>mdi-skip-previous</v-icon>
                </v-btn>
                <v-btn icon small @click='play'>
                    <v-icon>{{(player.paused) ? ('mdi-play') : ('mdi-pause')}}</v-icon>
                </v-btn>
                <v-btn icon small @click='nextTrack'>
                    <v-icon>mdi-skip-next</v-icon>
                </v-btn>
            </div>
            <div style='width: 100%'>
                <v-slider :label="secondsToHms(track.duration)" inverse-label step='1' min='0' :max="track.duration" v-model='timeTrack' @change="setTimeTrack" style='width: 100%;' @mousedown="timeTrackAutoUpdate = false" @mouseup="timeTrackAutoUpdate = true"></v-slider>
            </div>
        </div>

        <div style='width: 20%;' class='d-flex flex-row align-center'>
            <v-slider dense prepend-icon="mdi-volume-high" v-model="volume" min='0' max='1' step='0.01' style="width: 5% !important;" @change='player.volume = volume'></v-slider>
        </div>

    </v-bottom-navigation>
</template>

<script>
export default {
    name: 'Player',
    props: {
        track: {
            type: [Array, Object, null],
            required: false,
            default: null
        }
    },
    data: () => ({
        player: null,
        timeTrack: 0,
        timeTrackAutoUpdate: true,
        volume: 0.50,
    }),
    mounted() {
        this.player = this.$refs.player;

        this.player.volume = this.volume;
        this.player.autoplay = true;
    },
    methods: {
        play() {
            if(this.player.paused) {
                this.player.play();
            }
            else {
                this.player.pause();
            }
        },
        updateTimeTrack() {
            if(this.timeTrackAutoUpdate) {
                this.timeTrack = this.player.currentTime;
            }
        },
        setTimeTrack(time) {
            this.player.pause();
            this.player.currentTime = time;
            this.player.play();
        },
        secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            return `${(h > 0) ? (h+':'):('')}${(m > 0) ? (m+':'):('')}${(s > 0) ? (s):('')}`;
        },
        nextTrack() {
            this.$emit('nextTrack');
        },
        previousTrack() {
            this.$emit('previousTrack');
        },
    },
}
</script>

<style>

</style>