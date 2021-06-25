<template>
  <v-hover v-slot="{ hover }">
    <v-card
      outlined
      nuxt
      :to="`/products/${product.slug}`"
      class="fill-height featured-card"
    >
      <v-img
        :src="image.url"
        :lazy-src="image.thumbnail"
        aspect-ratio="1"
        class="align-end"
        max-width="100%"
      >
        <v-expand-transition>
          <v-card
            v-if="hover || isMobile"
            tile
            dark
            class="transition-fast-in-fast-out v-card--reveal"
          >
            <v-card-title class="title">
              {{ product.name }}
            </v-card-title>
            <v-card-subtitle class="white--text">
              {{ product.overview }}
            </v-card-subtitle>
          </v-card>
        </v-expand-transition>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: "FeaturedCard",
  props: {
    product: { type: Object, default: () => ({}) },
    index: { type: Number, default: 0 }
  },

  computed: {
    image() {
      if (!this.product.images) {
        return {};
      }
      const img = this.product.images[1];
      return {
        url: img.formats?.small?.url || img.url,
        thumb: img.formats?.thumbnail.url,
        id: img.id
      };
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  }
};
</script>

<style scoped lang="scss">
.v-card--reveal {
  bottom: 0;
  background-color: rgba($color: #489fb5, $alpha: 0.7);
  position: absolute;
  width: 100%;
}
.text-shadow {
  text-shadow: 0 0 3px rgba($color: #000000, $alpha: 0.6);
}
</style>
