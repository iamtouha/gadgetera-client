<template>
  <v-container class="mt-6">
    <div class="d-flex align-center">
      <h1 class="title d-none d-sm-block">
        Categories
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
        label="Search categories"
        placeholder="Search categories"
      />
    </div>
    <v-divider />

    <v-row class="my-6" align="stretch">
      <v-col v-show="!filtered.length && loading" cols="6" sm="4" md="3">
        <v-skeleton-loader type="card" />
      </v-col>
      <v-col
        v-for="category in filtered"
        :key="category.id"
        class="pa-2 pa-sm-3"
        cols="6"
        sm="4"
        md="3"
      >
        <item-card
          :title="category.name"
          :subtitle="category.subcategories.length + ' subcategories'"
          :image="category.cover"
          :path="`/categories/${category.key}`"
        />
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
