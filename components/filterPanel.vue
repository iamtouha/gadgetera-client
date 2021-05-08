<template>
  <div style="display:contents;">
    <v-expansion-panels
      :value="panel"
      accordion
      class="filter-expansion"
      :multiple="!single"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          Categories {{ categoryActive ? "(applied)" : "" }}
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

      <v-expansion-panel>
        <v-expansion-panel-header>
          Brands {{ brandActive ? "(applied)" : "" }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-chip-group v-model="brand">
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
      <v-expansion-panel>
        <v-expansion-panel-header>
          Price Range {{ rangeActive ? "(applied)" : "" }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-range-slider
            v-model="range"
            hide-details
            :min="100"
            :max="50000"
          />
          <v-row class="mt-2">
            <v-col cols="6">
              <v-text-field
                v-model="range[0]"
                style="max-width:160px"
                placeholder="Maximum"
                hide-details
                dense
                type="number"
                label="From"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="range[1]"
                style="max-width:160px"
                placeholder="Maximum"
                hide-details
                dense
                type="number"
                label="To"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <slot :apply="apply" :clear="clear" />
  </div>
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
      range: [100, 50000],
      categories: [],
      subcategories: [],
      brands: []
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
    }
  },
  watch: {
    category(val) {
      this.subcategory = null;
      if (val) {
        this.fetchSubCats();
      }
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const categories = await this.$axios.$get("/categories");
        this.categories = categories;
      } catch (error) {}
    },
    async fetchBrands() {
      try {
        const brands = await this.$axios.$get("/brands");
        this.brands = brands;
      } catch (error) {}
    },
    async fetchSubCats() {
      try {
        const subcats = await this.$axios.$get(
          "/subcategories?category=" + this.category
        );
        this.subcategories = subcats;
      } catch (error) {}
    },
    clear() {
      this.category = null;
      this.subcategory = null;
      this.brand = null;
      this.range = [100, 15000];
      this.$emit("input", null);
    },
    apply() {
      const [price_gte, price_lte] = this.range;
      const query = { price_gte, price_lte };
      if (this.subcategory) {
        query.subcategory = this.subcategory;
      } else if (this.category) {
        query["subcategory.category"] = this.category;
      }
      if (this.brand) query.brand = this.brand;
      this.$emit("input", query);
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
