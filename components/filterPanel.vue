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
          v-show="categoryActive"
          class="mx-1 px-2"
          small
          style="max-width:75px;"
          close
          @click:close="removeQuery('category')"
        >
          applied
        </v-chip>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
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

        <p
          :class="[subcategories.length ? '' : 'grey--text']"
          class="mt-2 mb-0 body-2 disabled"
        >
          Subcategories
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
          v-show="brandActive"
          class="mx-1 px-2"
          small
          style="max-width:75px;"
          close
          @click:close="removeQuery('brand')"
        >
          applied
        </v-chip>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
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
          @click:close="removeQuery('range')"
        >
          applied
        </v-chip>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="range[0]"
              type="number"
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
              v-model="range[1]"
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
          :min="0"
          :max="50000"
          :step="50"
          class="mt-2"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
/* eslint-disable camelcase, curly */

export default {
  name: "FilterPanel",
  props: {
    single: Boolean,
    value: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      panel: this.single ? 0 : [0],
      category: null,
      subcategory: null,
      brand: null,
      range: [0, 0],
      categories: [],
      subcategories: [],
      brands: [],
      priceRange: false
    };
  },
  async fetch() {
    await this.fetchCategories();
    await this.fetchBrands();
  },
  computed: {
    rangeActive() {
      return this.value?.price_gte || this.value?.price_lte;
    },
    brandActive() {
      return this.value?.brand;
    },
    categoryActive() {
      return this.value?.subcategory || this.value?.["subcategory.category"];
    },
    query() {
      const query = {};
      let [price_gte, price_lte] = this.range;
      price_gte = parseInt(price_gte);
      price_lte = parseInt(price_lte);
      if (price_gte > 0) {
        query.price_gte = price_gte;
      }
      if (price_lte > 0) {
        query.price_lte = price_lte;
      }
      if (this.subcategory) {
        query.subcategory = this.subcategory;
      } else if (this.category) {
        query["subcategory.category"] = this.category;
      }
      if (this.brand) query.brand = this.brand;
      return query;
    }
  },
  watch: {
    category(val) {
      this.subcategory = null;
      if (val) {
        this.fetchSubCats();
      } else {
        this.subcategories = [];
      }
    },
    query: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const categories = await this.$axios.$get("/categories");
        this.categories = categories;
      } catch (error) {
        this.$nuxt.error(error);
      }
    },
    async fetchBrands() {
      try {
        const brands = await this.$axios.$get("/brands");
        this.brands = brands;
      } catch (error) {
        this.$nuxt.error(error);
      }
    },
    async fetchSubCats() {
      try {
        const subcats = await this.$axios.$get(
          "/subcategories?category=" + this.category
        );
        this.subcategories = subcats;
      } catch (error) {
        this.$nuxt.error(error);
      }
    },
    clear() {
      this.category = null;
      this.subcategory = null;
      this.brand = null;
      this.range = [100, 15000];
    },
    removeQuery(name) {
      switch (name) {
        case "category":
          this.category = null;
          this.subcategory = null;
          break;

        case "range":
          this.range = [0, 0];
          break;

        case "brand":
          this.brand = null;
          break;

        default:
          this.clear();
          break;
      }
    },
    resetRange() {
      this.range = [0, 0];
    }
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
