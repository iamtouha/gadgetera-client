<template>
  <v-container>
    <v-row>
      <v-carousel show-arrows-on-hover hide-delimiter-background>
        <v-carousel-item
          class="align-center"
          v-for="img in content.carousel"
          :key="img.url"
          :src="img.url"
        ></v-carousel-item>
      </v-carousel>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import homepageQuery from '~/graphql/queries/homepage.gql'

export default Vue.extend({
  name: 'Home',
  head: {
    title: 'Home',
    meta: [
      {
        hid: 'title',
        property: 'og:title',
        content: 'Gadget Era Homepage',
      },
      {
        hid: 'description',
        property: 'og:description',
        content: 'Gadget Era is a multi-branded retail electronics seller',
      },
      {
        hid: 'image',
        property: 'og:image',
        content: '/image_meta.png',
      },
    ],
  },
  async asyncData({ app, store }) {
    try {
      store.commit('LOADING_ON')
      const client = app.apolloProvider?.defaultClient
      if (!client) return {}
      const res = await client.query({ query: homepageQuery })
      return { content: res.data.homePage }
    } catch (error) {
      throw error
    } finally {
      store.commit('LOADING_OFF')
    }
  },
  data: () => ({
    content: {
      carousel: [],
      featured: [],
      features: [],
    },
  }),
})
</script>
