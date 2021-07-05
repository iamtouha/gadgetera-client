<template>
  <v-container>
    <div class="d-flex align-center">
      <h1 class="title d-none d-sm-block">
        Brands
      </h1>
      <v-spacer class="d-none d-sm-block" />
      <v-text-field
        v-model="search"
        style="max-width:300px; width:100%;"
        class="mx-auto mx-sm-0 toolbar-input"
        solo
        flat
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search brands"
        placeholder="Search brands"
      />
    </div>
    <v-divider />

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
        <v-card nuxt color="transparent" :to="`/brands/${brand.key}`">
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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Brands",
  data: () => ({
    search: ""
  }),
  async fetch() {
    const error = await this.fetchAll();
    if (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    return {
      title: "Brands"
    };
  },
  computed: {
    ...mapGetters("brands", ["brands", "loading"]),
    filtered() {
      return this.brands.filter(cat => {
        const text = this.search.toLowerCase();
        const catName = cat.name.toLowerCase();
        return catName.includes(text);
      });
    }
  },
  methods: {
    ...mapActions("brands", ["fetchAll"])
  }
};
</script>

<style></style>
