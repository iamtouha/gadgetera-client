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
  data() {
    return {
      privacyPolicy: '',
    }
  },
  apollo: {
    privacyPolicy: {
      query: gql`
        {
          page {
            privacyPolicy
          }
        }
      `,
      update: (data) => data.page.privacyPolicy,
    },
  },
})
</script>
