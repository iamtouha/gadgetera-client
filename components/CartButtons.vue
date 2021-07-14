<template>
  <div class="d-contents">
    <client-only>
      <template #placeholder>
        <v-btn class="add2cart-btn flex-grow-1 mt-sm-3" elevation="0" disabled>
          Loading...
        </v-btn>
      </template>
      <span>
        <v-btn
          v-if="addedInCart"
          outlined
          class="add2cart-btn flex-grow-1 mt-sm-3"
          :class="[mobileView ? '' : 'd-none d-sm-block']"
          elevation="0"
          color="accent"
          :large="!isMobile"
          @click="REMOVE_FROM_CART(product.id)"
        >
          <v-icon left>
            mdi-cart-minus
          </v-icon>
          remove
        </v-btn>
        <v-btn
          v-else
          :disabled="!product.stock"
          class="add2cart-btn flex-grow-1 mt-sm-3"
          elevation="0"
          :class="[mobileView ? '' : 'd-none d-sm-block']"
          color="accent"
          :large="!isMobile"
          @click="addToCart"
        >
          <v-icon left>
            mdi-cart-plus
          </v-icon>
          add to cart
        </v-btn>
      </span>
    </client-only>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CartButtons",
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    mobileView: Boolean
  },

  computed: {
    ...mapGetters("cart", ["cartItems"]),

    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
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
    }
  },
  mounted() {
    if (!this.product.stock && this.addedInCart) {
      this.REMOVE_FROM_CART(this.product.id);
    }
  }
};
</script>
<style scoped>
.add2cart-btn {
  font-weight: 600;
  max-width: 200px;
}
@media (min-width: 600px) {
  .cart-bottom-sheet {
    display: none !important;
  }
}
</style>
