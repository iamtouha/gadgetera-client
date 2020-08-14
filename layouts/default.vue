<template>
  <v-app>
    <v-app-bar clipped-left color="seconday" :hide-on-scroll="isMobile" app>
      <v-toolbar-title style="cursor:pointer;" @click="$router.push('/')">
        <v-img max-width="135px" class="mr-3" contain src="/logo.svg" lazy-src="/logo.svg"></v-img>
      </v-toolbar-title>
      <v-toolbar-items :class="[isMobile?'d-none':'']">
        <v-btn
          class="transparent primary--text"
          exact
          elevation="0"
          v-for="route in routes"
          nuxt
          :to="route.path"
          :key="route.name"
        >{{route.name}}</v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-text-field flat solo hide-details v-model="search" label="search"></v-text-field>
      <v-btn
        color="primary"
        :style="{'max-width':isMobile?'40px':'','min-width':isMobile?'40px':''}"
        :to="'/search/'+search"
        outlined
        large
        elevation="0"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-items>
        <v-menu close-on-click close-on-content-click bottom nudge-bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" color="primary" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>Cart</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Log in</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Sign up</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <client-only>
        <v-progress-linear color="primary" indeterminate v-if="loading"></v-progress-linear>
      </client-only>
      <nuxt />
      <v-footer>
        <v-row>
          <v-col cols="6" sm="4">
            <v-list color="transparent" dense>
              <v-list-item class="subtitle-2" nuxt to="/privacy-policy">Privay Policy</v-list-item>
              <v-list-item class="subtitle-2" nuxt to="/terms-and-conditions">Terms and Conditions</v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-footer>
    </v-main>
    <v-bottom-navigation grow app :class="[isMobile?'':'d-none']">
      <v-btn
        style="height:100%;"
        v-for="route in navigates"
        :key="route.name"
        exact
        elevation="0"
        active-class="primary--text"
        nuxt
        :to="route.path"
      >
        <v-icon>{{route.icon}}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'DefaultLayout',
  data() {
    return {
      search: '',
      routes: [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'Contact', path: '/contact' },
        { name: 'About', path: '/about' },
      ],
      navigates: [
        { name: 'Home', path: '/', icon: 'mdi-home' },
        { name: 'Shop', path: '/products', icon: 'mdi-store' },
        { name: 'Cart', path: '/cart', icon: 'mdi-cart' },
        { name: 'Contact', path: '/contact', icon: 'mdi-headset' },
      ],
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    query() {
      return this.$route.params.name
    },
    loading() {
      return this.$store.state.loading
    },
  },
  watch: {
    query: {
      immediate: true,
      handler: function (val) {
        if (val) this.search = val
      },
    },
  },
})
</script>
