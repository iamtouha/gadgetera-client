<template>
  <v-container fluid>
    <v-text-field
      v-model="search"
      outlined
      style="max-width:350px"
      clearable
      class="mx-auto"
      hide-details
      single-line
      placeholder="Search products"
      append-icon="mdi-magnify"
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
              <filter-panel />
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
            <filter-panel single />
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
import debounce from "lodash.debounce";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Products",
  data: () => ({
    dialog: false,
    sorting: [
      { key: "published_at:desc", label: "Publish Date" },
      { key: "price:asc", label: "Price Ascending" },
      { key: "price:desc", label: "Price Descending" }
    ]
  }),
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

  methods: {
    ...mapMutations("products", [
      "SET_BRAND",
      "SET_CATEGORY",
      "SET_SUBCATEGORY",
      "SET_RANGE",
      "SET_SEARCH",
      "SORT"
    ]),
    ...mapActions("products", ["fetchAll", "reFetch"])
  }
};
</script>
