<template>
  <v-tabs
    v-model="tab"
    centered
    align-with-title
    class="nav-tabs px-sm-3"
    :height="height"
  >
    <v-tab
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      nuxt
      :exact="route.name !== 'Home'"
      class="font-weight-bold route-tab"
    >
      {{ route.name }}
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: "Navigation",
  props: {
    center: Boolean,
    height: { type: String, default: "48px" }
  },
  data: () => ({
    tab: null,
    routes: [
      { name: "Home", path: "/" },
      { name: "Store", path: "/products" },
      { name: "Categories", path: "/categories" },
      { name: "brands", path: "/brands" }
    ]
  })
};
</script>

<style lang="scss">
.nav-tabs {
  max-width: 340px;
  font-size: 18px;
  .v-slide-group__prev,
  .v-slide-group__next {
    display: none !important;
  }
  @import "~vuetify/src/styles/styles.sass";
  // .route-tab {
  //   border-radius: $border-radius-root $border-radius-root 0 0;
  // }
}
</style>
