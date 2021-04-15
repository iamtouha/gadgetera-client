<template>
  <v-container class="mt-10">
    <v-row class="fill-height" justify="center" align="center">
      <v-col class="search-pan" cols="12" sm="8" md="6">
        <div class="textbox-wrapper">
          <v-text-field
            v-model="search"
            hide-details
            outlined
            single-line
            placeholder="Search Product name, Brand or Category"
            style="border-radius: 4px 0 0 4px"
          >
          </v-text-field>
          <v-btn
            :loading="loading"
            large
            height="56px"
            elevation="0"
            style="border-radius:0 4px 4px 0"
            tile
            color="accent"
            class="black--text"
            @click="changeParam"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <h1 class="display-1">Products</h1>
    </v-row>
    <v-row>
      <v-col v-show="loading" cols="12" sm="6" md="4">
        <v-skeleton-loader
          min-height="400px"
          class="fill-height"
          type="card, article"
        >
        </v-skeleton-loader>
      </v-col>

      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
      >
        <product-card :product="product"></product-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import debounce from "lodash.debounce";
import qs from "qs";
export default {
  name: "Products",
  data() {
    return {
      loading: false,
      search: "",
      page: 0,
      perPage: 20,
      limit: 20,
      products: []
    };
  },
  computed: {
    text() {
      return this.$route.query.search;
    }
  },
  watchQuery: ["search"],
  watch: {
    text() {
      this.$fetch();
    }
  },
  fetchOnServer: false,
  async fetch() {
    this.searchProduct();
  },
  methods: {
    changeParam() {
      if (!this.search) return;
      this.$router.push({
        path: this.$route.path,
        query: { search: this.search }
      });
    },
    async searchProduct() {
      try {
        this.loading = true;
        this.products = [];
        const query = {
          _sort: "created_at:DESC",
          _limit: this.limit,
          _start: this.page * this.perPage
        };
        if (this.text) {
          query["_where"] = {
            _or: [
              { name_contains: this.text },
              { "category.name_contains": this.text },
              { "brand.name_contains": this.text }
            ]
          };
        }
        if (this.search !== this.text) {
          this.search = this.text;
        }
        const data = await this.$axios.$get("/products?" + qs.stringify(query));
        this.products = data;
      } catch (error) {
        this.$nuxt.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
