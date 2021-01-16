<template>
    <v-card elevation="0" :hover='true' class='ma-2'>
        <div class="d-flex flex-no-wrap justify-space-between" :style='"background: "+background+";"'>
            <div>
                <v-card-title v-text="track.title"></v-card-title>
                <v-card-subtitle v-text="track.author"></v-card-subtitle>
                <v-card-actions>
                    <v-btn icon @click='trackClicked'><v-icon>mdi-play</v-icon></v-btn>
                    <v-btn icon><v-icon>mdi-trash-can</v-icon></v-btn>
                </v-card-actions>
            </div>
            <div>
                <v-avatar tile size="125" class='ma-3'>
                    <v-img :src="track.thumbPath"></v-img>
                </v-avatar> 
            </div>
        </div>
    </v-card>
</template>

<script>
import analyze from 'rgbaster'

export default {
    name: "Track",
    props: {
        track: {
            type: [Array, Object],
            required: true
        },
    },
    data: () => ({
        background: '#212121',
    }),
    async mounted() {
        let result = await analyze(this.track.thumbPath, { ignore: [ 'rgb(255,255,255)', 'rgb(0,0,0)' ], scale: 0.1 });
        this.background = result[0].color;
    },
    watch: {
        track : async function() {
            let result = await analyze(this.track.thumbPath, { ignore: [ 'rgb(255,255,255)', 'rgb(0,0,0)' ], scale: 0.1 });
            this.background = result[0].color;
        }
    },
    methods: {
        trackClicked() {
            this.$emit('play', this.track);
        }
    }
}
</script>

<style>

</style>