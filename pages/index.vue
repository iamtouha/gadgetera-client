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
                  :to="banner.href"
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
    <v-row class="my-6">
      <v-col v-show="!content.featured_products.length" cols="12" sm="6">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col v-show="!content.featured_products.length" cols="12" sm="6">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-slide-group mobile-breakpoint="600">
        <v-slide-item
          v-for="product in content.featured_products"
          :key="product.id"
        >
          <featured-card :product="product" />
        </v-slide-item>
      </v-slide-group>
    </v-row>
    <!-- featured products end -->

    <!-- subcategories start -->
    <h2 class="text-h5 text-center mb-6 mt-12">
      Popular categories
    </h2>
    <v-row>
      <v-col v-show="!content.subcategories.length" cols="12" sm="6">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col
        v-for="subcat in content.subcategories"
        :key="subcat.id"
        cols="12"
        sm="6"
      >
        <v-card nuxt :to="`/subcategories/${subcat.key}`">
          <v-img aspect-ratio="2" :src="subcat.cover.formats.small.url">
            <v-overlay absolute class="align-end justify-start">
              <div class="pa-4 headline">
                {{ subcat.name }}
              </div>
            </v-overlay>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <!-- subcategories end -->

    <!-- best deals start -->
    <h2 class="text-h5 text-center mb-6 mt-12">
      Best Deals
    </h2>
    <v-slide-group mobile-breakpoint="600" class="pa-4">
      <v-slide-item v-for="product in content.best_deals" :key="product.id">
        <v-card
          width="200px"
          class="ma-4"
          nuxt
          outlined
          :to="'/products/' + product.slug"
        >
          <v-img
            :src="product.images[0].url"
            aspect-ratio="1"
            class="align-center"
          >
            <div style="text-align:center;">
              <v-chip class="mx-auto elevation-2" color="primary">
                {{ product | calcDiscount }}% OFF
              </v-chip>
            </div>
          </v-img>
        </v-card>
      </v-slide-item>
      <v-slide-item v-show="!content.best_deals.length">
        <v-skeleton-loader width="200px" type="image" />
      </v-slide-item>
    </v-slide-group>
    <!-- best deals end -->

    <!-- brands -->
    <h2 class="text-h5 text-center mb-6 mt-12">
      Top Brands
    </h2>
    <v-row class="mb-6">
      <v-col v-show="!content.top_brands.length" cols="4" sm="3" md="2">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col
        v-for="brand in content.top_brands"
        :key="brand.id"
        cols="4"
        sm="3"
        md="2"
      >
        <v-card nuxt :to="`/brands/${brand.key}`" outlined color="secondary">
          <v-img :aspect-ratio="1" contain :src="brand.logo.url" />
        </v-card>
      </v-col>
    </v-row>
    <!-- brands end -->
    <!-- testimonials -->
    <h2 class="text-h5 text-center mb-6 mt-12">
      Testimonials
    </h2>
    <v-slide-group center-active mobile-breakpoint="600" class="pa-4">
      <v-slide-item v-for="user in content.testimonials" :key="user.id">
        <v-card width="350px" color="transparent" class="ma-4">
          <v-card-title>
            <v-list-item two-line class="pa-0">
              <v-list-item-avatar>
                <v-img :src="user.photo.formats.thumbnail.url" />
              </v-list-item-avatar>
              <v-list-item-content class="py-0">
                <v-list-item-title>
                  {{ user.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ user.affiliation }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-title>
          <v-card-text>
            {{ user.message }}
          </v-card-text>
        </v-card>
      </v-slide-item>
      <v-slide-item v-show="!content.testimonials.length">
        <v-skeleton-loader width="350px" type="card" />
      </v-slide-item>
    </v-slide-group>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  filters: {
    calcDiscount(product) {
      const { price, sale_price } = product;
      if (!product.sale_price) {
        return 0;
      }
      const discount = (100 * (price - sale_price)) / price;
      return Math.ceil(discount);
    }
  },
  data() {
    return {
      touchDevice: false,
      img: {},
      content: {
        banners: [],
        best_deals: [],
        featured_products: [],
        top_brands: [],
        testimonials: [],
        subcategories: []
      },
      categories: [],
      brands: []
    };
  },

  async fetch() {
    const homepage = await this.$axios.$get("/homepage");
    this.content = homepage;
    this.img = homepage.banners[0].content;
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
