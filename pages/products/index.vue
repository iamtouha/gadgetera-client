<template>
  <v-main>
    <v-img
      class="products-main-image"
      max-height="380px"
      src="/products_main.jpg"
      lazy-src="/products_main.jpg"
    >
      <v-row class="fill-height my-2" justify="center" align="center">
        <v-col cols="10" class="rounded product-filter-pan">
          <p class="display-1 text-center">Products</p>
          <filter-component v-if="!isMobile" />
        </v-col>
      </v-row>
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
    <v-btn
      v-if="isMobile"
      color="accent"
      fab
      fixed
      right
      class="filter-fab"
      @click="filter = !filter"
    >
      <v-icon>mdi-filter</v-icon>
    </v-btn>
    <v-dialog v-model="filter">
      <v-card elevation="0">
        <v-card-title>Filter Products</v-card-title>
        <v-card-text>
          <filter-component />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-main>
</template>
<script>
import debounce from "lodash.debounce";
export default {
  name: "Products",
  async asyncData({ app, route }) {
    try {
    } catch (error) {
      console.error(error.message); //eslint-disable-line
    }
  },
  data() {
    return {
      products: [],
      filter: false
    };
  },

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  watch: {
    query(newVal) {
      this.searchText = newVal;
    }
  }
};
</script>
<style lang="scss">
.product-filter-pan {
  background: rgba($color: #000000, $alpha: 0.65);
}
.filter-fab {
  bottom: 60px;
}
</style>
