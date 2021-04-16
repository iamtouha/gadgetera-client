<template>
  <v-card
    class="products-card"
    :to="'/products/' + item.slug"
    nuxt
    :elevation="hover ? 3 : 0"
    rounded
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <v-img :src="item.photo.url" :lazy-src="lazyUrl"> </v-img>
    <v-card-title class="text-center font-weight-regular">
      {{ item.name }}
    </v-card-title>
    <v-card-text style="font-size: 1.2rem" class="text-center font-weight-bold"
      >{{ item.price }}TK</v-card-text
    >
  </v-card>
</template>

<script>
export default {
  name: "ProductCard",
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
  },
  computed: {
    lazyUrl() {
      return this.item.photo.formats?.thumbnail?.url;
    },
    item() {
      const { name, variants, slug, photos, brand, category } = this.product;
      const { price } = variants.find(item => item.inStock);
      return {
        name,
        price,
        slug,
        photo: photos[0],
        brand,
        category
      };
    }
  }
};
</script>

<style>
.products-card {
  transition-duration: 0.5s;
}
</style>
