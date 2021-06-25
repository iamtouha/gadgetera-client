<template>
  <v-container class="pa-0" fluid>
    <v-container>
      <v-skeleton-loader
        v-show="!bredcrumbItems.length"
        class="mt-6 mb-3 bredcrumb"
        max-width="700px"
        type="text"
      />
      <v-breadcrumbs
        v-show="bredcrumbItems.length"
        class="pl-0 bredcrumb"
        :items="bredcrumbItems"
      />
      <product-viewer
        :product="product"
        :options="options"
        :reviews="reviews"
      />
    </v-container>

    <v-container class="my-10 px-0 px-sm-3">
      <v-card class="description-wrapper">
        <v-card-title class="text-headline font-weight-medium">
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

    <v-container class="my-10 ">
      <reviews-card :reviews="reviews" :loading="loadingReviews" />
    </v-container>
  </v-container>
</template>

<script>
import "~/assets/ck_style.css";
import extractor from "keyword-extractor";

export default {
  name: "Product",

  layout: "no-extension",
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
      const resources = this.$repositories;
      const [product] = await resources.product.get({ slug });
      if (!product) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }
      this.product = product;
      // eslint-disable-next-line prefer-const
      let [options, subcat] = await Promise.all([
        resources.product.get({ model: product.model }),
        resources.subcategory.getOne(product.subcategory.id)
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
        { hid: "og:description", name: "og:description", content: overview },
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
          to: `/subcategories/${subcategory.key}`,
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
  display: none !important;
}
.option-active {
  cursor: default !important;
}
.option-active .option-overlay {
  display: flex !important;
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
    max-width: 100%;
    overflow-x: auto;
  }
  .add2cart-btn {
    width: 100%;
    max-width: 350px;
  }
  .add2cart-row {
    justify-content: center;
  }
}
@media #{map-get(
    $display-breakpoints,
    "xs-only"
  )} {
  .bredcrumb {
    display: none !important;
  }
}
</style>
