<template>
  <v-list max-height="600px" class="rounded cart-list">
    <v-list-item
      v-for="item in cartItems"
      :key="item.product.id"
      :to="'/products/' + item.product.slug"
      nuxt
      class="cart-list-item"
    >
      <v-list-item-avatar>
        <v-img :src="item.product.image" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title> {{ item.product.name }} </v-list-item-title>
        <v-list-item-subtitle>
          {{ (item.product.sale_price || item.product.price) | groupNum }}
          &times;
          <span class="item-qty">
            {{ item.quantity }}
          </span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-show="incrementBtns">
        <v-text-field
          class="quantity-field"
          dense
          :value="item.quantity"
          readonly
          hide-details
          append-icon="mdi-plus-circle"
          prepend-inner-icon="mdi-minus-circle"
          @click:append.prevent="INCREMENT(item.product.id)"
          @click:prepend-inner.prevent="DECREMENT(item.product.id)"
        />
      </v-list-item-action>
      <v-list-item-action v-show="!incrementBtns">
        <v-btn small icon @click.prevent="REMOVE_FROM_CART(item.product.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-list-item v-show="!cartItems.length">
      <v-list-item-title>
        No products added
      </v-list-item-title>
    </v-list-item>
    <v-list-item v-show="checkoutBtn" class="action-item">
      <v-list-item-content>
        <v-spacer />
        <v-btn v-show="closebtn" class="close-btn" text @click="$emit('close')">
          Close
        </v-btn>
        <v-btn text class="primary" @click="toCheckout">
          Checkout
        </v-btn>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Cart",
  filters: {
    groupNum(price) {
      if (!price) {
        return "";
      }
      const formatter = new Intl.NumberFormat("en-US");
      return "৳ " + formatter.format(price);
    }
  },
  props: {
    closebtn: Boolean,
    checkoutBtn: { type: Boolean, default: true },
    incrementBtns: Boolean
  },
  computed: {
    ...mapGetters("cart", ["cartItems"])
  },

  methods: {
    ...mapMutations("cart", ["REMOVE_FROM_CART", "INCREMENT", "DECREMENT"]),
    toCheckout() {
      this.$emit("close");
      this.$nuxt.$router.push("/checkout");
    }
  }
};
</script>

<style lang="scss">
@import "~vuetify/src/styles/styles.sass";

.quantity-field {
  max-width: 80px !important;
  .v-text-field__slot {
    input {
      text-align: center !important;
      padding: 0 !important;
    }
  }
  .v-input__slot {
    padding: 0 4px !important;
  }
  .v-input__slot::before {
    border: unset !important;
  }
  .v-input__slot::after {
    border: unset !important;
  }
  .v-icon {
    font-size: 22px;
  }
}

@media #{map-get(
    $display-breakpoints,
    "sm-and-up"
  )} {
  .cart-list {
    max-width: 400px;
  }
}
</style>
