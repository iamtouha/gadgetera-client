<template>
  <v-menu
    v-model="menu"
    content-class="search-menu"
    :close-on-content-click="false"
    :close-on-click="isMobile"
  >
    <template #activator="{on,attrs}">
      <v-btn
        v-show="$route.name !== 'products'"
        icon
        elevation="0"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon aria-label="search">
          mdi-magnify
        </v-icon>
      </v-btn>
    </template>

    <v-card elevation="4" class="search-card" width="340px">
      <v-btn
        x-small
        absolute
        elevation="2"
        class="secondary primary--text close-menu-btn"
        icon
        @click.stop="menu = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-text class="pb-0">
        <v-text-field
          ref="searchInput"
          v-model="search"
          placeholder="Search Product"
          name="search"
          outlined
          filled
          dense
          hide-details
        />
      </v-card-text>
      <v-list dense>
        <v-list-item
          v-show="!(products.length || loading)"
          class="justify-center"
          dense
        >
          no search result
        </v-list-item>
        <v-skeleton-loader v-show="loading" loading type="list-item-avatar" />
        <v-list-item
          v-for="item in products"
          :key="item.id"
          nuxt
          :to="`/products/` + item.slug"
          @click="menu = false"
        >
          <v-avatar>
            <v-img :src="item.photo" />
          </v-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.price | groupNum }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-show="products.length"
          class="justify-center font-weight-bold"
          dense
        >
          <v-btn small text color="accent" @click="showMore">
            show more
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapMutations } from "vuex";
import debounce from "lodash.debounce";
export default {
  name: "SearchMenu",
  filters: {
    groupNum(price) {
      if (!price) {
        return "";
      }
      const formatter = new Intl.NumberFormat("en-US");
      return "৳ " + formatter.format(price);
    }
  },
  data() {
    return {
      menu: false,
      search: "",
      products: [],
      loading: false
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  watch: {
    search: "searchItems",
    "$route.name"() {
      this.menu = false;
    },
    menu(val) {
      if (val) {
        setTimeout(() => {
          this.$refs.searchInput?.focus();
        }, 100);
      }
    }
  },

  methods: {
    ...mapMutations("products", ["RESET_FILTER", "SET_SEARCH"]),
    searchItems: debounce(async function() {
      try {
        const search = this.search.trim();
        this.loading = true;
        this.products = [];
        if (!search) {
          return;
        }
        const products = await this.$repositories.product.get(
          { search },
          { limit: 4 }
        );
        const lastSearch = this.search.trim();
        if (!lastSearch) {
          return;
        }
        this.products = products.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          photo: item.images[0].formats?.thumbnail.url || item.images[0].url
        }));
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      } finally {
        this.loading = false;
      }
    }, 300),
    showMore() {
      this.RESET_FILTER();
      this.SET_SEARCH(this.search.trim());
      this.$router.push("/products");
    }
  }
};
</script>
<style>
.search-menu {
  box-shadow: none !important;
  padding: 8px;
}
.search-card {
  position: relative;
}
.close-menu-btn {
  top: -5px;
  right: -5px;
}
</style>
