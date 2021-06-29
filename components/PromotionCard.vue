<template>
  <v-slide-item>
    <nuxt-link :to="'/products/' + product.slug">
      <v-img
        width="200px"
        :src="image"
        :lazy-src="thumb"
        aspect-ratio="1"
        class="rounded align-end ma-2 ma-sm-4"
        :title="product.name"
      >
        <div class="pb-3" style="text-align:center;">
          <v-chip class="mx-auto elevation-2" color="primary">
            {{ product | calcDiscount }}% OFF
          </v-chip>
        </div>
      </v-img>
    </nuxt-link>
  </v-slide-item>
</template>

<script>
export default {
  name: "PromotionCard",
  filters: {
    calcDiscount(product) {
      const { price, sale_price } = product;
      if (!product.sale_price) {
        return 0;
      }
      const discount = (100 * (price - sale_price)) / price;
      return Math.ceil(discount);
    }
  },
  props: {
    product: {
      type: Object,
      default: () => ({ images: [] })
    }
  },
  computed: {
    image() {
      const { images } = this.product;
      const image = images[1] || images[0];
      return image.formats?.small?.url || image.url;
    },
    thumb() {
      const { images } = this.product;
      const image = images[1] || images[0];
      return image.formats?.thumbnail?.url || image.url;
    }
  }
};
</script>
