<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col
          :style="{ 'max-height': isMobile ? '350px' : '600px' }"
          cols="12"
          md="6"
          class="pa-0"
        >
          <img
            style="height: 100%"
            class="mx-auto d-block"
            :src="mainImgUrl"
            alt=""
          />
        </v-col>
        <v-col class="fill-height" cols="12" md="6">
          <v-card
            class="d-flex"
            style="flex-direction: column"
            :min-height="isMobile ? 'auto' : '600px'"
            elevation="0"
          >
            <v-card-title style="word-break: break-word" class="title">
              {{ product.name }}</v-card-title
            >
            <v-card-text>
              <p class="headline">
                <del>{{ product.price }}</del>
                {{ product.price - (product.discount * product.price) / 100 }}tk
              </p>
              <p>
                {{ product.overview }}
              </p>
              <v-list-item v-for="(val, key) in variants" :key="key">
                <v-list-item-content>
                  <v-select
                    v-model="variant[key]"
                    solo
                    hide-details=""
                    outlined
                    class="elevation-0"
                    :label="`Select ${key}`"
                    :items="val"
                    style="border-radius: 0"
                  ></v-select>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
            <v-card-actions class="mt-auto mb-0">
              <v-select
                v-model="units"
                style="max-width: 150px; border-radius: 0"
                solo
                hide-details
                :items="[1, 2, 3, 4, 5]"
              >
                <template v-slot:prepend-inner> Units: </template>
              </v-select>
              <div style="width: 10px"></div>
              <v-btn
                tile
                x-large
                color="accent"
                class="black--text flex-grow-1"
                @click="add2cart"
                >Add to Card</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <v-container class="ck-content" v-html="product.description"></v-container>
  </v-main>
</template>

<script>
import productBySlug from "~/graphql/queries/productBySlug.gql"
import "~/assets/ckeditor.css"
export default {
  name: "Product",
  async asyncData({ app, params }) {
    const client = app.apolloProvider.defaultClient
    if (client) {
      const response = await client.query({
        query: productBySlug,
        variables: { slug: params.slug },
      })
      const product = response.data.productBySlug
      return {
        product,
        mainImgUrl: product.photos[0]?.url,
      }
    } else return {}
  },
  data: () => ({
    mainImgUrl: "",
    product: {
      photos: [],
      variants: [],
    },
    variant: {},
    units: 1,
  }),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    variants() {
      const options = this.product.variants.reduce((acc, crr) => {
        if (!crr.available) return acc
        if (!acc[crr.attribute]) acc[crr.attribute] = [crr.value]
        else acc[crr.attribute].push(crr.value)
        return acc
      }, {})
      return options
    },
  },

  methods: {
    add2cart() {
      //
    },
  },
  head() {
    return {
      title: this.product.name,
      meta: [
        {
          hid: "description",
          property: "og:description",
          content: this.product.overview,
        },
        {
          hid: "title",
          property: "og:title",
          content: this.product.name,
        },

        {
          hid: "image",
          property: "og:image",
          content: this.product.photos[0].url,
        },
      ],
    }
  },
}
</script>
