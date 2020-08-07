<template>
  <v-app>
    <v-app-bar :hide-on-scroll="isMobile" app></v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
    <client-only>
      <v-bottom-navigation app v-if="isMobile"></v-bottom-navigation>
    </client-only>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
})
</script>
