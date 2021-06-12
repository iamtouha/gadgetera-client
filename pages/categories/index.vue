<template>
  <v-container>
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="d-none d-sm-block" style="min-width:100px;">
        Categories
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
        label="Search categories"
        placeholder="Search categories"
      />
    </v-toolbar>
    <v-divider class="d-none d-sm-block" />
    <div style="height:5px">
      <v-progress-linear v-show="loading" indeterminate />
    </div>
    <v-row class="my-6">
      <v-col v-show="!filtered.length && loading" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" />
      </v-col>
      <v-col
        v-for="category in filtered"
        :key="category.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card outlined nuxt :to="`/categories/${category.key}`">
          <v-img
            aspect-ratio="1.77"
            :src="category.cover.url"
            :lazy-src="category.cover.formats.thumbnail.url"
          />
          <v-card-title>
            {{ category.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ category.subcategories.length }} subcategories
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col v-show="!(filtered.length || loading)" class="text-center">
        No categories found
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Categories",
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
      title: "Categories"
    };
  },
  computed: {
    ...mapGetters("categories", ["categories", "loading"]),
    filtered() {
      return this.categories.filter(cat => {
        const text = this.search.toLowerCase();
        const catName = cat.name.toLowerCase();
        if (catName.includes(text)) {
          return true;
        }
        return cat.subcategories.some(item =>
          item.name.toLowerCase().includes(text)
        );
      });
    }
  },
  methods: {
    ...mapActions("categories", ["fetchAll"])
  }
};
</script>
