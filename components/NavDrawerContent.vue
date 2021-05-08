<template>
  <div style="display:contents;">
    <v-list-item v-if="isLoggedIn" nuxt to="/account">
      <v-list-item-content>
        <v-list-item-title>
          {{ user.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user.email }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list>
      <v-list-item nuxt exact to="/">
        <v-list-item-avatar>
          <v-icon>mdi-home-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item nuxt exact to="/products">
        <v-list-item-avatar>
          <v-icon>mdi-gift-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>Shop</v-list-item-title>
      </v-list-item>
      <v-list-item nuxt exact to="/categories">
        <v-list-item-avatar>
          <v-icon>mdi-basket-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>Categories</v-list-item-title>
      </v-list-item>
      <v-list-item nuxt exact to="/brands">
        <v-list-item-avatar>
          <v-icon>mdi-shopping-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>Brands</v-list-item-title>
      </v-list-item>
      <v-list-item nuxt exact to="/contact">
        <v-list-item-avatar>
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>Contact Us</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "NavDrawer",
  computed: {
    ...mapGetters(["user", "isLoggedIn"])
  }
};
</script>

<style></style>
