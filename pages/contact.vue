<template>
  <v-container>
    <v-row>
      <v-col class="ck-content" v-html="contact.content" cols="12"></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-list>
          <v-list-item three-line>
            <v-list-item-avatar>
              <v-icon>mdi-phone</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{contact.phone1}}</v-list-item-title>
              <v-list-item-title>{{contact.phone2}}</v-list-item-title>
              <v-list-item-title>{{contact.phone3}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-mail</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{contact.email}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import contactQuery from '~/graphql/queries/contact.gql'
import '~/assets/ckeditor.css'

export default Vue.extend({
  name: 'Contact',
  async asyncData({ app, store }) {
    try {
      store.commit('LOADING_ON')
      const client = app.apolloProvider?.defaultClient
      if (client) {
        const response = await client.query({
          query: contactQuery,
        })
        return {
          contact: response.data.contactUs,
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
      contact: {
        phone1: '',
        phone2: '',
        phone3: '',
        email: '',
        availability: '',
        messenger: '',
        content: '',
        links: [] as Array<{ icon: string; name: string; url: string }>,
      },
    }
  },
})
</script>
