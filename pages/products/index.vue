<template>
  <v-container>
    <v-row>
      <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4">
        <v-card>
          <v-card-title>{{product.name}}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import productsQuery from '~/graphql/queries/products.gql'
export default Vue.extend({
  name: 'Products',
  head: {
    title: 'Shop',
  },
  data: () => ({
    products: [],
  }),
  apollo: {
    products: {
      query: productsQuery,
    },
  },
})
</script>

<style lang="scss">
</style>