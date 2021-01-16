<template>
    <div class='track-list'>
        <h3 class='h3' v-if="list.length == 0">Aucun titre télécharger.</h3>

        <track-card v-for="(item, index) in list" :key="index" :track="item" @play='trackSelect'></track-card>
    </div>
</template>

<script>
import {getTrack, getTrackById} from '../utils/db'
import TrackCard from './TrackCard.vue';
export default {
  components: { TrackCard },
    name: 'TrackList',
    data: () => ({
        list: [],
    }),
    async mounted() {
        this.list = await getTrack();
    },
    methods: {
        async addTrack(track) {
            this.list.unshift(await getTrackById(track));
        },
        trackSelect(track) {
            this.$emit('play', track);
        },
        nextTrack(id) {
            const index = this.list.findIndex((element) => element.id == id);
            return (this.list.length - 1 > index+1) ? (this.list[index+1]) : (this.list[0]);
        },
        previousTrack(id) {
            const index = this.list.findIndex((element) => element.id == id);
            return (index-1 > 0) ? (this.list[index-1]) : (this.list[this.list.length-1]);
        }
    }
}
</script>

<style>

</style>