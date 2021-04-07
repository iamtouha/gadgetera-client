<template>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="query.name"
        hide-details
        label="Product Name"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-autocomplete
        v-model="query.category"
        :items="categories"
        item-text="name"
        hide-details
        label="Category"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-autocomplete
        v-model="query.brand"
        multiple
        :items="brands"
        item-text="name"
        hide-details
        label="Brands"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" md="4">
      <v-select
        v-model="query.sort"
        :items="sort"
        item-text="name"
        item-value="key"
        hide-details
        label="Sort By"
      ></v-select
    ></v-col>
    <v-col cols="12" class="text-center">
      <v-btn color="accent" large elevation="0" @click="filter">Filter</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import qs from "query-string";

export default {
  data() {
    return {
      brands: [],
      categories: [],
      sort: [
        { name: "Date Ascending", key: "created_at:ASC" },
        { name: "Date Descending", key: "created_at:DESC" },
        { name: "Price Ascending", key: "price:ASC" },
        { name: "Price Descending", key: "price:DESC" }
      ],
      query: {
        name: "",
        brand: [],
        category: "",
        sort: ""
      }
    };
  },
  async fetch() {
    try {
      const p1 = this.$axios.$get("/categories");
      const p2 = this.$axios.$get("/brands");
      const [categories, brands] = await Promise.all([p1, p2]);
      this.brands = brands;
      this.categories = categories;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    filter() {
      const query = {};
      Object.keys(this.query).forEach(key => {
        const val = this.query[key];
        if (val?.length) {
          query[key] = val;
        }
      });
      console.log(qs.stringify(query));
    }
  }
};
</script>
