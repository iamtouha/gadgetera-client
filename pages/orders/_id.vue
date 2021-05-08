<template>
  <v-container>
    <v-card color="transparent">
      <v-card-title class="justify-space-between">
        <!-- eslint-disable-next-line -->
        <h1 class="title">Order #{{ order.order_id }}</h1>

        <v-btn outlined large>
          {{ order.status }}
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        {{ order.createdAt | formatDate }}
      </v-card-subtitle>
      <v-card-text>
        <v-list class="rounded" subheader outlined>
          <v-list-item v-for="item in order.cart" :key="item.id">
            <v-list-item-avatar size="50">
              <v-img :src="item.product.images[0].formats.thumbnail.url" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.product.name }} &times; {{ item.quantity }}
              </v-list-item-title>
              <v-list-item-subtitle>
                &#2547;{{ Math.ceil(item.subtotal) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-simple-table class="transparent order-table text-subtitle-1">
          <tbody>
            <tr>
              <td>Cart total</td>
              <td>&#2547; {{ cartTotal }}</td>
            </tr>

            <tr v-if="order.coupon">
              <td>Discount ({{ order.coupon.code }})</td>
              <td>- &#2547; {{ order.coupon.discount }}</td>
            </tr>
            <tr v-if="order.coupon">
              <td>Discounted Total</td>
              <td>&#2547; {{ cartTotal - order.coupon.discount }}</td>
            </tr>
            <tr>
              <td>Shipping charge</td>
              <td>&#2547; {{ order.shipping_charge }}</td>
            </tr>
            <tr>
              <td class="text-subtitle-2">
                Subtotal
              </td>
              <td class="text-subtitle-2">
                &#2547;
                {{ Math.ceil(order.total) }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-card color="transparent">
      <v-card-title>
        Payment
      </v-card-title>
      <v-card-text>
        <v-simple-table class="transparent payment-table text-subtitle-1">
          <tbody>
            <tr v-if="order.cash_on_delivery">
              <td colspan="2">
                Cash On Delivery
              </td>
            </tr>
            <template v-else>
              <tr>
                <td>Payment Method</td>
                <td>{{ order.payment_method }}</td>
              </tr>
              <tr>
                <td>Transaction ID</td>
                <td>{{ order.trx_id }}</td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-card color="transparent">
      <v-card-title>
        Shipping Address
      </v-card-title>
      <v-card-text>
        <v-simple-table class="transparent payment-table text-subtitle-1">
          <tbody>
            <tr>
              <td>Receiver Name</td>
              <td>{{ order.address.receiver }}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{{ order.address.phone }}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{{ order.address.email }}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>
                {{ order.address.street_address }},
                {{ order.address.sub_district }}, {{ order.address.district }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Order",
  filters: {
    formatDate(val) {
      return new Date(val).toLocaleString();
    }
  },
  data: () => ({
    order: { cart: [], address: {} }
  }),
  async fetch() {
    try {
      const [order] = await this.$axios.$get(
        "/orders?order_id=" + this.$route.params.id
      );
      if (!order) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }
      this.order = order;
    } catch (error) {
      this.$nuxt.error(error);
    }
  },
  computed: {
    cartTotal() {
      const total = this.order.cart.reduce(
        (acc, curr) => (acc += curr.subtotal),
        0
      );
      return Math.ceil(total);
    }
  }
};
</script>

<style>
.payment-table {
  max-width: 600px;
}
.order-table {
  max-width: 600px;
}
.order-table tr td:last-of-type {
  text-align: right;
}
</style>
