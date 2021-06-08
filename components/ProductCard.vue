<template>
  <v-card
    outlined
    nuxt
    :to="`/products/${product.slug}`"
    class="fill-height product-card"
  >
    <div class="responsive">
      <v-chip
        v-show="product.discount"
        color="primary"
        light
        class="offer-chip font-weight-bold"
      >
        {{ Math.ceil(100 * product.discount) }}% off
      </v-chip>
      <div class="sizer">
        <div class="wrapper">
          <img :src="imgSrc" :alt="img.alternativeText" :title="img.caption" />
        </div>
      </div>
    </div>

    <v-card-actions class="py-1 px-4">
      <p class="mb-0 text-subtitle-2">
        {{ product.brand.name }}
      </p>
      <v-spacer />
      <p class="mb-0 text-subtitle-1 text-sm-h6">
        &#2547;
        {{ product.price | groupNum }}
      </p>
    </v-card-actions>
    <v-card-title
      style="line-height:1.5rem"
      class="text-subtitle-1 text-md-h6 font-weight-bold pt-1"
    >
      {{ product.name }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "ProductCard",
  filters: {
    groupNum(num) {
      const formatter = new Intl.NumberFormat("en-US");
      return formatter.format(Math.ceil(num));
    }
  },
  props: {
    product: { type: Object, default: () => ({ images: [] }) }
  },
  computed: {
    img() {
      return this.product.images[0] || {};
    },
    imgSrc() {
      const smallSrc = this.img.formats?.small?.url;
      return smallSrc || this.img.url;
    }
  }
};
</script>
