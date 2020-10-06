<template>
  <v-main> </v-main>
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
      return {
        product: response.data.productBySlug,
      }
    } else return {}
  },
  data: () => ({
    product: {},
  }),
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
