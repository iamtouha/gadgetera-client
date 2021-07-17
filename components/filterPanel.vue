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
          Availability
        </span>
        <client-only>
          <v-chip
            v-show="filter.stock !== null"
            class="mx-1 px-2"
            small
            style="flex:0 1 auto;"
            close
            @click:close="availability = stockOptions[0]"
          >
            {{ availability }}
          </v-chip>
        </client-only>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-chip-group v-model="availability" mandatory column>
          <v-chip
            v-for="option in stockOptions"
            :key="option"
            :value="option"
            filter
            outlined
            small
          >
            {{ option }}
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
          Categories
        </span>
        <client-only>
          <v-chip
            v-show="category"
            class="mx-1 px-2"
            small
            style="flex:0 1 auto;"
            close
            @click:close="category = null"
          >
            {{ subcatName || catName }}
          </v-chip>
        </client-only>
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
        <client-only>
          <v-chip
            v-show="brand"
            class="mx-1 px-2"
            small
            style="flex: 0 1 auto;"
            close
            @click:close="brand = null"
          >
            {{ brandName }}
          </v-chip>
        </client-only>
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
        <client-only>
          <v-chip
            v-show="rangeActive"
            class="mx-1 px-2"
            small
            style="flex: 0 1 auto;"
            close
            @click:close="range = [0, 0]"
          >
            {{ range[0] || "" }}
            <span class="mx-1">-</span>
            {{ range[1] || "" }}
          </v-chip>
        </client-only>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="d-flex">
          <v-text-field
            :value="range[0]"
            readonly
            hide-details
            outlined
            dense
            class="mr-4"
            style="max-width:120px;"
          >
            <template #prepend>
              <span class="pt-1">
                Min
              </span>
            </template>
          </v-text-field>
          <v-text-field
            :value="range[1]"
            readonly
            type="number"
            hide-details
            outlined
            dense
            style="max-width:120px;"
          >
            <template #prepend>
              <span class="pt-1">
                Max
              </span>
            </template>
          </v-text-field>
        </div>

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
      panel: this.single ? 0 : [0],
      stockOptions: ["All products", "In stock", "Out of stock"]
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
    catName() {
      return this.categories.find(cat => cat.id === this.category)?.name;
    },
    brandName() {
      return this.brands.find(brand => brand.id === this.brand)?.name;
    },
    subcatName() {
      return this.subcategories.find(cat => cat.id === this.subcategory)?.name;
    },
    subcategories() {
      if (!this.category) return [];
      const items = this.categories.find(item => item.id === this.category)
        .subcategories;
      return items || [];
    },
    rangeActive() {
      return this.filter.maxPrice || this.filter.minPrice;
    },
    availability: {
      get() {
        const [all, inStock, notInStock] = this.stockOptions;
        switch (this.filter.stock) {
          case true:
            return inStock;

          case false:
            return notInStock;

          default:
            return all;
        }
      },
      set(val) {
        switch (val) {
          case "In stock":
            this.SET_STOCK(true);
            break;

          case "Out of stock":
            this.SET_STOCK(false);
            break;

          default:
            this.SET_STOCK(null);
            break;
        }
      }
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
      "SET_RANGE",
      "SET_STOCK"
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
