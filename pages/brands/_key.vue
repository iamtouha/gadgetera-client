<template>
  <v-container>
    <v-card color="transparent" :loading="loading">
      <div class="d-flex flex-no-wrap">
        <div v-show="!logo" class="responsive rounded ma-1" style="width:95px;">
          <div class="sizer">
            <div class="wrapper">
              <v-skeleton-loader type="image" />
            </div>
          </div>
        </div>
        <v-img
          v-show="logo"
          contain
          max-width="95px"
          class="rounded ma-1"
          :aspect-ratio="1"
          :src="logo"
        />
        <div class="d-flex flex-column justify-end">
          <v-card-title class="text-h4">
            <v-skeleton-loader
              v-show="!brand.id"
              min-width="250px"
              class="mb-2"
              type="heading"
            />
            {{ brand.name }}
          </v-card-title>
          <v-card-subtitle>
            <v-skeleton-loader v-show="!brand.id" type="text" />
            {{ brand.description }}
          </v-card-subtitle>
        </div>
      </div>
    </v-card>

    <v-row class="mt-3">
      <v-col
        v-show="!products.length && loading"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-skeleton-loader type="card" />
      </v-col>

      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="3"
      >
        <product-card :product="product" />
      </v-col>
      <v-col v-show="!(products.length || loading)" class="text-center">
        No products found
      </v-col>
      <v-col class="text-center" cols="12">
        <v-btn :disabled="!products.length" outlined large @click="fetchMore">
          load more
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Brand",
  data: () => ({
    loading: false,
    logo: "",
    brand: {},
    products: [],
    filterParams: {
      sortField: "published_at",
      sortOrder: "desc",
      brandKey: null
    }
  }),
  async fetch() {
    try {
      this.loading = true;
      const key = this.$route.params.key;
      this.filterParams.brandKey = key;
      const [brands, products] = await Promise.all([
        this.$repositories.brand.get({ key }),
        this.$repositories.product.get(this.filterParams)
      ]);
      const [brand] = brands;
      if (!brand) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }
      this.products = products;
      this.logo = brand.logo.url;
      this.brand = brand;
    } catch (error) {
      this.$nuxt.error(error);
    } finally {
      this.loading = false;
    }
  },
  head() {
    return {
      title: this.brand.name,
      meta: [
        { hid: "title", name: "title", content: this.brand.name },
        { hid: "og:title", name: "og:title", content: this.brand.name },
        {
          hid: "description",
          name: "description",
          content: this.brand.description
        },
        {
          hid: "og:description",
          name: "og:description",
          content: this.brand.description
        },
        { hid: "og:image", name: "og:image", content: this.logo }
      ]
    };
  },
  methods: {
    async fetchMore() {
      try {
        const products = await this.$repositories.product.get(
          this.filterParams,
          { start: this.products.length }
        );

        if (!products.length) {
          return this.$store.commit("SHOW_ALERT", "No more products to show");
        }
        this.products = [...this.products, ...products];
      } catch (error) {
        this.$store.commit("SHOW_ALERT", error.message);
      }
    }
  }
};
</script>
