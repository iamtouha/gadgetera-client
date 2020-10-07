<template>
  <v-main>
    <v-img
      class="products-main-image"
      max-height="400px"
      src="/products_main.jpg"
      lazy-src="/products_main.jpg"
    >
      <div class="products-main-text-wrapper text-center">
        <v-container>
          <v-row class="transparent">
            <v-col class="transparent" cols="12">
              <h1
                :style="{ fontSize: isMobile ? '32px' : '42px' }"
                :class="[isMobile ? 'mb-2' : 'mb-10']"
                class="font-weight-light text-center"
              >
                Products
              </h1>
            </v-col>
          </v-row>
          <client-only>
            <v-row class="transparent">
              <v-col class="transparent" cols="6" md="3">
                <v-text-field
                  v-model="searchText"
                  solo
                  hide-details
                  flat
                  style="border-radius: 0px"
                  label="Search by Name"
                ></v-text-field>
              </v-col>
              <v-col class="transparent" cols="6" md="3">
                <v-autocomplete
                  v-model="category"
                  solo
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  hide-details
                  flat
                  style="border-radius: 0px"
                  label="Select Category"
                ></v-autocomplete>
              </v-col>
              <v-col class="transparent" cols="6" md="3">
                <v-autocomplete
                  v-model="brand"
                  multiple
                  :items="brands"
                  item-text="name"
                  item-value="id"
                  solo
                  hide-details
                  flat
                  style="border-radius: 0px"
                  label="Select Brands"
                ></v-autocomplete>
              </v-col>
              <v-col class="transparent" cols="6" md="3">
                <v-select
                  v-model="sort"
                  :items="sorting"
                  solo
                  hide-details
                  flat
                  style="border-radius: 0px"
                  label="Sort by"
                ></v-select>
              </v-col>
            </v-row>
          </client-only>
        </v-container>
      </div>
    </v-img>
    <v-container>
      <v-row>
        <v-col
          v-for="product in filteredProduct"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >
          <product-card :product="product"></product-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import debounce from "lodash.debounce"
import productsQuery from "~/graphql/queries/products.gql"
import ProductCard from "~/components/ProductCard.vue"

export default {
  name: "Products",
  components: { ProductCard },
  async asyncData({ app, route }) {
    try {
      const client = app.apolloProvider?.defaultClient
      if (client) {
        const response = await client.query({ query: productsQuery })
        const { products, brands, categories } = response.data
        return {
          products,
          brands,
          categories,
          search: route.query.q ? route.query.q : "",
        }
      }
    } catch (error) {
      console.error(error.message) //eslint-disable-line
    }
  },
  data() {
    return {
      products: [],
      search: "",
      category: null,
      brand: [],
      sort: null,
      categories: [],
      brands: [],
      sorting: ["name", "price", "date", "category", "brand"],
    }
  },

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    query() {
      return this.$route.query.q
    },
    searchText: {
      get() {
        return this.search
      },
      set: debounce(function (val) {
        this.search = val
      }, 500),
    },
    filteredProduct() {
      const filtered = this.products
        .filter((p) => p.name.toLowerCase().includes(this.search.toLowerCase()))
        .filter((p) =>
          this.brand.length ? this.brand.includes(p.brand.id) : true
        )
        .filter((p) => (this.category ? this.category === p.category.id : true))
        .sort()
      return filtered
    },
  },
  watch: {
    query(newVal) {
      this.searchText = newVal
    },
  },
}
</script>
<style lang="scss">
.products-main-image {
  .v-responsive__content {
    display: flex;
    flex-direction: row;
    .products-main-text-wrapper {
      flex: 1;
      margin: auto;
      div {
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
.transparent {
  background: rgba($color: #000000, $alpha: 0);
}
</style>
