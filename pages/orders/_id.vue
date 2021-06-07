<template>
  <v-container>placeholder </v-container>
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
