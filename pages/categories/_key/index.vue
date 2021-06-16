<template>
  <div style="display:contents;">
    <v-container style="max-width:1920px;" class="pa-0">
      <v-img :src="cover" :lazy-src="thumbnail" class="category-cover">
        <v-overlay class="align-end justify-start" absolute>
          <v-container>
            <v-card dark width="100%" color="transparent">
              <v-card-title class="text-h5 text-md-h4">
                {{ category.name }}
              </v-card-title>
              <v-card-subtitle class="text-subtitle-1">
                {{ category.description }}
              </v-card-subtitle>
            </v-card>
          </v-container>
        </v-overlay>
      </v-img>
    </v-container>
    <div class="loadingbar-wrapper">
      <v-progress-linear v-show="loading" indeterminate />
    </div>

    <v-container>
      <v-row class="my-6">
        <v-col
          v-show="!subcategories.length && loading"
          class="pa-1 pa-sm-3"
          cols="6"
          sm="4"
          md="3"
        >
          <v-skeleton-loader type="card" />
        </v-col>

        <v-col
          v-for="subcat in subcategories"
          :key="subcat.id"
          class="pa-1 pa-sm-3"
          cols="6"
          sm="4"
          md="3"
        >
          <item-card
            :title="subcat.name"
            :subtitle="subcat.products.length + ' products'"
            :image="subcat.cover"
            :path="`/categories/${category.key}/subs/${subcat.key}`"
          />
        </v-col>
        <v-col v-show="!(subcategories.length || loading)" class="text-center">
          {{ subcategories.length }}
          No subcategories found
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Category",
  data: () => ({
    loading: false,
    cover: "",
    thumbnail: "",
    category: {},
    subcategories: []
  }),
  async fetch() {
    try {
      this.loading = true;
      const key = this.$route.params.key;
      const resources = this.$repositories;
      const [categories, subcats] = await Promise.all([
        resources.category.get({ key }),
        resources.subcategory.getByCategory({ catKey: key })
      ]);

      if (!categories?.[0]) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }
      const category = categories[0];
      this.subcategories = subcats;
      this.cover = category.cover.url;
      this.thumbnail = category.cover.formats.thumbnail.url;
      this.category = category;
    } catch (error) {
      this.$nuxt.error(error);
    } finally {
      this.loading = false;
    }
  },
  head() {
    return {
      title: this.category.name,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.category.description
        },
        {
          hid: "og:image",
          name: "og:image",
          content: this.cover
        }
      ]
    };
  }
};
</script>

<style>
@media (min-width: 960px) {
  .category-cover {
    height: 300px;
  }
}
@media (min-width: 600px) and (max-width: 960px) {
  .category-cover {
    height: 240px;
  }
}
@media (max-width: 600px) {
  .category-cover {
    height: 200px;
  }
}
</style>
