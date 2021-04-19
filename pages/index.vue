<template>
  <div style="display:contents;">
    <v-img
      class="home-main-image"
      position="center"
      src="/home_main.jpg"
      lazy-src="/home_main-lazy.jpg"
    >
      <v-row class="fill-height" justify="center" align="center">
        <v-col
          class="search-pan semi-transparent-dark rounded"
          cols="10"
          sm="6"
          md="4"
        >
          <p class="text-center title font-weight-light white--text">
            find gadgets suitable for you
          </p>
          <div class="textbox-wrapper">
            <v-autocomplete
              v-model="search"
              :items="products"
              item-text="name"
              item-value="slug"
              no-data-text="No products found"
              dark
              hide-details
              outlined
              single-line
              placeholder="Search Product"
              @input="searchItem"
            >
              <template #append>
                <v-icon color="accent">mdi-magnify</v-icon>
              </template>
            </v-autocomplete>
          </div>
        </v-col>
      </v-row>
    </v-img>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1
            :style="{ fontSize: isMobile ? '28px' : '36px' }"
            class="font-weight-light mt-10"
          >
            You may like
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="product in featured"
          :key="product.slug"
          cols="12"
          sm="6"
          md="4"
        >
          <product-card :product="product"></product-card>
        </v-col>
      </v-row>
      <v-row v-if="reviews.length">
        <v-col cols="12">
          <h1
            :style="{ fontSize: isMobile ? '28px' : '36px' }"
            class="font-weight-light"
          >
            What customers say
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(review, i) in reviews" :key="i" sm="6" md="4" cols="12">
          <v-list-item three-line>
            <v-list-item-avatar>
              <v-img :src="review.photo.url"> </v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ review.username }}</v-list-item-title>
              <v-list-item-subtitle
                style="
                    text-overflow: unset;
                    white-space: unset;
                    -webkit-line-clamp: unset;
                  "
                >{{ review.body }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  async asyncData({ $axios }) {
    try {
      const data = await $axios.$get("/homepage");
      return {
        featured: data.featured_products
      };
    } catch (error) {
      throw error;
    }
  },
  data() {
    return {
      //
      search: "",
      featured: [],
      reviews: []
    };
  },

  computed: {
    ...mapGetters(["products"]),
    isMobile() {
      if (process.server) return true;
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  head: {
    title: "Home",
    meta: [
      {
        hid: "description",
        property: "og:description",
        content: "Gadget Era is a multi-branded retail electronics seller"
      },
      {
        hid: "image",
        property: "og:image",
        content: "https://gadgeterabd.com/gadgetera.png"
      }
    ]
  },
  methods: {
    searchItem(val) {
      this.$nuxt.$router.push("/products/" + val);
    }
  }
};
</script>
<style lang="scss">
.home-main-image {
  height: 500px;
}
@media (max-width: 680px) {
  .home-main-image {
    height: 400px;
  }
}
</style>
