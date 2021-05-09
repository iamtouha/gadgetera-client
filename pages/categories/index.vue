<template>
  <v-container>
    <v-toolbar flat color="transparent">
      <v-toolbar-title style="min-width:100px;">
        Categories
      </v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-model="search"
        style="max-width:300px;"
        outlined
        single-line
        hide-details
        append-icon="mdi-magnify"
        label="Search categories"
        placeholder="Search categories"
      />
    </v-toolbar>
    <v-divider class="my-1" />
    <div style="height:5px">
      <v-progress-linear v-show="loading" indeterminate />
    </div>
    <v-row class="mt-5">
      <v-col
        v-for="category in filtered"
        :key="category.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card outlined nuxt :to="'/categories/' + category.key">
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
      <v-col v-if="!filtered.length" class="text-center">
        No categories found
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Categories",
  data: () => ({
    loading: false,
    categories: [],
    search: ""
  }),
  async fetch() {
    try {
      this.loading = true;
      const categories = await this.$axios.$get("/categories");
      this.categories = categories;
    } catch (error) {
      this.$nuxt.error(error);
    } finally {
      this.loading = false;
    }
  },
  head() {
    return {
      title: "Categories"
    };
  },
  computed: {
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
  }
};
</script>

<style></style>
