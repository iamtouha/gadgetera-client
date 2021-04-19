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
          >
            <template #append>
              <v-icon color="accent">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-5 mb-1">
      <h1 class="display-1">Products</h1>
    </v-row>
    <v-divider />
    <v-row class="mt-1">
      <v-col v-show="!searched.length" cols="12">
        <p class="text-center">No products found</p>
      </v-col>

      <v-col
        v-for="product in paginated"
        :key="product.slug"
        cols="6"
        md="4"
        lg="3"
      >
        <product-page-card :product="product" />
      </v-col>
    </v-row>
    <v-pagination
      v-model="page"
      :length="length"
      class="mx-auto mt-3"
    ></v-pagination>
  </v-container>
</template>

<script>
import qs from "qs";
import { mapGetters } from "vuex";
import debounce from "lodash.debounce";
export default {
  name: "Products",
  data() {
    return {
      loading: false,
      text: "",
      page: 1,
      perPage: 12,
      limit: 300
    };
  },
  head: {
    title: "Products"
  },
  computed: {
    ...mapGetters(["products"]),
    search: {
      get() {
        return this.text;
      },
      set: debounce(function(val) {
        this.text = val;
      }, 200)
    },
    searched() {
      return this.products.filter(product => {
        const name = product.name.toLowerCase();
        return name.includes(this.search.toLowerCase());
      });
    },
    paginated() {
      const start = (this.page - 1) * this.perPage;
      return this.searched.slice(start, start + this.perPage);
    },
    length() {
      return Math.ceil(this.searched.length / this.perPage);
    }
  },

  // fetchOnServer: false,
  // async fetch() {
  //   try {
  //     this.loading = true;
  //     this.products = [];
  //     const query = {
  //       _sort: "createdAt:DESC",
  //       _limit: this.limit
  //     };
  //     if (this.text) {
  //       query["name_contains"] = this.text;
  //     }
  //     if (this.search !== this.text) {
  //       this.search = this.text;
  //     }
  //     const data = await this.$axios.$get("/products?" + qs.stringify(query));
  //     this.products = data;
  //   } catch (error) {
  //     console.log(error.message);
  //   } finally {
  //     this.loading = false;
  //   }
  // },
  methods: {}
};
</script>
