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
        <tr v-for="(item, i) in cart" :key="item.product.id">
          <td>{{ i + 1 }}</td>
          <td>
            <v-avatar left>
              <v-img :src="item.product.thumbnail"></v-img>
            </v-avatar>
            {{ item.product.name }} ({{ item.variant }})
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
          <td class="text-right">{{ total }}</td>
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
export default {
  name: "Cart",
  data() {
    return {
      //
    };
  },
  computed: {
    cart() {
      return this.$store.getters["cart/cart"];
    },
    total() {
      return this.$store.getters["cart/cartTotal"];
    },
    isMobile() {
      this.$vuetify.breakpoints.xsOnly;
    }
  }
};
</script>

<style></style>
