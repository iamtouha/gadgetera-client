<template>
  <v-container>
    <v-skeleton-loader
      v-show="!content.banners.length"
      class="banner-skeleton"
      type="image"
    />
    <v-carousel
      continuous
      cycle
      :interval="7000"
      class="rounded"
      hide-delimiters
      show-arrows-on-hover
      height="auto"
    >
      <v-carousel-item v-for="banner in content.banners" :key="banner.title">
        <v-img
          class="main-banner-img"
          content-class="image-body"
          :alt="banner.title"
          :src="banner.content.url"
          :lazy-src="banner.content.formats.thumbnail.url"
        >
          <!-- banner overlay -->
          <v-overlay :opacity="0.6" absolute>
            <v-row justify="center" align="center" class="fill-height">
              <v-col cols="12" class="text-center ">
                <h1
                  class="text-h6 text-sm-h5 text-md-h4 font-weight-bold text-center mb-3"
                >
                  {{ banner.title }}
                </h1>
                <p
                  class="text-body-2 text-sm-subtitle-1 text-center mb-3 mb-sm-8"
                >
                  {{ banner.subtitle }}
                </p>
                <v-btn
                  large
                  class="hero-button"
                  color="accent"
                  elevation="0"
                  :href="banner.href"
                  target="_blank"
                >
                  {{ banner.hero_button }}
                </v-btn>
              </v-col>
            </v-row>
          </v-overlay>
          <!-- banner overlay end -->
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <!-- homepage carousel end -->

    <!-- featured products -->
    <h2 class="text-h5 text-sm-h4 text-center mb-10 mt-12">
      Featured Products
    </h2>
    <v-row class="mb-6">
      <v-col v-show="!content.featured_products.length" cols="12" md="6">
        <v-skeleton-loader type="article" />
      </v-col>
      <v-col
        v-for="product in content.featured_products"
        :key="product.id"
        class="featured-product"
        cols="12"
        md="6"
      >
        <featured-card :product="product" />
      </v-col>
    </v-row>
    <!-- featured products end -->

    <!-- brands -->
    <h2 class="text-h5 text-sm-h4 text-center mb-10 mt-12">
      Brands
    </h2>
    <v-row class="mb-6">
      <v-col v-show="!brands.length" cols="4" sm="3" md="2">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col v-for="brand in brands" :key="brand.id" cols="4" sm="3" md="2">
        <v-card nuxt :to="`/brands/${brand.key}`" outlined color="secondary">
          <v-img :aspect-ratio="1" contain :src="brand.logo.url" />
        </v-card>
      </v-col>
    </v-row>
    <!-- brands end -->
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      touchDevice: false,
      img: {},
      content: {
        banners: [],
        best_deals: [],
        featured_products: [],
        new_arrivals: []
      },
      categories: [],
      brands: []
    };
  },

  async fetch() {
    const [homepage, brands, categories] = await Promise.all([
      this.$axios.$get("/homepage"),
      this.$axios.$get("/brands"),
      this.$axios.$get("/categories")
    ]);
    this.content = homepage;
    this.img = homepage.banners[0].content;
    this.categories = categories;
    this.brands = brands;
  },
  head() {
    return {
      title: "Home",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Gadget Era is an online retail shop for top quality Mobile Accessories, Watches, Gadgets, Electronics and many more."
        },
        {
          hid: "og:image",
          name: "og:image",
          content: "/home-banner-placeholder.jpg"
        }
      ]
    };
  },
  computed: {
    isTouch() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    isTouchDevice() {
      if (!window) {
        return;
      }
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    }
  },

  methods: {}
};
</script>
<style lang="scss">
@import "~vuetify/src/styles/styles.sass";

.main-banner-img {
  height: 380px;
}
.banner-skeleton .v-skeleton-loader__image {
  height: 380px;
}
@media #{map-get(
    $display-breakpoints,
    "sm-and-down"
  )} {
  .main-banner-img {
    height: 280px;
  }
  .banner-skeleton .v-skeleton-loader__image {
    height: 280px;
  }
}
</style>
