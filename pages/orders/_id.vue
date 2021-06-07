<template>
  <v-container>
    <client-only>
      <template #placeholder>
        <v-skeleton-loader
          type="table-heading, list-item-two-line, table-tfoot"
        />
      </template>
      <v-card color="transparent">
        <v-card-title class="justify-space-between px-0">
          <!-- eslint-disable-next-line -->
          <h1 class="title">Order #{{ order.order_id }}</h1>

          <v-btn outlined color="accent" class="font-weight-bold" large>
            {{ order.status }}
          </v-btn>
        </v-card-title>
        <v-card-subtitle class="px-0">
          {{ order.createdAt | formatDate }}
        </v-card-subtitle>
      </v-card>

      <v-card v-if="order.status === 'delivered'" color="transparent">
        <v-card-title class="px-0">
          Products feedback
        </v-card-title>
        <v-card-subtitle class="px-0">
          Did you like our products? Please let others know.
        </v-card-subtitle>
        <v-card-text class="px-0">
          <v-sheet rounded outlined color="info">
            <v-stepper
              v-model="reviewStep"
              non-linear
              vertical
              class="elevation-0 transparent"
            >
              <template v-for="(item, i) in order.cart">
                <v-stepper-step
                  :key="item.id"
                  :step="i + 1"
                  @click="reviewStep = i + 1"
                >
                  {{ item.product.name }}
                </v-stepper-step>
                <v-stepper-content
                  :key="item.product.id"
                  class="pt-0"
                  :step="i + 1"
                >
                  <v-card color="transparent">
                    <v-card-text class="py-1 px-0">
                      <v-rating
                        v-model="reviews[i].rating"
                        color="accent"
                        :readonly="reviews[i].reviewed"
                        class="mb-2"
                      />

                      <v-textarea
                        v-model="reviews[i].message"
                        :readonly="reviews[i].reviewed"
                        :placeholder="
                          reviews[i].reviewed
                            ? ''
                            : 'Write your experience with ' + item.product.model
                        "
                        style="max-width:600px;"
                        rows="3"
                        hide-details
                        outlined
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        v-if="!reviews[i].reviewed"
                        :loading="reviewLoading"
                        text
                        class="primary"
                        @click="submitReview(i)"
                      >
                        submit review
                      </v-btn>
                      <v-btn text @click="reviewStep++">
                        {{ reviews[i].reviewed ? "next" : "skip" }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
              </template>
            </v-stepper>
          </v-sheet>
        </v-card-text>
      </v-card>
      <v-card color="transparent">
        <v-card-title v-if="order.status === 'delivered'" class="px-0">
          Cart
        </v-card-title>
        <v-card-text class="px-0">
          <v-list class="rounded" subheader outlined color="info">
            <v-list-item v-for="item in order.cart" :key="item.id">
              <v-list-item-avatar size="50">
                <v-img :src="item.product.images[0].formats.thumbnail.url" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.product.name }} &times; {{ item.quantity }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ Math.ceil(item.subtotal) | groupNum }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-simple-table class="transparent order-table text-subtitle-1">
            <tbody>
              <tr>
                <td>Cart total</td>
                <td>{{ cartTotal | groupNum }}</td>
              </tr>

              <tr v-if="order.coupon">
                <td>Discount ({{ order.coupon.code }})</td>
                <td>- {{ order.coupon.discount | groupNum }}</td>
              </tr>
              <tr v-if="order.coupon">
                <td>Discounted Total</td>
                <td>{{ (cartTotal - order.coupon.discount) | groupNum }}</td>
              </tr>
              <tr>
                <td>Shipping charge</td>
                <td>{{ order.shipping_charge | groupNum }}</td>
              </tr>
              <tr>
                <td class="text-subtitle-2">
                  Subtotal
                </td>
                <td class="text-subtitle-2">
                  {{ Math.ceil(order.total) | groupNum }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <v-card color="transparent">
        <v-card-title class="px-0">
          Payment
        </v-card-title>
        <v-card-text class="px-0">
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
        <v-card-title class="px-0">
          Shipping Address
        </v-card-title>
        <v-card-text class="px-0">
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
    </client-only>
  </v-container>
</template>

<script>
export default {
  name: "Order",
  filters: {
    formatDate(val) {
      return new Date(val).toLocaleString();
    },
    groupNum(price) {
      if (!price) {
        return "";
      }
      const formatter = new Intl.NumberFormat("en-US");
      return "৳ " + formatter.format(price);
    }
  },
  data: () => ({
    order: { cart: [], address: {} },
    reviews: [],
    reviewStep: 1,
    reviewLoading: false
  }),
  async fetch() {
    try {
      const [orders, reviews] = await Promise.all([
        this.$axios.$get("/orders?order_id=" + this.$route.params.id),
        this.$axios.$get("/reviews?order.order_id=" + this.$route.params.id)
      ]);
      if (!orders[0]) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }
      this.order = orders[0];
      this.reviews = this.order.cart.map(cartItem => {
        const review = reviews.find(
          item => item.product.id === cartItem.product.id
        );
        return {
          order: this.order.id,
          product: cartItem.product.id,
          rating: review?.rating || null,
          message: review?.message || "",
          reviewed: !!review,
          user: this.order.address.receiver
        };
      });
    } catch (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    return {
      title: "Order Details"
    };
  },
  computed: {
    cartTotal() {
      const total = this.order.cart.reduce(
        (acc, curr) => (acc += curr.subtotal),
        0
      );
      return Math.ceil(total);
    }
  },
  mounted() {},
  methods: {
    async submitReview(index) {
      const review = this.reviews[index];
      try {
        this.reviewLoading = true;
        const { rating, message, order, product } = review;
        if (!rating) {
          this.$store.commit("SHOW_ALERT", "Please rate the product");
          return;
        }
        await this.$axios.$post("/reviews", {
          rating: +rating,
          message,
          order,
          product
        });
        this.reviewStep++;
        review.reviewed = true;
        this.$store.commit("SHOW_ALERT", "Thanks for your feedback");
      } catch (error) {
        // eslint-disable-next-line
        console.log(error.message);
      } finally {
        this.reviewLoading = false;
      }
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
