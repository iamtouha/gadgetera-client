<template>
  <div style="display:contents;">
    <v-container style="max-width:1920px;" class="pa-0">
      <v-img :src="cover" :lazy-src="thumbnail" class="subcategory-cover">
        <v-overlay class="align-end justify-start" absolute>
          <v-card dark width="100%" color="transparent">
            <v-card-title class="text-h5 text-md-h4 text-lg-h3">
              {{ subcategory.name }}
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1">
              {{ subcategory.description }}
            </v-card-subtitle>
          </v-card>
        </v-overlay>
      </v-img>
    </v-container>
    <div class="loadingbar-wrapper">
      <v-progress-linear v-show="loading" indeterminate />
    </div>
    <v-container>
      <v-skeleton-loader v-show="loading" type="heading" class="mt-6 mb-4" />
      <p v-show="!loading" class="title mt-6">
        showing
        <span class="primary--text font-weight-bold">
          {{ products.length }}
        </span>
        out of
        <span class="primary--text font-weight-bold">
          {{ subcategory.products.length }}
        </span>
        Products in
        <span class="primary--text font-weight-bold">
          {{ subcategory.name }}
        </span>
      </p>

      <v-row>
        <v-col
          v-show="!products.length && loading"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-skeleton-loader type="card" />
        </v-col>
        <v-col v-show="!(products.length || loading)" class="text-center">
          No products found
        </v-col>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <product-card :product="product" />
        </v-col>
        <v-col v-if="!products.length" class="text-center" cols="12">
          No products available
        </v-col>
        <v-col class="text-center" cols="12">
          <v-btn :disabled="!products.length" outlined large @click="fetchMore">
            load more
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "SubCategory",
  data: () => ({
    loading: false,
    cover: "",
    thumbnail: "",
    subcategory: {
      products: []
    },
    products: [],
    query: {
      _sort: "published_at:DESC",
      _start: 0,
      _limit: 12
    }
  }),
  async fetch() {
    try {
      this.loading = true;
      const p1 = this.$axios.$get(
        "/subcategories?key=" + this.$route.params.subkey
      );
      this.query["subcategory.key"] = this.$route.params.subkey;
      const p2 = this.$axios.$get("/products?" + qs.stringify(this.query));
      const [subcats, products] = await Promise.all([p1, p2]);

      const [subcategory] = subcats;

      if (!subcategory) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }

      this.products = products;
      this.cover = subcategory.cover.url;
      this.thumbnail = subcategory.cover.formats.thumbnail.url;
      this.subcategory = subcategory;

      this.query._start += this.query._limit;
    } catch (error) {
      this.$nuxt.error(error);
    } finally {
      this.loading = false;
    }
  },
  head() {
    return {
      title: this.subcategory.name,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.subcategory.description
        },
        {
          hid: "og:image",
          name: "og:image",
          content: this.cover
        }
      ]
    };
  },
  methods: {
    async fetchMore() {
      try {
        const products = await this.$axios.$get(
          "/products?" + qs.stringify(this.query)
        );
        if (!products.length) {
          return this.$store.commit("SHOW_ALERT", "No more products to show");
        }
        this.products = [...this.products, ...products];
        this.query._start += this.query._limit;
      } catch (error) {
        this.$store.commit("SHOW_ALERT", error.message);
      }
    }
  }
};
</script>

<style>
@media (min-width: 960px) {
  .subcategory-cover {
    height: 300px;
  }
}
@media (min-width: 600px) and (max-width: 960px) {
  .subcategory-cover {
    height: 240px;
  }
}
@media (max-width: 600px) {
  .subcategory-cover {
    height: 200px;
  }
}
</style>
