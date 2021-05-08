<template>
  <v-card
    outlined
    nuxt
    :to="'/products/' + product.slug"
    class="fill-height product-card"
  >
    <v-img
      aspect-ratio="1"
      content-class="product-card-content-wrapper"
      :src="product.images[0].url"
    >
      <v-chip
        v-show="product.discount"
        class="offer-chip rounded"
        style="top:5px; right:5px;"
      >
        {{ Math.ceil(100 * product.discount) }}% off
      </v-chip>
    </v-img>
    <v-card-actions class="py-1 px-4">
      <p class="mb-0 text-subtitle-2">
        {{ product.brand.name }}
      </p>
      <v-spacer />
      <p class="mb-0 text-subtitle-1 text-sm-h6">
        &#2547;
        {{ product.price }}
      </p>
    </v-card-actions>
    <v-card-title
      style="line-height:1.5rem"
      class="text-subtitle-1 text-md-h6 font-weight-regular pt-1"
    >
      {{ product.name }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      //
    };
  }
};
</script>
<style>
.product-card-content-wrapper {
  position: relative;
}
.product-card-content-wrapper .offer-chip {
  position: absolute;
}
</style>
