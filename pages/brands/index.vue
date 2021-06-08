<template>
  <v-container>
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="d-none d-sm-block" style="min-width:100px;">
        Brands
      </v-toolbar-title>
      <v-spacer class="d-none d-sm-block" />
      <v-text-field
        v-model="search"
        style="max-width:450px; width:100%;"
        class="mx-auto mx-sm-0"
        outlined
        single-line
        hide-details
        append-icon="mdi-magnify"
        label="Search brands"
        placeholder="Search brands"
      />
    </v-toolbar>
    <v-divider />
    <div style="height:5px">
      <v-progress-linear v-show="loading" indeterminate />
    </div>
    <v-row class="mt-5">
      <v-col v-show="!filtered.length && loading" cols="6" sm="4" md="3" lg="2">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col
        v-for="brand in filtered"
        :key="brand.id"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-card outlined nuxt :to="`/brands/${brand.key}`">
          <v-img :aspect-ratio="1" contain :src="brand.logo.url" />
        </v-card>
      </v-col>
      <v-col v-show="!(filtered.length || loading)" class="text-center">
        No brands found
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Brands",
  data: () => ({
    loading: false,
    brands: [],
    search: ""
  }),
  async fetch() {
    try {
      this.loading = true;
      const brands = await this.$axios.$get("/brands");
      this.brands = brands;
    } catch (error) {
      this.$nuxt.error(error);
    } finally {
      this.loading = false;
    }
  },
  head() {
    return {
      title: "Brands"
    };
  },
  computed: {
    filtered() {
      return this.brands.filter(cat => {
        const text = this.search.toLowerCase();
        const catName = cat.name.toLowerCase();
        return catName.includes(text);
      });
    }
  }
};
</script>

<style></style>
