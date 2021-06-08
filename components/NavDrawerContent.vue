<template>
  <div style="display:contents;">
    <v-list-item v-if="isLoggedIn" three-line nuxt to="/account">
      <v-list-item-content>
        <v-list-item-title>
          {{ user.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user.email }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-btn text color="accent" icon>
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-list-item v-else exact nuxt to="/signup">
      <v-list-item-title>
        Sign Up
      </v-list-item-title>
      <v-list-item-action>
        <v-btn text color="accent" icon>
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-list shaped>
      <v-list-item
        v-for="route in routes"
        :key="route.name"
        nuxt
        exact
        :to="route.path"
      >
        <v-list-item-avatar>
          <v-icon>{{ route.icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>{{ route.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "NavDrawer",
  data() {
    return {
      routes: [
        {
          name: "Home",
          path: "/",
          icon: "mdi-home-outline"
        },
        {
          name: "Store",
          path: "/products",
          icon: "mdi-store-outline"
        },
        {
          name: "Categories",
          path: "/categories",
          icon: "mdi-basket-outline"
        },
        {
          name: "Brands",
          path: "/brands",
          icon: "mdi-shopping-outline"
        },
        {
          name: "Contact us",
          path: "/contact",
          icon: "mdi-help-circle-outline"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "isLoggedIn"])
  }
};
</script>
