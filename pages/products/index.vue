<template>
  <v-container>
    <v-row>
      <v-col class="pb-0" cols="12">
        <v-chip-group multiple v-model="filterCategories">
          <v-chip label active-class="primary--text" v-for="cat in categories" :key="cat.id">
            <v-icon left>{{cat.icon}}</v-icon>
            {{cat.name}}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col class="pt-0" cols="12">
        <v-chip-group multiple v-model="filterBrands">
          <v-chip label active-class="primary--text" v-for="cat in brands" :key="cat.id">
            <v-avatar class="mr-1">
              <v-img :src="cat.logo.url"></v-img>
            </v-avatar>
            {{cat.name}}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <v-row>
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="3">
        <v-card
          class="fill-height"
          :class="[isMobile?'d-none':'']"
          nuxt
          :to="'/products/'+product.slug"
        >
          <v-img aspect-ratio="1" :lazy-src="product.photos[0].url" :src="product.photos[0].url"></v-img>
          <v-card-title
            style="word-break:normal; white-space:pre-wrap;"
            class="body-1 pb-0"
          >{{product.name}}</v-card-title>
          <v-card-title v-if="product.discount" class="title font-weight-regular pt-1">
            <span class="mr-2 primary--text">&#2547;{{product.price*(1 - (product.discount/100)) }}</span>
            <del>&#2547;{{product.price}}</del>
          </v-card-title>
          <v-card-title
            v-else
            class="title font-weight-regular pt-1 primary--text"
          >&#2547;{{product.price}}</v-card-title>
        </v-card>
        <v-list-item nuxt :to="'/products/'+product.slug" :class="[isMobile?'':'d-none']" two-line>
          <v-list-item-avatar tile size="120">
            <v-img aspect-ratio="1" :lazy-src="product.photos[0].url" :src="product.photos[0].url"></v-img>
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
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { Product } from '~/models'
import productsQuery from '~/graphql/queries/products.gql'

export default Vue.extend({
  name: 'Products',
  head: {
    title: 'Shop',
  },

  data: () => ({
    products: [] as Product[],
    filterCategories: [] as string[],
    filterBrands: [] as string[],
    categories: [],
    brands: [],
    breadcrumb: [
      { text: 'Home', to: '/' },
      { text: 'Products', disabled: true },
    ],
    drawer: null,
  }),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    filteredProducts() {
      let filterd = [...this.products]

      if (this.filterCategories.length) {
        filterd = filterd.filter((prod) =>
          this.filterCategories.includes(prod.category.id)
        )
      }
      if (this.filterBrands.length) {
        filterd = filterd.filter((prod) =>
          this.filterBrands.includes(prod.brand.id)
        )
      }
      return filterd
    },
  },
  apollo: {
    products: {
      query: productsQuery,
      loadingKey: 'loading',
    },
    categories: {
      query: gql`
        {
          categories {
            name
            icon
            id
          }
        }
      `,
      loadingKey: 'loading',
    },
    brands: {
      query: gql`
        {
          brands {
            name
            logo {
              url
            }
            id
          }
        }
      `,
      loadingKey: 'loading',
    },
  },
})
</script>
