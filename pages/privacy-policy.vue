<template>
  <v-container class="ck-content" v-html="privacyPolicy"></v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

import '~/assets/ckeditor.css'

export default Vue.extend({
  head: {
    title: 'Privacy Policy',
  },
  async asyncData({ app, store }) {
    try {
      store.commit('LOADING_ON')
      const client = app.apolloProvider?.defaultClient
      if (client) {
        const response = await client.query({
          query: gql`
            {
              page {
                privacyPolicy
              }
            }
          `,
        })
        return {
          privacyPolicy: response.data.page.privacyPolicy,
        }
      }
      return {}
    } catch (error) {
      throw error
    } finally {
      store.commit('LOADING_OFF')
    }
  },
  data() {
    return {
      privacyPolicy: '',
    }
  },
})
</script>
