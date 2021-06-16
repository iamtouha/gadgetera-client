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
        class="offer-chip"
      >
        {{ Math.ceil(100 * product.discount) }}% off
      </v-chip>
      <div class="sizer">
        <div class="wrapper">
          <img :src="imgSrc" :alt="img.alternativeText" :title="img.caption" />
        </div>
      </div>
    </div>
    <v-card-title
      style="line-height:1.5rem"
      class="text-body-1 text-md-h6 font-weight-medium pt-1"
    >
      {{ product.name }}
    </v-card-title>
    <v-card-subtitle class="pb-1">
      {{ product.brand.name }}
    </v-card-subtitle>
    <v-card-actions class="pt-0 actions-bar">
      <p class="mb-0 pl-2 text-subtitle-1 text-sm-h6">
        {{ product.price | groupNum }}
      </p>
      <v-spacer />
      <v-btn
        v-show="!addedInCart"
        :disabled="!product.stock"
        icon
        elevation="0"
        color="primary"
        @click.prevent="addToCart"
      >
        <v-icon v-show="product.stock">
          mdi-cart-plus
        </v-icon>
        <v-icon v-show="!product.stock" title="out-of-stock">
          mdi-cart-remove
        </v-icon>
      </v-btn>
      <v-btn
        v-show="addedInCart"
        icon
        elevation="0"
        @click.prevent="removeFromCard"
      >
        <v-icon>
          mdi-cart-minus
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ProductCard",
  filters: {
    groupNum(num) {
      const formatter = new Intl.NumberFormat("en-US");
      return "৳ " + formatter.format(Math.ceil(num));
    }
  },
  props: {
    product: { type: Object, default: () => ({ images: [] }) }
  },
  computed: {
    ...mapGetters("cart", ["cartItems"]),
    img() {
      return this.product.photo || this.product.images[0] || {};
    },
    imgSrc() {
      const smallSrc = this.img.formats?.small?.url;
      return smallSrc || this.img.url;
    },
    addedInCart() {
      return this.cartItems.some(item => item.product.id === this.product.id);
    }
  },
  methods: {
    ...mapMutations("cart", ["ADD_TO_CART", "REMOVE_FROM_CART"]),
    ...mapMutations(["SHOW_ALERT"]),
    addToCart() {
      if (!this.product.stock) {
        this.SHOW_ALERT("Out of Stock!");
      }
      this.ADD_TO_CART({ product: this.product, quantity: 1 });
      this.SHOW_ALERT("added to cart");
    },
    removeFromCard() {
      this.REMOVE_FROM_CART(this.product.id);
      this.SHOW_ALERT("removed from cart");
    }
  }
};
</script>
<style>
.product-card {
  padding-bottom: 42px;
}
.actions-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
