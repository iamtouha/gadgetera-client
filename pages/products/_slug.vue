<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12" md="6" class="slider-wrapper">
        <client-only>
          <template #placeholder>
            <img :src="thumbPhoto" class="rounded mx-auto" alt="" />
          </template>
          <v-carousel class="mx-auto product-carousel">
            <v-carousel-item
              v-for="(photo, i) in product.photos"
              :key="photo.id"
            >
              <v-img
                class="rounded"
                :src="photo.url"
                :lazy-src="i === 0 ? thumbPhoto : ''"
                height="100%"
              >
              </v-img>
            </v-carousel-item>
          </v-carousel>
        </client-only>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="0" class="product-card">
          <v-card-title>
            <h1 class="title">
              {{ product.name }}
            </h1>
          </v-card-title>
          <v-card-subtitle>
            <h2>{{ price }}BDT</h2>
          </v-card-subtitle>
          <v-card-text>
            <!-- <p class="body-1 mb-0">Category: {{ product.category.name }}</p>
            <p class="body-1">Brand: {{ product.brand.name }}</p> -->
            <p class="mb-0">Variants</p>
            <v-list-item-group
              v-model="variant"
              class="variant-list"
              mandatory
              color="accent"
            >
              <v-list-item
                style="max-width:400px;"
                v-for="variant in product.variants"
                :key="variant.id"
                :disabled="!variant.inStock"
                :value="variant.id"
                class="rounded"
              >
                {{ variant.title }}
                {{ variant.inStock ? "" : "(Out of Stock)" }}
              </v-list-item>
            </v-list-item-group>
            <p class="mb-0 mt-4">Quantity</p>
            <v-text-field
              v-model="quantity"
              class="quantity-field"
              dense
              outlined
              readonly
              hide-details
              append-icon="mdi-plus-circle"
              prepend-inner-icon="mdi-minus-circle"
              @click:append="incrementQuantity"
              @click:prepend-inner="decrementQuantity"
            >
            </v-text-field>
          </v-card-text>
          <v-card-actions class="mt-auto mb-0 product-card-actions">
            <v-row>
              <v-col cols="6">
                <v-btn
                  :disabled="addedToCart"
                  large
                  text
                  width="100%"
                  @click="addToCart"
                >
                  <v-icon left>mdi-cart-plus</v-icon>
                  {{ addedToCart ? "Added to cart" : "Add to cart" }}
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  large
                  color="accent"
                  elevation="0"
                  class="black--text"
                  width="100%"
                  @click="orderNow"
                >
                  order now
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pb-6">
      <v-col cols="12" v-html="$md.render(product.description)"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Product",
  data() {
    return {
      variant: null,
      noStock: false,
      quantity: 1,
      price: 0,
      product: {
        photos: [],
        variants: [],
        brand: {},
        category: {},
        description: ""
      }
    };
  },
  computed: {
    ...mapGetters("cart", ["cart"]),
    thumbPhoto() {
      const [photo] = this.product.photos;
      if (!photo) return "";
      return photo.formats?.thumbnail.url || photo.url;
    },
    addedToCart() {
      return this.cart.some(
        item =>
          item.product.id === this.product.id &&
          item.variant.id === this.variant
      );
    }
  },
  watch: {
    variant(val) {
      const variant = this.product.variants.find(({ id }) => id === val);
      if (variant) {
        this.quantity = 1;
        this.price = variant.price;
      }
    }
  },
  head() {
    return {
      title: this.product.name,
      meta: [
        {
          hid: "description",
          property: "og:description",
          content: this.product.description
        },
        {
          hid: "image",
          property: "og:image",
          content: this.product.photos[0]?.url
        }
      ]
    };
  },
  async fetch() {
    try {
      const slug = this.$route.params.slug;
      const [product] = await this.$axios.$get("/products?slug=" + slug);
      this.product = product;
      const variant = product.variants.find(item => item.inStock);
      if (!variant) {
        this.price = product.variants[0].price;
        this.noStock = true;
        return;
      }
      this.variant = variant.title;
      this.price = variant.price;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    incrementQuantity() {
      if (this.quantity < 10) {
        this.quantity++;
      }
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    addToCart() {
      if (this.noStock) {
        return this.$store.commit(
          "showAlert",
          "Product is currently out of stock"
        );
      }
      const { id, name, photos, slug } = this.product;
      const thumbnail = photos[0].formats?.thumbnail.url;

      const cartItem = {
        product: { id, slug, name, thumbnail: thumbnail || photos[0].url },
        price: this.price,
        quantity: this.quantity,
        variant: this.product.variants.find(vrt => vrt.id === this.variant)
      };
      this.$store.commit("cart/addToCart", cartItem);
      return this.$store.commit("showAlert", "Added to cart");
    },
    orderNow() {
      if (this.noStock) {
        return this.$store.commit(
          "showAlert",
          "Product is currently out of stock"
        );
      }
      if (!this.addedToCart) {
        this.addToCart();
      }

      this.$router.push("/checkout");
    }
  }
};
</script>
<style lang="scss">
.product-image {
  max-width: 100%;
}
.variant-list {
  .v-list-item {
    overflow: hidden;
  }
}
.product-card {
  padding-bottom: 70px;
  .product-card-actions {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .quantity-field {
    max-width: 130px;
    .v-text-field__slot {
      input {
        text-align: center !important;
      }
    }
  }
}
.slider-wrapper {
  .client-only-placeholder {
    height: 500px;
    overflow: hidden;
    img {
      display: block;
      height: 100%;
      width: auto;
      margin: 0 auto;
    }
  }
}
.product-carousel {
  height: 500px !important;
}
@media screen and (min-width: 960px) {
  .product-card {
    height: 500px;
  }
}
@media screen and (max-width: 960px) {
  .slider-wrapper {
    .client-only-placeholder {
      height: 450px;
    }
  }
  .product-carousel {
    max-width: 450px;
    height: 450px !important;
  }
}
</style>
