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

    <v-row>
      <!-- filter panel (desktop) -->
      <v-col cols="4" lg="3" class="d-none d-md-block">
        <v-card outlined>
          <v-card-title>
            Filter
          </v-card-title>
          <v-card-text class="px-0">
            <client-only>
              <filter-panel ref="desktopFilter" v-model="filter" />
            </client-only>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- filter panel end (desktop) -->

      <v-col cols="12" md="8" lg="9">
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
            v-show="!products.length && loading"
            cols="12"
            sm="4"
            md="6"
            lg="3"
          >
            <v-skeleton-loader type="card" />
          </v-col>
          <v-col
            v-for="prod in products"
            :key="prod.id"
            cols="12"
            sm="4"
            md="6"
            lg="3"
          >
            <product-card :product="prod" />
          </v-col>
          <v-col
            v-show="!(products.length || loading)"
            cols="12"
            class="text-center"
          >
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
    <v-btn
      fab
      bottom
      fixed
      right
      color="accent"
      class="d-md-none"
      @click="dialog = true"
    >
      <v-icon>
        mdi-filter
      </v-icon>
    </v-btn>

    <!-- bottom filter panel (for mobile devices) -->
    <client-only>
      <v-bottom-sheet v-model="dialog" scrollable class="rounded">
        <v-card>
          <v-card-text class="pa-0 pt-2" style="max-height:350px;">
            <filter-panel ref="mobileFilter" v-model="filter" single />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="dialog = false">
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-bottom-sheet>
    </client-only>
  </v-container>
</template>

<script>
import qs from "qs";
import axios from "axios";
import debounce from "lodash.debounce";

const CancelToken = axios.CancelToken;
let cancel;

export default {
  name: "Products",
  data: () => ({
    products: [],
    dialog: false,
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
      this.query = this.getQuery();
      const products = await this.performFetch();
      if (products && products !== "cancelled") {
        this.products = products;
      }
    } catch (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    return {
      title: "Products"
    };
  },
  computed: {
    filterRef() {
      return this.$vuetify.breakpoint.smAndDown
        ? "mobileFilter"
        : "desktopFilter";
    }
  },
  watch: {
    sort: "fetchProducts",
    filter: "fetchProducts",
    searchText: "fetchProducts"
  },

  methods: {
    removeField(name) {
      this.$refs[this.filterRef]?.removeQuery(name);
    },
    fetchProducts: debounce(async function() {
      this.query = this.getQuery();
      const products = await this.performFetch();
      if (products !== "cancelled") {
        this.products = products;
      }
    }, 100),
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
      if (products === "cancelled") {
        return;
      }
      if (!products?.length) {
        return this.$store.commit("SHOW_ALERT", "No more product to show");
      }
      this.products = [...this.products, ...products];
    },
    async performFetch() {
      this.loading = true;

      try {
        if (cancel !== undefined) {
          cancel();
        }
        const products = await this.$axios.$get(
          "/products?" + qs.stringify(this.query),
          {
            cancelToken: new CancelToken(function(c) {
              cancel = c;
            })
          }
        );
        this.loading = false;
        return products;
      } catch (error) {
        if (axios.isCancel(error)) {
          return "cancelled";
        } else {
          this.loading = false;
          this.$nuxt.error(error);
        }
      }
    }
  }
};
</script>
