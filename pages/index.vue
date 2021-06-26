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

    <v-slide-group show-arrows="always" mobile-breakpoint="600" class="my-8">
      <v-slide-item v-for="product in content.best_deals" :key="product.id">
        <v-card
          width="200px"
          class="ma-2 ma-sm-4"
          nuxt
          outlined
          :to="'/products/' + product.slug"
        >
          <v-img
            :src="product.images[1].url"
            aspect-ratio="1"
            class="align-end"
            :title="product.name"
          >
            <div class="pb-3" style="text-align:center;">
              <v-chip class="mx-auto elevation-2" color="primary">
                {{ product | calcDiscount }}% OFF
              </v-chip>
            </div>
          </v-img>
        </v-card>
      </v-slide-item>
      <div v-show="!content.best_deals.length" class="d-contents">
        <v-slide-item>
          <v-skeleton-loader class="pa-4 rounded" width="200px" type="image" />
        </v-slide-item>
        <v-slide-item>
          <v-skeleton-loader class="pa-4 rounded" width="200px" type="image" />
        </v-slide-item>
        <v-slide-item>
          <v-skeleton-loader class="pa-4 rounded" width="200px" type="image" />
        </v-slide-item>
      </div>
    </v-slide-group>
    <v-row class="mt-8">
      <v-col
        v-for="item in resolutions"
        :key="item.icon"
        cols="12"
        sm="6"
        md="3"
      >
        <v-list-item two-line>
          <v-list-item-avatar size="40">
            <v-icon size="40">
              {{ item.icon }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title text-wrap">
              {{ item.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-wrap subtitle-1">
              {{ item.text }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-divider class="my-8" />
    <!-- subcategories start -->
    <h2 class="text-h5 text-center mb-6 mt-12">
      Browse Popular categories
    </h2>
    <v-row class="mb-12">
      <v-col v-show="!content.subcategories.length" cols="12" sm="6">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col
        v-for="subcat in content.subcategories"
        :key="subcat.id"
        cols="12"
        sm="4"
        md="3"
      >
        <v-card
          nuxt
          max-width="300px"
          class="mx-auto"
          :to="`/subcategories/${subcat.key}`"
        >
          <v-img aspect-ratio="2" :src="subcat.cover.formats.small.url">
            <v-overlay absolute class="align-center justify-center">
              <div class="pa-4 text-center title">
                {{ subcat.name }}
              </div>
            </v-overlay>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <!-- subcategories end -->

    <!-- brands -->
    <h2 class="text-h5 text-center mb-6 mt-12">
      Top Brands
    </h2>
    <v-row justify="center" class="mb-6">
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
    <h2
      v-show="content.testimonials.length"
      class="text-h5 text-center mb-6 mt-12"
    >
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
      <v-slide-item v-show="loading">
        <v-skeleton-loader width="350px" type="card" />
      </v-slide-item>
    </v-slide-group>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
      loading: false,
      img: {},
      resolutions: [
        {
          icon: "mdi-seal-variant",
          title: "Premium Quality",
          text: "Every product in our store."
        },
        {
          icon: "mdi-piggy-bank-outline",
          title: "Reasonable Price",
          text: "For making our product more accessible to you."
        },
        {
          icon: "mdi-truck-fast-outline",
          title: "Fast delivery",
          text: "Anywhere in Bangladesh."
        },
        {
          icon: "mdi-face-agent",
          title: "Support 24/7",
          text: "Contact us 24 hours a day."
        }
      ],
      categories: [],
      brands: []
    };
  },

  async fetch() {
    this.loading = true;
    const error = await this.getHomepageContent();
    if (error) {
      this.$nuxt.error(error);
    }
    this.loading = false;
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
    ...mapGetters({
      content: "app/homepageContent"
    }),
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

  methods: {
    ...mapActions("app", ["getHomepageContent"])
  }
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
