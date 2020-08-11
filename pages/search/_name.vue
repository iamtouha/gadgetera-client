<template>
  <v-container fluid>
    <v-row>
      <v-col class="py-0" sm="12">
        <v-breadcrumbs :items="breadcrumb"></v-breadcrumbs>
      </v-col>
    </v-row>
    <client-only>
      <v-container>
        <v-row>
          <v-col class="py-0" sm="12">
            <p class="body-1">{{products.length}} Product(s) found.</p>
          </v-col>
          <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="3">
            <v-card
              class="fill-height"
              :class="[isMobile?'d-none':'']"
              nuxt
              :to="'/products/'+product.slug"
            >
              <v-img
                aspect-ratio="1"
                :lazy-src="product.photos[0].url"
                :src="product.photos[0].url"
              ></v-img>
              <v-card-title
                style="word-break:normal; white-space:pre-wrap;"
                class="body-1 pb-0"
              >{{product.name}}</v-card-title>
              <v-card-title v-if="product.discount" class="title font-weight-regular pt-1">
                <span
                  class="mr-2 primary--text"
                >&#2547;{{product.price*(1 - (product.discount/100)) }}</span>
                <del>&#2547;{{product.price}}</del>
              </v-card-title>
              <v-card-title
                v-else
                class="title font-weight-regular pt-1 primary--text"
              >&#2547;{{product.price}}</v-card-title>
            </v-card>
            <v-list-item
              nuxt
              :to="'/products/'+product.slug"
              :class="[isMobile?'':'d-none']"
              two-line
            >
              <v-list-item-avatar tile size="120">
                <v-img
                  aspect-ratio="1"
                  :lazy-src="product.photos[0].url"
                  :src="product.photos[0].url"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  style="word-break:normal; white-space:unset;"
                  class="body-2 pb-0"
                >{{product.name}}</v-list-item-title>
                <v-list-item-title v-if="product.discount" class="title font-weight-regular pt-1">
                  <span
                    class="mr-2 primary--text"
                  >&#2547;{{product.price*(1 - (product.discount/100)) }}</span>
                  <del>&#2547;{{product.price}}</del>
                </v-list-item-title>
                <v-list-item-title
                  v-else
                  class="title font-weight-regular pt-1 primary--text"
                >&#2547;{{product.price}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-container>
    </client-only>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import productSearch from '~/graphql/queries/productSearch.gql'
export default Vue.extend({
  name: 'Search',
  apollo: {
    products: {
      prefetch: false,
      query: productSearch,
      variables() {
        return { name: (this as any).query }
      },
    },
  },
  data() {
    return {
      products: [],
      breadcrumb: [
        { text: 'Home', to: '/' },
        { text: 'Search', disabled: true },
      ],
    }
  },

  computed: {
    query() {
      return this.$route.params.name
    },
  },
})
</script>

<style lang="scss">
</style>