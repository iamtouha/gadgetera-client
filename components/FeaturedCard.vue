<template>
  <v-hover v-slot="{ hover }">
    <v-card
      color="transparent"
      nuxt
      :to="`/products/${product.slug}`"
      class="fill-height featured-card pa-4"
    >
      <v-img
        :src="image.url"
        :lazy-src="image.thumbnail"
        aspect-ratio="1"
        class="align-end"
        max-width="100%"
      >
        <v-expand-transition>
          <div
            v-show="hover || isMobile"
            class="transition-fast-in-fast-out v-card--reveal"
          >
            <v-card-title class="title white--text">
              {{ product.name }}
            </v-card-title>
            <v-card-subtitle class="white--text">
              {{ product.overview }}
            </v-card-subtitle>
          </div>
        </v-expand-transition>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: "FeaturedCard",
  props: {
    product: { type: Object, default: () => ({}) }
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
@import "~vuetify/src/styles/styles.sass";

.v-card--reveal {
  bottom: 0;
  background-color: rgba($color: #489fb5, $alpha: 0.7);
  position: absolute;
  width: 100%;
}
@media #{map-get(
    $display-breakpoints,
    "md-and-up"
  )} {
  .featured-card {
    width: 550px;
  }
}
@media #{map-get(
    $display-breakpoints,
    "sm-only"
  )} {
  .featured-card {
    width: 350px;
  }
}
@media #{map-get(
    $display-breakpoints,
    "xs-only"
  )} {
  .featured-card {
    width: 350px;
  }
}
</style>
