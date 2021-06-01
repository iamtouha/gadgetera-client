<template>
  <v-container>
    <v-breadcrumbs class="pl-0" :items="bredcrumbItems" />

    <v-row>
      <v-col cols="12" sm="6">
        <v-carousel
          height="auto"
          hide-delimiter-background
          cycle
          :show-arrows="false"
          :interval="10000"
        >
          <v-carousel-item v-for="img in product.images" :key="img.id">
            <div class="responsive rounded">
              <div class="sizer">
                <div class="wrapper">
                  <img
                    :src="img | small"
                    :alt="img.alternativeText"
                    :title="img.caption"
                  />
                </div>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col cols="12" sm="6">
        <h1 class="text-md-h4 text-sm-h5 text-h6 mb-3">
          {{ product.name }}
        </h1>
        <h2 v-if="!product.discount" class="mb-3 text-h6 font-weight-bold">
          {{ product.price | groupNum }}
        </h2>
        <h2 v-else class="text-body-1 d-flex">
          <span class="text-h6 font-weight-bold">
            {{
              Math.ceil(product.price - product.price * product.discount)
                | groupNum
            }}
            <span class="font-weight-light text-h6">
              ( <s>{{ product.price | groupNum }}</s>
              {{ Math.ceil(100 * product.discount) }}% off)
            </span>
          </span>
        </h2>
        <p class="mt-4">
          {{ product.overview }}
        </p>
        <p class="text-subtitle font-weight-bold">
          Options
        </p>
        <v-row class="mb-3">
          <v-col v-for="option in options" :key="option.id" cols="3" lg="2">
            <v-card
              elevation="0"
              :to="'/products/' + option.slug"
              nuxt
              active-class="option-active"
            >
              <v-img
                :src="option.thumb"
                aspect-ratio="1"
                :title="option.name"
                :alt="option.name"
              >
                <v-overlay absolute class="option-overlay">
                  <v-icon>
                    mdi-check-circle
                  </v-icon>
                </v-overlay>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
        <v-simple-table dense class="transparent">
          <tbody style="cursor:pointer">
            <tr v-show="product.model">
              <th>Model</th>
              <td>{{ product.model }}</td>
            </tr>
            <tr>
              <th>SKU</th>
              <td>{{ product.sku }}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                {{ product.stock ? "Available in stock" : "Out of Stock" }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-row class="px-2 mt-6 mx-auto add2cart-row">
          <v-spacer class="d-sm-block d-none" />
          <v-btn
            class="d-sm-block d-none primary add2cart-btn mt-3"
            text
            large
            @click="addToCart"
          >
            <v-icon left>
              mdi-cart-plus
            </v-icon>
            add to cart
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-btn fab bottom right fixed class="d-sm-none" @click="addToCart">
      <v-icon>mdi-cart-plus</v-icon>
    </v-btn>
    <div class="description-box">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <section class="ck-content" v-html="product.description" />
    </div>
  </v-container>
</template>

<script>
import "~/assets/ck_style.css";
import extractor from "keyword-extractor";

export default {
  name: "Product",
  filters: {
    groupNum(price) {
      if (!price) {
        return "";
      }
      const formatter = new Intl.NumberFormat("en-US");
      return "৳ " + formatter.format(price);
    },
    thumb(img) {
      return img.formats?.thumbnail.url || img.url;
    },
    small(img) {
      return img.formats?.small?.url || img.url;
    }
  },
  data: () => ({
    image: {},
    options: [],
    product: {
      images: [],
      brand: {},
      description: ""
    },
    subcategory: {
      category: {}
    }
  }),

  async fetch() {
    try {
      const slug = this.$route.params.slug;
      const [product] = await this.$axios.$get("/products?slug=" + slug);
      if (!product) {
        return this.$nuxt.error({ statusCode: 404, message: "not found" });
      }
      this.product = product;
      // eslint-disable-next-line prefer-const
      let [options, subcat] = await Promise.all([
        this.$axios.$get("/products?model=" + product.model),
        this.$axios.$get("/subcategories/" + product.subcategory.id)
      ]);
      if (!product.model) {
        options = [product];
      }
      this.options = options.map(option => ({
        id: option.id,
        thumb: option.images[0].formats?.thumbnail.url || option.images[0].url,
        name: option.name,
        slug: option.slug
      }));

      this.subcategory = subcat;
      this.image = this.product.images[0];
    } catch (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    if (!this.product.id) {
      return {
        title: "Loading..."
      };
    }
    const { name, overview, slug } = this.product;
    const keywords = extractor.extract(`${name}. ${overview}`, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true
    });
    return {
      title: name,
      meta: [
        { hid: "description", name: "description", content: overview },
        { hid: "keywords", property: "keywords", content: keywords },
        {
          hid: "og:url",
          property: "og:url",
          content: `${process.env.BASE_URL ||
            "https://gadgeterabd.com"}/products/${slug}`
        },
        { hid: "og:title", property: "og:title", content: name },
        { hid: "og:desc", property: "og:description", content: overview },
        { hid: "og:image", property: "og:image", content: this.imageUrl },
        { hid: "twitter:card", name: "twitter:card", content: "summary" }
      ]
    };
  },
  computed: {
    bredcrumbItems() {
      const subcategory = this.subcategory;
      const category = this.subcategory.category;
      const brand = this.product.brand;
      return [
        { to: `/categories/${category.key}`, text: category.name },
        {
          to: `/categories/${category.key}/subs/${subcategory.key}`,
          text: subcategory.name
        },
        { to: `/brands/${brand.key}`, text: brand.name },
        {
          disabled: true,
          text: this.product.name
        }
      ];
    }
  },

  methods: {
    addToCart() {
      if (!this.product.stock) {
        return this.$store.commit("SHOW_ALERT", "Out of Stock!");
      }
      this.$store.commit("cart/ADD_TO_CART", {
        product: this.product,
        quantity: 1
      });
      this.$store.commit("SHOW_ALERT", "added to cart");
    }
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.option-overlay {
  display: none;
}
.option-active {
  cursor: default !important;
}
.option-active .option-overlay {
  display: flex;
}
.controller .active {
  position: relative;
}
.controller .active::before {
  content: " ";
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 10px solid #555;
  position: absolute;
  bottom: 0;
}
.option-active {
  outline: 10px;
}
.description-box {
  all: unset;
}
.description-box > .ck-content {
  margin-top: 100px;
}
@media (max-width: 600px) {
  .add2cart-btn {
    width: 100%;
    max-width: 350px;
  }
  .add2cart-row {
    justify-content: center;
  }
}
</style>
<style lang="scss" scoped>
.responsive {
  position: relative;
  overflow: hidden;
  .offer-chip {
    position: absolute;
    z-index: 4;
    top: 5px;
    right: 5px;
  }
  .sizer {
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    padding-bottom: 100%;
  }
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}
</style>
