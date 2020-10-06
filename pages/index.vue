<template>
  <v-main>
    <v-img
      class="home-main-image"
      max-height="500px"
      position="top"
      src="/home_main.jpg"
      lazy-src="/home_main.jpg"
    >
      <div class="home-main-text-wrapper text-center">
        <div>
          <h1
            :style="{ fontSize: isMobile ? '24px' : '42px' }"
            class="font-weight-light text-center"
          >
            We provide gadgets <br />
            to boost your productivity
          </h1>
          <v-btn large color="accent" tile class="black--text mt-3 mb-2"
            >shop now</v-btn
          >
        </div>
      </div>
    </v-img>
    <client-only>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1
              :style="{ fontSize: isMobile ? '36px' : '42px' }"
              class="font-weight-light text-center"
            >
              You may like
            </h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="product in homePage.featured"
            :key="product.slug"
            cols="12"
            sm="6"
            md="4"
          >
            <product-card :product="product"></product-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h1
              :style="{ fontSize: isMobile ? '36px' : '42px' }"
              class="font-weight-light text-center"
            >
              What customers say
            </h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="(review, i) in reviews"
            :key="i"
            sm="6"
            md="4"
            cols="12"
          >
            <v-list-item three-line>
              <v-list-item-avatar>
                <v-img :src="review.user.photo"> </v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ review.user.name }}</v-list-item-title>
                <v-list-item-subtitle
                  style="
                    text-overflow: unset;
                    white-space: unset;
                    -webkit-line-clamp: unset;
                  "
                  >{{ review.review }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-container>
    </client-only>
  </v-main>
</template>

<script>
import homepageQuery from "~/graphql/queries/homepage.gql"
import ProductCard from "~/components/ProductCard.vue"
export default {
  name: "Home",
  components: { ProductCard },

  data() {
    return {
      //
      homePage: {},
      reviews: [
        {
          user: {
            name: "John Doe",
            photo: "/home_main.jpg",
          },
          review:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ad provident? Optio totam nostrum magni minima recusandae aut quibusdam. Suscipit consectetur temporibus quod doloremque quasi officiis illum distinctio quidem fugiat.",
        },
        {
          user: {
            name: "John Doe",
            photo: "/home_main.jpg",
          },
          review:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ad provident? Optio totam nostrum magni minima recusandae aut quibusdam. Suscipit consectetur temporibus quod doloremque quasi officiis illum distinctio quidem fugiat.",
        },
        {
          user: {
            name: "John Doe",
            photo: "/home_main.jpg",
          },
          review:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ad provident? Optio totam nostrum magni minima recusandae aut quibusdam. Suscipit consectetur temporibus quod doloremque quasi officiis illum distinctio quidem fugiat.",
        },
        {
          user: {
            name: "John Doe",
            photo: "/home_main.jpg",
          },
          review:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ad provident? Optio totam nostrum magni minima recusandae aut quibusdam. Suscipit consectetur temporibus quod doloremque quasi officiis illum distinctio quidem fugiat.",
        },
        {
          user: {
            name: "John Doe",
            photo: "/home_main.jpg",
          },
          review:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ad provident? Optio totam nostrum magni minima recusandae aut quibusdam. Suscipit consectetur temporibus quod doloremque quasi officiis illum distinctio quidem fugiat.",
        },
        {
          user: {
            name: "John Doe",
            photo: "/home_main.jpg",
          },
          review:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ad provident? Optio totam nostrum magni minima recusandae aut quibusdam. Suscipit consectetur temporibus quod doloremque quasi officiis illum distinctio quidem fugiat.",
        },
        {
          user: {
            name: "John Doe",
            photo: "/home_main.jpg",
          },
          review:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ad provident? Optio totam nostrum magni minima recusandae aut quibusdam. Suscipit consectetur temporibus quod doloremque quasi officiis illum distinctio quidem fugiat.",
        },
      ],
    }
  },

  apollo: {
    homePage: {
      prefetch: false,
      query: homepageQuery,
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
  head: {
    title: "Home",
    meta: [
      {
        hid: "description",
        property: "og:description",
        content: "Gadget Era is a multi-branded retail electronics seller",
      },
      {
        hid: "image",
        property: "og:image",
        content: "/home_main.png",
      },
    ],
  },
}
</script>
<style lang="scss">
.drop-shadow-white {
  text-shadow: 0px 0px 4px white;
}

.home-main-image {
  .v-responsive__content {
    display: flex;
    flex-direction: row;
    .home-main-text-wrapper {
      flex: 1;
      margin: auto 0;
      div {
        display: inline-block;
        margin: 0 auto;
        padding: 0 10px;
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
