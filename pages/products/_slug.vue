<template>
  <v-container class="px-0 px-sm-3" fluid>
    <v-container>
      <v-skeleton-loader v-if="!bredcrumbItems.length" type="heading" />
      <v-breadcrumbs class="pl-0" :items="bredcrumbItems" />
      <v-row>
        <v-col cols="12" sm="6">
          <div v-show="!product.images.length" class="responsive rounded">
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
            hide-delimiter-background
            cycle
            :show-arrows="false"
            :interval="10000"
          >
            <v-carousel-item v-for="img in product.images" :key="img.id">
              <div class="responsive rounded">
                <div class="sizer">
                  <div class="wrapper">
                    <img
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
          <h1 class="text-md-h4 text-h6 mb-3 font-weight-bold">
            {{ product.name }}
          </h1>
          <h2
            v-if="!product.discount"
            class="mb-3 text-h6 primary--text font-weight-bold"
          >
            {{ product.price | groupNum }}
          </h2>
          <h2 v-else class="text-body-1">
            <span class="text-h6 primary--text font-weight-bold">
              {{
                Math.ceil(product.price - product.price * product.discount)
                  | groupNum
              }}
            </span>
            <span class="font-weight-bold ml-1 text-body-1">
              ( {{ Math.ceil(100 * product.discount) }}% off)
            </span>
          </h2>
          <v-btn
            v-show="reviews.length"
            text
            color="primary"
            class="my-2 px-0 text-lowercase font-weight-bold"
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
          <p>
            {{ product.overview }}
          </p>
          <p class="text-subtitle font-weight-bold">
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
                  <span v-show="product.id">
                    {{ product.stock ? "Available in stock" : "Out of Stock" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-row class="px-2 mt-6 mx-auto add2cart-row">
            <v-spacer class="d-sm-block d-none" />

            <v-btn
              class="d-sm-block d-none add2cart-btn mt-3 "
              elevation="0"
              height="44px"
              color="accent"
              @click="addToCart"
            >
              <v-icon left>
                mdi-cart-plus
              </v-icon>
              add to cart
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-btn
      fab
      bottom
      right
      fixed
      color="accent"
      class="d-sm-none "
      @click="addToCart"
    >
      <v-icon>mdi-cart-plus</v-icon>
    </v-btn>

    <v-container class="px-0 px-sm-3">
      <v-card class="my-10 description-wrapper">
        <v-card-title class="title font-weight-bold">
          Product Description
        </v-card-title>
        <v-card-text>
          <div class="description-box">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <section class="ck-content" v-html="product.description" />
          </div>
        </v-card-text>
      </v-card>
    </v-container>

    <v-container>
      <v-card id="reviews">
        <v-card-title class="title font-weight-bold">
          Product Reviews
        </v-card-title>
        <v-card-text>
          <v-list
            max-width="540px"
            max-height="800px"
            style="overflow-y:auto;"
            color="transparent"
          >
            <v-list-item v-show="!reviews.length">
              no reviews found
            </v-list-item>
            <v-list-item v-for="review in reviews" :key="review.id" three-line>
              <v-list-item-content>
                <v-list-item-title class="title font-weight-bold">
                  {{ review.user_name }}
                </v-list-item-title>
                <v-list-item-subtitle class="body-2 primary--text">
                  {{ review.createdAt | formatDate }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="subtitle-1 mt-2 font-weight-bold">
                  {{ review.message }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <span class="font-weight-bold text-subtitle-1 accent--text">
                  {{ review.rating }}
                  <v-icon color="accent">
                    mdi-star
                  </v-icon>
                </span>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import "~/assets/ck_style.css";
import extractor from "keyword-extractor";

export default {
  name: "Product",
  filters: {
    groupNum(price) {
      if (!price) {
        return "";
      }
      const formatter = new Intl.NumberFormat("en-US");
      return "৳ " + formatter.format(price);
    },
    formatDate(val) {
      return new Date(val).toLocaleString();
    },
    thumb(img) {
      return img.formats?.thumbnail.url || img.url;
    },
    small(img) {
      return img.formats?.small?.url || img.url;
    }
  },
  data: () => ({
    image: {},
    options: [],
    reviews: [],
    loadingReviews: false,
    product: {
      images: [],
      brand: {},
      description: ""
    },
    subcategory: {
      category: {}
    }
  }),

  async fetch() {
    try {
      const slug = this.$route.params.slug;
      const [product] = await this.$axios.$get("/products?slug=" + slug);
      if (!product) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }
      this.product = product;
      // eslint-disable-next-line prefer-const
      let [options, subcat] = await Promise.all([
        this.$axios.$get("/products?model=" + product.model),
        this.$axios.$get("/subcategories/" + product.subcategory.id)
      ]);
      if (!product.model) {
        options = [product];
      }
      this.options = options.map(option => ({
        id: option.id,
        thumb: option.images[0].formats?.thumbnail.url || option.images[0].url,
        name: option.name,
        slug: option.slug
      }));

      this.subcategory = subcat;
      this.image = this.product.images[0];
    } catch (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    if (!this.product.id) {
      return {
        title: "Loading..."
      };
    }
    const { name, overview, slug } = this.product;
    const keywords = extractor.extract(`${name}. ${overview}`, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true
    });
    return {
      title: name,
      meta: [
        { hid: "description", name: "description", content: overview },
        { hid: "keywords", name: "keywords", content: keywords },
        {
          hid: "og:url",
          name: "og:url",
          content: `${process.env.BASE_URL ||
            "https://gadgeterabd.com"}/products/${slug}`
        },
        { hid: "og:title", name: "og:title", content: name },
        { hid: "og:desc", name: "og:description", content: overview },
        { hid: "og:image", name: "og:image", content: this.imageUrl },
        { hid: "image", name: "image", content: this.imageUrl },
        { hid: "twitter:card", name: "twitter:card", content: "summary" }
      ]
    };
  },
  computed: {
    imageUrl() {
      return this.image.formats?.small?.url || this.image.url;
    },
    rating() {
      if (!this.reviews.length) {
        return "N/A";
      }
      const total = this.reviews.reduce((acc, cur) => {
        acc += cur.rating;
        return acc;
      }, 0);
      return (Math.round((total / this.reviews.length) * 10) / 10).toFixed(1);
    },
    bredcrumbItems() {
      const subcategory = this.subcategory;
      const category = this.subcategory.category;
      const brand = this.product.brand;
      if (!subcategory.id) {
        return [];
      }
      return [
        { to: `/categories/${category.key}`, text: category.name },
        {
          to: `/categories/${category.key}/subs/${subcategory.key}`,
          text: subcategory.name
        },
        { to: `/brands/${brand.key}`, text: brand.name },
        {
          text: this.product.name
        }
      ];
    }
  },
  mounted() {
    this.fetchReviews();
  },
  methods: {
    addToCart() {
      if (!this.product.stock) {
        return this.$store.commit("SHOW_ALERT", "Out of Stock!");
      }
      this.$store.commit("cart/ADD_TO_CART", {
        product: this.product,
        quantity: 1
      });
      this.$store.commit("SHOW_ALERT", "added to cart");
    },
    async fetchReviews() {
      try {
        this.loadingReviews = true;
        const reviews = await this.$axios.$get(
          "/reviews?product.slug=" + this.$route.params.slug
        );
        this.reviews = reviews;
      } catch (error) {
        //
      } finally {
        this.loadingReviews = false;
      }
    },
    scrollToReviews() {
      const review = document.getElementById("reviews");
      const top = review.offsetTop;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.product-image-skeleton .v-skeleton-loader__image {
  height: 500px;
}
.info-placeholder .v-skeleton-loader__chip {
  width: 100%;
}
.option-overlay {
  display: none;
}
.option-active {
  cursor: default !important;
}
.option-active .option-overlay {
  display: flex;
}

.option-active {
  outline: 10px;
}
.description-box {
  all: unset;
}
</style>
<style lang="scss">
@import "~vuetify/src/styles/styles.sass";
@media #{map-get(
    $display-breakpoints,
    "sm-and-down"
  )} {
  .product-image-skeleton .v-skeleton-loader__image {
    height: 450px;
  }
  .description-wrapper {
    border-radius: 0 !important;
  }
  .add2cart-btn {
    width: 100%;
    max-width: 350px;
  }
  .add2cart-row {
    justify-content: center;
  }
}
</style>
