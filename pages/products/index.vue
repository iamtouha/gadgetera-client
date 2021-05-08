<template>
  <v-container fluid>
    <v-text-field
      v-model="searchText"
      outlined
      style="max-width:350px"
      clearable
      class="mx-auto"
      hide-details
      single-line
      placeholder="Search products"
      append-icon="mdi-magnify"
      @keyup.enter="fetchProducts"
      @click:append="fetchProducts"
    />

    <!-- filter panel (desktop) -->
    <v-row>
      <v-col cols="3" class="d-none d-md-block">
        <v-card outlined min-height="500px">
          <filter-panel v-model="filter">
            <v-card-actions slot-scope="{ apply, clear }">
              <v-spacer />
              <v-btn v-if="filter" text @click="clear">
                clear
              </v-btn>
              <v-btn text class="primary" @click="apply">
                <v-icon left>
                  mdi-filter
                </v-icon>
                filter
              </v-btn>
            </v-card-actions>
          </filter-panel>
        </v-card>
      </v-col>
      <!-- filter panel end (desktop) -->

      <v-col cols="12" md="9">
        <v-toolbar color="transparent" elevation="0">
          <v-toolbar-title class="d-none d-sm-block">
            Products
          </v-toolbar-title>
          <v-spacer />
          <v-select
            v-model="sort"
            prepend-icon="mdi-sort"
            hide-details
            style="max-width:210px"
            single-line
            label="Sort by"
            :items="sorting"
            item-text="label"
            item-value="key"
          />
        </v-toolbar>
        <v-divider />
        <div style="height:5px">
          <v-progress-linear v-show="loading" indeterminate />
        </div>

        <!-- Products grid -->
        <v-row align="stretch" class="mt-3">
          <v-col
            v-for="prod in products"
            :key="prod.id"
            cols="12"
            sm="4"
            lg="3"
          >
            <product-card :product="prod" />
          </v-col>
          <v-col v-show="!products.length" cols="12" class="text-center">
            No products available
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center">
            <v-btn
              v-show="query"
              :disabled="!products.length"
              :loading="loadingMore"
              color="primary"
              outlined
              large
              class="mx-auto"
              @click="loadMore"
            >
              load more
            </v-btn>
          </v-col>
        </v-row>
        <!-- Products grid end -->
      </v-col>
    </v-row>

    <!-- floating fab icon -->
    <v-btn fab bottom fixed right class="d-md-none" @click="sheet = true">
      <v-icon>
        mdi-filter
      </v-icon>
    </v-btn>

    <!-- bottom filter panel (for mobile devices) -->
    <v-bottom-sheet v-model="sheet" class="bg-white">
      <v-card>
        <filter-panel v-model="filter" single>
          <v-card-actions slot-scope="{ apply, clear }">
            <v-spacer />
            <v-btn v-if="filter" text @click="clear">
              clear
            </v-btn>
            <v-btn v-else text @click="sheet = false">
              Close
            </v-btn>
            <v-btn text class="primary" @click="apply">
              <v-icon left>
                mdi-filter
              </v-icon>
              filter
            </v-btn>
          </v-card-actions>
        </filter-panel>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import qs from "qs";
export default {
  name: "Products",
  data: () => ({
    products: [],
    sheet: false,
    loading: true,
    loadingMore: false,
    sort: "createdAt:DESC",
    start: 0,
    limit: 12,
    searchText: "",
    query: null,
    filter: null,
    sorting: [
      { key: "createdAt:DESC", label: "Date" },
      { key: "price:ASC", label: "Price Ascending" },
      { key: "price:DESC", label: "Price Descending" }
    ]
  }),
  async fetch() {
    try {
      await this.fetchProducts();
    } catch (error) {
      this.$nuxt.error(error);
    }
  },

  watch: {
    sort: "fetchProducts",
    filter: "fetchProducts"
  },

  methods: {
    async fetchProducts() {
      this.loading = true;
      this.query = this.getQuery();
      try {
        const products = await this.performFetch();

        this.products = products;
      } catch (error) {
        this.$nuxt.error(error);
      } finally {
        this.loading = false;
      }
    },
    getQuery() {
      let query = {
        _limit: this.limit,
        _sort: this.sort,
        _start: 0
      };
      if (this.filter) {
        query = { ...query, ...this.filter };
      }
      if (this.searchText) {
        query.name_contains = this.searchText;
      }
      return query;
    },

    async loadMore() {
      this.loadingMore = true;
      this.query._start += this.limit;
      const products = await this.performFetch();
      this.loadingMore = false;
      if (!products.length) {
        return this.$store.commit("SHOW_ALERT", "No more product to show");
      }
      this.products = [...this.products, ...products];
    },
    async performFetch() {
      try {
        const products = await this.$axios.$get(
          "/products?" + qs.stringify(this.query)
        );
        return products;
      } catch (error) {
        this.$nuxt.error(error);
      }
    }
  }
};
</script>
