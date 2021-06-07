<template>
  <v-card
    outlined
    nuxt
    :to="`/products/${product.slug}`"
    class="fill-height"
    color="info"
  >
    <div class="d-flex flex-no-wrap fill-height">
      <div class="d-flex flex-column">
        <v-card-title class="text-subtitle-1 text-sm-h6 font-weight-bold">
          {{ product.name }}
        </v-card-title>

        <v-card-subtitle
          class="primary--text font-weight-bold text-body-1 pt-2"
        >
          &#2547; {{ product.price }}
          <span v-if="product.discount" class="ml-2">
            ({{ Math.ceil(100 * product.discount) }}% off)
          </span>
        </v-card-subtitle>

        <v-card-actions class="mt-auto mb-0">
          <v-btn class="ml-2 mt-3" color="accent" text large>
            shop now
            <v-icon right>
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </v-card-actions>
      </div>

      <v-avatar class="ma-3 rounded" size="140" tile>
        <v-img :src="product.images[0].url" />
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "FeaturedCard",
  props: {
    product: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      //
    };
  },
  computed: {
    isTouch() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    }
  }
};
</script>

<style scoped lang="scss">
$top: rgba(0, 0, 0, 0.05);
$top: rgba(0, 0, 0, 0.5);
$bottom: rgba(0, 0, 0, 0.9);
.image-card {
  background-image: linear-gradient($top, $bottom, $bottom);
}
</style>
