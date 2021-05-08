<template>
  <v-container class="fill-height">
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12" class="text-center">
        <v-img
          width="100%"
          max-width="650px"
          class="mx-auto"
          contain
          :src="error.statusCode === 404 ? '/404.svg' : '/app_error.svg'"
        />
        <p class="headline text-center mt-4">
          {{ note }}
        </p>
        <v-btn nuxt to="/" text>
          <v-icon>mdi-arrow-left</v-icon>
          Home Page
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "basic",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
      notFoundNote: "The page you looking for is not available at this moment.",
      otherNote: "Sorry, something went wrong."
    };
  },

  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  },
  computed: {
    note() {
      return this.error.statusCode === 404 ? this.notFoundNote : this.otherNote;
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
