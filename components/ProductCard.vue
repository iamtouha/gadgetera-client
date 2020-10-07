<template>
  <v-card
    class="product-card"
    :to="'/products/' + product.slug"
    :elevation="hover ? 3 : 0"
    tile
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <v-img :src="product.image.url" :lazy-src="product.image.url">
      <v-chip
        v-if="product.discount"
        color="primary"
        style="font-size: 18px"
        class="font-weight-bold accent--text text--lighten-3 float-right elevation-1 ma-2 pa-4"
      >
        {{ product.discount }}% off!
      </v-chip>
    </v-img>
    <v-card-title
      style="word-break: break-word"
      class="text-center font-weight-regular"
    >
      {{ product.name }}
    </v-card-title>
    <v-card-text style="font-size: 1.2rem" class="text-center font-weight-bold"
      >{{ product.price }}TK</v-card-text
    >
  </v-card>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hover: false,
    }
  },
}
</script>

<style>
.product-card {
  transition-duration: 0.5s;
}
</style>
