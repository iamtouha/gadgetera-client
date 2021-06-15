<template>
  <v-container fluid>
    <v-text-field
      ref="searchInput"
      v-model="search"
      outlined
      style="max-width:400px"
      clearable
      class="mx-auto"
      hide-details
      single-line
      placeholder="Search products"
      append-icon="mdi-magnify"
    />

    <v-row>
      <!-- filter panel (desktop) -->
      <v-col cols="3" class="d-none d-md-block pa-0 pl-2">
        <v-card outlined>
          <v-card-title>
            Filter
          </v-card-title>
          <v-card-text class="px-0">
            <filter-panel />
          </v-card-text>
        </v-card>
      </v-col>
      <!-- filter panel end (desktop) -->

      <v-col cols="12" md="8" lg="9">
        <div class="d-flex align-center">
          <h1 class="title d-none d-sm-block">
            Products
          </h1>
          <v-spacer class="d-none d-sm-block" />
          <v-switch
            v-model="mobileFilter"
            label="Filter"
            inset
            hide-details
            class="d-md-none mt-0 ml-2"
          />
          <v-spacer class="d-sm-none" />
          <v-select
            v-model="sort"
            prepend-inner-icon="mdi-sort"
            hide-details
            style="max-width:230px"
            class="ml-sm-4 sort-input"
            solo
            flat
            dense
            :items="sorting"
            item-text="label"
            item-value="key"
          />
        </div>
        <v-divider />
        <div style="height:5px">
          <v-progress-linear v-show="loading" indeterminate />
        </div>
        <v-slide-y-transition>
          <v-card v-show="mobileFilter" outlined class="d-md-none my-2">
            <filter-panel single />
          </v-card>
        </v-slide-y-transition>

        <!-- Products grid -->
        <v-row align="stretch" class="mt-3">
          <v-col v-show="!products.length && loading" cols="6" sm="4" lg="3">
            <v-skeleton-loader type="card" />
          </v-col>
          <v-col
            v-for="prod in products"
            :key="prod.id"
            class="pa-2 pa-sm-3"
            cols="6"
            sm="4"
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
              :disabled="!products.length"
              :loading="reloading"
              color="primary"
              outlined
              large
              class="mx-auto"
              @click="reFetch"
            >
              load more
            </v-btn>
          </v-col>
        </v-row>
        <!-- Products grid end -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import debounce from "lodash.debounce";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Products",
  data: () => ({
    mobileFilter: false,
    sorting: [
      { key: "published_at:desc", label: "Publish Date" },
      { key: "price:asc", label: "Price: Low to High" },
      { key: "price:desc", label: "Price: High to Low" }
    ]
  }),
  fetchOnServer: false,
  async fetch() {
    const error = await this.fetchAll();
    if (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    return {
      title: "Products"
    };
  },
  computed: {
    ...mapGetters("products", ["filter", "loading", "reloading", "products"]),
    sort: {
      get() {
        const { sortField, sortOrder } = this.filter;
        return `${sortField}:${sortOrder}`;
      },
      set(val) {
        const [sortField, sortOrder] = val.split(":");
        this.SORT({ field: sortField, order: sortOrder });
      }
    },
    search: {
      get() {
        return this.filter.search;
      },
      set(val) {
        this.SET_SEARCH(val);
      }
    }
  },

  watch: {
    filter: {
      deep: true,
      handler: debounce(function() {
        this.fetchAll({ forced: true });
      }, 500)
    }
  },
  mounted() {
    this.$nuxt.$on("search-field-focus", this.searchFocus);
  },
  beforeDestroy() {
    this.$nuxt.$off("search-field-focus", this.searchFocus);
  },
  methods: {
    ...mapMutations("products", ["SORT"]),
    ...mapActions("products", ["fetchAll", "reFetch"]),
    searchFocus() {
      this.$refs.searchInput?.focus();
    }
  }
};
</script>
<style>
.sort-input .v-input__slot {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
