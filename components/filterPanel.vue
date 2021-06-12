<template>
  <v-expansion-panels
    :value.sync="panel"
    accordion
    class="filter-expansion transparent"
    :multiple="!single"
  >
    <v-expansion-panel class="transparent">
      <v-expansion-panel-header>
        <span class="pt-1" style="height:24px;">
          Categories
        </span>
        <v-chip
          v-show="category"
          class="mx-1 px-2"
          small
          style="max-width:75px;"
          close
          @click:close="category = null"
        >
          applied
        </v-chip>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-skeleton-loader v-show="catLoading" type="text" max-width="150px" />
        <v-chip-group v-model="category" column>
          <v-chip
            v-for="grp in categories"
            :key="grp.name"
            :value="grp.id"
            filter
            outlined
            small
          >
            {{ grp.name }}
          </v-chip>
        </v-chip-group>

        <p class="mt-2 mb-0 body-2 disabled">
          {{ subcategories.length ? "Subcategories" : "" }}
        </p>
        <v-chip-group v-model="subcategory" column>
          <v-chip
            v-for="subcat in subcategories"
            :key="subcat.id"
            :value="subcat.id"
            small
            filter
            outlined
          >
            {{ subcat.name }}
          </v-chip>
        </v-chip-group>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel class="transparent">
      <v-expansion-panel-header>
        <span class="pt-1" style="height:24px;">
          Brands
        </span>
        <v-chip
          v-show="brand"
          class="mx-1 px-2"
          small
          style="max-width:75px;"
          close
          @click:close="brand = null"
        >
          applied
        </v-chip>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-skeleton-loader
          v-show="brandLoading"
          type="text"
          max-width="150px"
        />

        <v-chip-group v-model="brand" column>
          <v-chip
            v-for="grp in brands"
            :key="grp.id"
            :value="grp.id"
            small
            filter
            outlined
          >
            {{ grp.name }}
          </v-chip>
        </v-chip-group>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel class="transparent">
      <v-expansion-panel-header>
        <span class="pt-1" style="height:24px;">
          Price Range
        </span>
        <v-chip
          v-show="rangeActive"
          class="mx-1 px-2"
          small
          style="max-width:75px;"
          close
          @click:close="range = [0, 0]"
        >
          applied
        </v-chip>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="6">
            <v-text-field
              :value="range[0]"
              readonly
              hide-details
              outlined
              dense
            >
              <template #prepend>
                <span class="pt-1">
                  Min
                </span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :value="range[1]"
              readonly
              type="number"
              hide-details
              outlined
              dense
            >
              <template #prepend>
                <span class="pt-1">
                  Max
                </span>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-range-slider
          v-model="range"
          :step="500"
          :min="0"
          :max="50000"
          class="mt-2"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
/* eslint-disable camelcase, curly */
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "FilterPanel",
  props: {
    single: Boolean
  },
  data() {
    return {
      panel: this.single ? 0 : [0]
    };
  },
  async fetch() {
    await this.fetchAllCats();
    await this.fetchAllBrands();
  },
  computed: {
    ...mapGetters({
      filter: "products/filter",
      categories: "categories/categories",
      catLoading: "categories/loading",
      brands: "brands/brands",
      brandLoading: "brands/loading"
    }),
    subcategories() {
      if (!this.category) return [];
      const items = this.categories.find(item => item.id === this.category)
        .subcategories;
      return items || [];
    },
    rangeActive() {
      return this.filter.maxPrice || this.filter.minPrice;
    },

    category: {
      get() {
        return this.filter.category;
      },
      set(id) {
        this.SET_CATEGORY(id);
      }
    },
    subcategory: {
      get() {
        return this.filter.subcategory;
      },
      set(val) {
        this.SET_SUBCATEGORY(val);
      }
    },
    brand: {
      get() {
        return this.filter.brand;
      },
      set(val) {
        this.SET_BRAND(val);
      }
    },
    range: {
      get() {
        const { minPrice, maxPrice } = this.filter;
        return [minPrice, maxPrice];
      },
      set(val) {
        this.SET_RANGE(val);
      }
    }
  },

  methods: {
    ...mapActions({
      fetchAllCats: "categories/fetchAll",
      fetchAllBrands: "brands/fetchAll"
    }),
    ...mapMutations("products", [
      "SET_BRAND",
      "SET_CATEGORY",
      "SET_SUBCATEGORY",
      "SET_RANGE"
    ])
  }
};
</script>

<style>
.filter-expansion .v-expansion-panel::before {
  box-shadow: 0 0 0 !important;
}
.filter-expansion .v-chip .v-icon {
  font-size: 18px !important;
}
</style>
