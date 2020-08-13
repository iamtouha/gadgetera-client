<template>
  <v-container fluid>
    <v-row>
      <v-col sm="12" class="py-0">
        <v-breadcrumbs :items="breadcrumb">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item exact :to="item.to" :disabled="item.disabled">{{ item.text}}</v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-carousel hide-delimiters height="400px">
            <v-carousel-item v-for="photo in product.photos" :key="photo.url">
              <v-row class="fill-height" justify="center" align="center">
                <v-col cols="12" class="pa-0">
                  <v-img contain max-height="400" :lazy-src="photo.url" :src="photo.url"></v-img>
                </v-col>
              </v-row>
            </v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card elevation="0" class="transparent">
            <v-card-title style="word-break:normal;" class="body-1 pb-0">{{product.name}}</v-card-title>
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
            <v-card-text>
              <v-list two-line>
                <template v-for="(vals, key) in variants">
                  <v-list-item :key="key">
                    <v-list-item-content>
                      <v-list-item-subtitle class="body-1">{{key}}:</v-list-item-subtitle>
                      <v-list-item-title>
                        <v-btn-toggle v-model="variant[key]">
                          <v-btn
                            :disabled="!val.available"
                            :value="val.val"
                            :small="isMobile"
                            v-for="val in vals"
                            :key="val.val"
                          >{{val.val}}</v-btn>
                        </v-btn-toggle>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary black--text" class="px-4" x-large>Order Now</v-btn>
              <v-btn class="gray" x-large>Add to cart</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="ck-content" v-html="product.description"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import '~/assets/ckeditor.css'

import Vue from 'vue'
import productBySlug from '~/graphql/queries/productBySlug.gql'
import { Product } from '~/models'
export default Vue.extend({
  name: 'Product',
  head() {
    return {
      title: (this as any).product.name,
    }
  },
  async asyncData({ app, params, store }) {
    try {
      store.commit('LOADING_ON')
      const client = app.apolloProvider?.defaultClient
      if (client) {
        const response = await client.query({
          query: productBySlug,
          variables: { slug: params.slug },
        })
        return {
          product: response.data.productBySlug,
        }
      }
      return {}
    } catch (error) {
      throw error
    } finally {
      store.commit('LOADING_OFF')
    }
  },

  data() {
    return {
      slug: this.$route.params.slug,
      variant: {},
      product: {
        photos: [] as unknown,
        variants: [] as unknown,
      } as Product,
      breadcrumb: [
        { text: 'Home', to: '/' },
        { text: 'Products', to: '/products' },
        { text: this.$route.params.slug, disabled: true },
      ],
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    variants() {
      const options = {} as any
      this.product.variants.forEach((item) => {
        const obj = { val: item.value, available: item.available }
        if (options[item.attribute]) options[item.attribute].push(obj)
        else options[item.attribute] = [obj]
      })
      return options
    },
  },
})
</script>
