<template>
  <v-container class="fill-height">
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12" class="text-center">
        <v-img
          width="100%"
          max-width="650px"
          class="mx-auto"
          contain
          src="/under_construction.svg"
        />
        <p class="headline text-center mt-4">
          Page Under Construction.
        </p>
        <v-btn nuxt to="/" text>
          <v-icon>mdi-arrow-left</v-icon>
          go back
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "UnderContstruction"
};
</script>

<style></style>
