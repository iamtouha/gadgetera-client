<template>
  <v-container>
    <h1 class="display-2 mb-6">Cart</h1>
    <v-simple-table>
      <thead>
        <tr>
          <th>#</th>
          <th>name</th>
          <th class="text-right" style="width:100px;">price(BDT)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in cart" :key="item.product.id + item.variant.id">
          <td>{{ i + 1 }}</td>
          <td>
            <v-avatar class="" left>
              <v-img :src="item.product.thumbnail"></v-img>
            </v-avatar>
            {{ item.product.name }} ({{ item.variant.title }})
            <span class="mx-2">&times;</span>
            {{ item.quantity }}
          </td>
          <td class="text-right">{{ item.quantity * item.price }}</td>
          <td>
            <v-btn
              text
              icon
              small
              color="red"
              @click="$store.commit('cart/removeFromCart', item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td class="text-right" colspan="2">cart total:</td>
          <td class="text-right">{{ cartTotal }}</td>
          <td></td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-row justify="center">
      <v-col class="text-center mt-4">
        <v-btn color="accent" class="black--text" large to="/checkout">
          checkout
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Cart",
  data() {
    return {
      //
    };
  },
  head: {
    title: "Cart"
  },
  computed: {
    ...mapGetters("cart", ["cart", "cartTotal", "discount"]),

    isMobile() {
      this.$vuetify.breakpoints.xsOnly;
    }
  },
  watch: {
    cartTotal(val) {
      if (!this.discount) return;
      if (val < this.discount.minimum_order) {
        this.$store.commit("cart/addDiscount", null);
      }
    }
  }
};
</script>

<style></style>
