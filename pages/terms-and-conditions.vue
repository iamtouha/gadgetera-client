<template>
  <v-container class="ck-content" v-html="termsAndConditions"></v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import '~/assets/ckeditor.css'

export default Vue.extend({
  head: {
    title: 'Terms and Conditions',
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
                termsAndConditions
              }
            }
          `,
        })
        return {
          termsAndConditions: response.data.page.termsAndConditions,
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
      termsAndConditions: '',
    }
  },
})
</script>
