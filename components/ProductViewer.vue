<template>
  <v-row>
    <v-col cols="12" sm="6">
      <div v-show="!product.images.length" class="responsive">
        <div class="sizer">
          <div class="wrapper">
            <v-skeleton-loader
              class="product-image-skeleton"
              min-height="400px"
              type="image"
            />
          </div>
        </div>
      </div>

      <v-carousel
        height="auto"
        hide-delimiters
        show-arrows-on-hover
        cycle
        dark
        show-arrows
        :interval="10000"
      >
        <v-carousel-item v-for="img in product.images" :key="img.id">
          <div class="responsive rounded">
            <div class="sizer">
              <div class="wrapper">
                <img
                  style="max-height:600px;"
                  :src="img | small"
                  :alt="img.alternativeText"
                  :title="img.caption"
                />
              </div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-col>
    <v-col cols="12" sm="6">
      <div v-show="!product.id" class="d-contents info-placeholder">
        <v-skeleton-loader type="chip" />
        <v-skeleton-loader type="heading" max-width="300px" class="my-7" />
        <v-skeleton-loader type="text" />
        <v-skeleton-loader max-width="350px" type="text" />
        <v-skeleton-loader type="text" />
        <v-skeleton-loader max-width="100px" type="text" />
      </div>
      <h1 class="text-h6 text-md-h5 mb-3 font-weight-medium">
        {{ product.name }}
      </h1>
      <h2
        :class="[reviews.length ? '' : 'mb-3']"
        class="text-h6 font-weight-medium"
      >
        <span class="primary--text">
          {{ (product.sale_price || product.price) | groupNum }}
        </span>
        <span
          v-show="product.sale_price"
          class="primary--text text-body-1 font-weight-medium"
          style="text-decoration:line-through;"
        >
          <span class="font--text">
            {{ product.price | groupNum }}
          </span>
        </span>
        <sup v-show="product.sale_price" class="text-body-1">
          ({{ product | calcDiscount }}% off)
        </sup>
      </h2>

      <v-btn
        v-show="reviews.length"
        text
        tile
        color="primary"
        class="mb-2 px-0 text-lowercase font-weight-medium"
        @click="scrollToReviews"
      >
        view reviews (
        <span class="accent--text">
          {{ rating }}
        </span>
        <v-icon color="accent">
          mdi-star
        </v-icon>
        )
      </v-btn>

      <p class="text-body-2 mb-0">
        {{ product.overview }}
      </p>
      <v-col class="px-0 share-social-row">
        <p class="mb-0 d-inline-block">
          share on:&nbsp;
        </p>
        <ShareNetwork
          v-for="{ network, icon, color } in networks"
          :key="network"
          :network="network"
          :url="'https://gadgeterabd.com/products/' + product.slug"
          :title="product.name"
          :description="product.overview"
        >
          <v-btn icon :aria-label="network" class="mr-1">
            <v-icon :color="color">
              {{ icon }}
            </v-icon>
          </v-btn>
        </ShareNetwork>
        <v-btn icon aria-label="copy link" @click="copyToClipboard">
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </v-col>
      <p class="text-subtitle font-weight-medium">
        Options
      </p>
      <v-row class="mb-3">
        <v-col v-show="!options.length" cols="3" lg="2">
          <div class="responsive rounded">
            <div class="sizer">
              <div class="wrapper">
                <v-skeleton-loader type="image" />
              </div>
            </div>
          </div>
        </v-col>
        <v-col v-for="option in options" :key="option.id" cols="3" lg="2">
          <v-card
            elevation="0"
            :to="'/products/' + option.slug"
            nuxt
            active-class="option-active"
          >
            <v-img
              :src="option.thumb"
              aspect-ratio="1"
              :title="option.name"
              :alt="option.name"
            >
              <v-overlay absolute class="option-overlay">
                <v-icon>
                  mdi-check-circle
                </v-icon>
              </v-overlay>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-simple-table dense class="transparent">
        <tbody style="cursor:pointer">
          <tr>
            <th>Model</th>
            <td>
              <v-skeleton-loader v-show="!product.id" type="text" />
              {{ product.model }}
            </td>
          </tr>
          <tr>
            <th>SKU</th>
            <td>
              <v-skeleton-loader v-show="!product.id" type="text" />
              {{ product.sku }}
            </td>
          </tr>
          <tr>
            <th>Status</th>
            <td>
              <v-skeleton-loader v-show="!product.id" type="text" />
              <span
                v-show="product.id"
                :class="product.stock ? 'primary--text' : 'accent--text'"
              >
                {{ product.stock ? "Available in stock" : "Out of Stock" }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-row class="px-2 mt-6 mx-auto add2cart-row">
        <v-spacer class="d-sm-block d-none" />
        <cart-buttons :product="product" />
      </v-row>
    </v-col>
    <v-sheet
      class="d-sm-none mobile-cart-sheet d-flex rounded-top pa-3 align-center justify-space-between elevation-6"
    >
      <h2 class="text-h6 font-weight-medium pr-2">
        {{ (product.sale_price || product.price) | groupNum }}
      </h2>
      <cart-buttons mobile-view :product="product" />
    </v-sheet>
  </v-row>
</template>

<script>
/* eslint-disable camelcase */

export default {
  name: "ProductView",
  filters: {
    calcDiscount(product) {
      const { price, sale_price } = product;
      if (!product.sale_price) {
        return "";
      }
      const discount = (100 * (price - sale_price)) / price;
      return Math.ceil(discount);
    },
    groupNum(price) {
      if (!price) {
        return "";
      }
      const formatter = new Intl.NumberFormat("en-US");
      return "৳ " + formatter.format(price);
    },
    thumb(img) {
      return img.formats?.thumbnail.url || img.url;
    },
    small(img) {
      return img.formats?.small?.url || img.url;
    }
  },
  props: {
    product: { type: Object, default: () => ({}) },
    options: { type: Array, default: () => [] },
    reviews: { type: Array, default: () => [] }
  },
  data: () => ({
    networks: [
      { network: "facebook", icon: "mdi-facebook", color: "#3b5998" },
      {
        network: "messenger",
        icon: "mdi-facebook-messenger",
        color: "#006AFF"
      },
      { network: "whatsapp", icon: "mdi-whatsapp", color: "#4FCE5D" },
      { network: "twitter", icon: "mdi-twitter", color: "#00acee" }
      // { network: "email", icon: "mdi-at" }
    ]
  }),
  computed: {
    rating() {
      if (!this.reviews.length) {
        return "N/A";
      }
      const total = this.reviews.reduce((acc, cur) => {
        acc += cur.rating;
        return acc;
      }, 0);
      return (Math.round((total / this.reviews.length) * 10) / 10).toFixed(1);
    }
  },
  methods: {
    scrollToReviews() {
      const review = document.getElementById("reviews");
      const top = review.offsetTop;
      window.scrollTo({ top, behavior: "smooth" });
    },
    copyToClipboard() {
      if (!navigator.clipboard) {
        return;
      }
      navigator.clipboard.writeText(window.location.href);
      this.$store.commit("SHOW_ALERT", "Link copied to clipboard");
    }
  }
};
</script>

<style>
.mobile-cart-sheet {
  position: fixed;
  z-index: 12;
  bottom: 0;
  left: 0;
  right: 0;
}
.share-social-row a {
  display: inline-block;
  text-decoration: none;
}
</style>
