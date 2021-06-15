<template>
  <v-card outlined nuxt class="fill-height" :to="path">
    <v-img aspect-ratio="1.77" :src="imgSrc" :lazy-src="lazySrc" />
    <v-card-title class="item-name subtitle-1">
      {{ title }}
    </v-card-title>
    <v-card-subtitle>
      {{ subtitle }}
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: "ItemCard",
  props: {
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    image: {
      type: Object,
      default: () => ({})
    },
    path: {
      type: String,
      default: ""
    }
  },
  computed: {
    imgSrc() {
      return this.image.formats?.small?.url || this.image.url;
    },
    lazySrc() {
      return this.image.formats?.thumbnail?.url || this.image.url;
    }
  }
};
</script>

<style scoped>
.item-name {
  line-height: 1.25rem !important;
  font-weight: 500 !important;
}
</style>
