<template>
  <v-card
    class="products-card fill-height pb-0"
    :to="'/products/' + product.slug"
    nuxt
    :elevation="hover ? 3 : 0"
    rounded
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <v-img
      :src="product.photo"
      :alt="product.caption"
      aspect-ratio="1"
      max-height="270px"
      :lazy-src="product.thumbnail"
    >
    </v-img>
    <v-card-title class="subtitle-1" style="line-height:1.2;">
      {{ product.name }}
    </v-card-title>
    <v-card-subtitle class="subtitle-2">
      {{ product.price }}TK
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: "ProductPageCard",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hover: false
    };
  }
};
</script>

<style>
.products-card {
  transition-duration: 0.5s;
}
</style>
