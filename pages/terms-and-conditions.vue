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
  data() {
    return {
      termsAndConditions: '',
    }
  },
  apollo: {
    termsAndConditions: {
      query: gql`
        {
          page {
            termsAndConditions
          }
        }
      `,
      update: (data) => data.page.termsAndConditions,
    },
  },
})
</script>
