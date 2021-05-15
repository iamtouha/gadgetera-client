<template>
  <v-container class="fill-height">
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12" class="text-center">
        <v-img
          width="100%"
          max-width="650px"
          class="mx-auto"
          contain
          src="/thank-you.svg"
        />
        <p class="headline text-center mt-4">
          Thank you for staying with us! we are processing the order for you.
        </p>
        <v-btn nuxt :to="'/orders/' + $route.params.order" text>
          <v-icon>mdi-arrow-left</v-icon>
          view order
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ThankYou",
  middleware: "hasOrdered"
};
</script>

<style></style>
