<template>
  <v-tabs
    v-model="tab"
    slider-size="3"
    class="nav-tabs px-sm-3"
    :class="[centered ? 'mx-auto' : '']"
    :height="height"
    :centered="centered"
    style="max-width:800px"
  >
    <v-tab
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      nuxt
      :exact="route.name === 'index'"
      class="route-tab"
    >
      {{ route.title }}
    </v-tab>
    <v-tabs-slider />
  </v-tabs>
</template>

<script>
export default {
  name: "Navigation",
  props: {
    centered: Boolean,
    height: { type: String, default: "48px" }
  },
  data: () => ({
    tab: null,
    routes: [
      { title: "Home", path: "/", name: "index" },
      { title: "Store", path: "/products", name: "products" },
      { title: "Categories", path: "/categories", name: "categories" },
      { title: "brands", path: "/brands", name: "brands" }
    ]
  }),
  computed: {
    hasRoutePath() {
      const name = this.$route.name;
      return this.routes.some(item => item.name === name);
    }
  }
};
</script>

<style lang="scss">
.route-tab {
  font-weight: 600 !important;
}
.nav-tabs {
  .v-slide-group__prev,
  .v-slide-group__next {
    display: none !important;
  }
}
</style>
