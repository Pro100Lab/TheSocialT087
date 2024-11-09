<template>
  <v-app>
    <v-main class="main-display main-display__bg pa-4" v-if="!showPresentation">
        <v-row dense class="mr-3" >
          <v-col cols="9">
            <router-view class="main-display__main-view"/>
          </v-col>

          <v-col cols="3">
            <log-display class="main-display__main-view"></log-display>
          </v-col>

          <v-col cols="12">
            <display-switch class="main-display__secondary-view"></display-switch>
          </v-col>
        </v-row>
    </v-main>

    <transition name="fade" mode="in-out">
      <show-presents v-if="showPresentation" class="main-display presents-sticky" :on-close="presentationsShowed"></show-presents>
    </transition>

  </v-app>
</template>

<script>

import DisplaySwitch from "@/components/DisplaySwitch";
import LogDisplay from "@/components/LogDisplay";
import ShowPresents from "@/views/ShowPresents";

export default {
  name: 'App',
  components: {
    ShowPresents,
    DisplaySwitch,
    LogDisplay
  },
  data: () => ({
    showPresentation: true,
  }),
  methods: {
    presentationsShowed: function () {
      this.showPresentation = false;
    }
  }
}
</script>

<style scoped>
  .main-display__secondary-view {
    height: 15vh;
  }

  .main-display__main-view {
    height: 80vh;
  }

  .main-display {
    width: 100vw;
    height: 100vh;
  }

  .presents-sticky {
    position: sticky;
  }

  .main-display__bg {
    background-color: #212121;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
