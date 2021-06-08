<template>
  <div style="display:contents;">
    <v-container style="max-width:1920px;" class="pa-0">
      <v-img :src="cover" :lazy-src="thumbnail" class="category-cover">
        <v-overlay class="align-end justify-start" absolute>
          <v-container>
            <v-card dark width="100%" color="transparent">
              <v-card-title class="text-h5 text-md-h4 text-lg-h3">
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
          cols="12"
          sm="6"
          md="4"
        >
          <v-skeleton-loader type="card" />
        </v-col>

        <v-col
          v-for="subcat in subcategories"
          :key="subcat.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            outlined
            nuxt
            :to="`/categories/${category.key}/subs/${subcat.key}`"
          >
            <v-img
              aspect-ratio="1.77"
              :src="subcat.cover.url"
              :lazy-src="subcat.cover.formats.thumbnail.url"
            />
            <v-card-title>
              {{ subcat.name }}
            </v-card-title>
            <v-card-subtitle>
              {{
                subcat.products.length >= 100 ? "100+ " : subcat.products.length
              }}
              Products
            </v-card-subtitle>
          </v-card>
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
      const [category] = await this.$axios.$get(
        "/categories?key=" + this.$route.params.key
      );
      if (!category) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }
      const subcats = await this.$axios.$get(
        "/subcategories?category.key=" + this.$route.params.key
      );
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
