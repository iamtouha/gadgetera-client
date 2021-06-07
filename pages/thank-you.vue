<template>
  <v-container class="fill-height">
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12" class="text-center">
        <v-img
          width="100%"
          max-width="650px"
          aspect-ratio="1.5"
          class="mx-auto"
          contain
          src="/thank-you.svg"
        />
        <p class="title text-center mt-4">
          Thank you for staying with us! we are processing the order for you.
        </p>
        <div class="d-flex justify-center my-8">
          <v-btn
            nuxt
            :to="`/orders/${$route.params.order}`"
            elevation="0"
            large
            color="accent"
            class="font-weight-bold "
          >
            view order
          </v-btn>
          <v-btn
            nuxt
            to="/products"
            large
            text
            color="primary"
            class="font-weight-bold"
          >
            more products
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ThankYou",
  layout: "basic",
  middleware: "hasOrdered"
};
</script>
