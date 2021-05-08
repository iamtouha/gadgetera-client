<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <transition name="fade" mode="out-in">
          <v-img
            :key="image.id"
            max-width="400px"
            class="mx-auto product-img rounded"
            aspect-ratio="1"
            :src="image.url"
            :lazy-src="image.formats && image.formats.thumbnail.url"
          />
        </transition>
        <v-row
          class="mt-2 mx-auto controller"
          style="max-width:400px"
          justify="center"
        >
          <v-col
            v-for="img in product.images"
            :key="img.url"
            cols="2"
            class="pa-1"
          >
            <v-img
              class="rounded"
              max-width="100%"
              aspect-ratio="1"
              :src="img.formats.thumbnail.url"
              @click="image = img"
            >
              <v-overlay :opacity="0.6" absolute :value="image.id === img.id" />
            </v-img>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <h1 class="text-md-h4 text-sm-h5 text-h6 mb-sm-6 mb-3">
          {{ product.name }}
        </h1>
        <h1 v-if="!product.discount" class="mb-3 text-h6 text-sm-h5 text-md-h4">
          &#2547;{{ product.price }}
        </h1>
        <h1 v-else class="text-body-1 d-flex">
          <span class="text-h6 text-sm-h5 text-md-h4">
            &#2547;
            {{ Math.ceil(product.price - product.price * product.discount) }}
            <span class="font-weight-light text-h6">
              ( <s>&#2547;{{ product.price }}</s>
              {{ Math.ceil(100 * product.discount) }}% off)
            </span>
          </span>
        </h1>
        <v-simple-table class="transparent mt-4">
          <tbody style="cursor:pointer">
            <nuxt-link tag="tr" :to="'/categories/' + subcategory.category.key">
              <th>Category</th>
              <td>{{ subcategory.category.name }}</td>
            </nuxt-link>
            <nuxt-link
              tag="tr"
              :to="
                `/categories/${subcategory.category.key}/subs/${subcategory.key}`
              "
            >
              <th>Subcategory</th>
              <td>{{ subcategory.name }}</td>
            </nuxt-link>
            <nuxt-link tag="tr" :to="'/brands/' + product.brand.key">
              <th>Brand</th>
              <td>{{ product.brand.name }}</td>
            </nuxt-link>
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
    <!-- eslint-disable vue/no-v-html -->
    <v-row class="mt-8">
      <v-col
        cols="12"
        class="description-wrapper"
        v-html="$md.render(product.description)"
      />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Product",
  data: () => ({
    image: {},
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
      const subcat = await this.$axios.$get(
        "/subcategories/" + product.subcategory.id
      );
      this.subcategory = subcat;
      this.image = this.product.images[0];
    } catch (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    return {
      title: this.product.name,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.product.description
        },
        {
          hid: "og:image",
          name: "og:image",
          content: this.product.images[0].url
        }
      ]
    };
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
    },
    viewCat() {
      this.$nuxt.$router.push("/categories/" + this.subcategory.category.key);
    },
    viewSubCat() {
      this.$nuxt.$router.push(
        "/categories/" +
          this.subcategory.category.key +
          "/subs/" +
          this.subcategory.key
      );
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
@media (max-width: 600px) {
  .add2cart-btn {
    width: 100%;
    max-width: 350px;
  }
  .add2cart-row {
    justify-content: center;
  }
}
.description-wrapper img {
  max-width: 100% !important;
}
</style>
