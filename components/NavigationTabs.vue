<template>
  <v-tabs
    v-model="tab"
    :centered="centered"
    slider-size="3"
    :align-with-title="centered"
    class="nav-tabs px-sm-3"
    :class="[centered ? 'centered' : '']"
    :height="height"
  >
    <v-tab
      v-for="route in routes"
      :key="route.name"
      :to="route.path"
      nuxt
      exact
      class="route-tab font-weight-medium"
    >
      {{ route.title }}
    </v-tab>
    <v-tabs-slider v-show="hasRoutePath" />
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
.nav-tabs {
  font-size: 18px;
  .v-slide-group__prev,
  .v-slide-group__next {
    display: none !important;
  }
  &.centered {
    max-width: 500px;
  }
}
</style>
