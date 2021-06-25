<template>
  <client-only>
    <v-btn
      v-if="!addedInCart"
      class="d-sm-block d-none add2cart-btn mt-3 font-weight-medium"
      elevation="0"
      height="44px"
      color="accent"
      @click="addToCart"
    >
      <v-icon left>
        mdi-cart-plus
      </v-icon>
      add to cart
    </v-btn>
    <v-btn
      v-else
      outlined
      class="d-sm-block d-none add2cart-btn mt-3 font-weight-medium"
      elevation="0"
      height="44px"
      color="accent"
      @click="removeFromCart"
    >
      <v-icon left>
        mdi-cart-minus
      </v-icon>
      remove from cart
    </v-btn>

    <v-btn
      v-if="!addedInCart"
      fab
      bottom
      right
      fixed
      color="accent"
      class="d-sm-none "
      @click="addToCart"
    >
      <v-icon>mdi-cart-plus</v-icon>
    </v-btn>
    <v-btn
      v-else
      fab
      bottom
      right
      fixed
      class="d-sm-none"
      @click="removeFromCart"
    >
      <v-icon>mdi-cart-minus</v-icon>
    </v-btn>
  </client-only>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "CartButtons",
  props: {
    product: { type: Object, default: () => ({}) }
  },
  computed: {
    ...mapGetters("cart", ["cartItems"]),
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
    removeFromCart() {
      this.REMOVE_FROM_CART(this.product.id);
      this.SHOW_ALERT("removed from cart");
    }
  }
};
</script>
