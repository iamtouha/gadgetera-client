<template>
  <v-menu
    v-model="menu"
    offset-y
    max-width="450px"
    :close-on-content-click="false"
  >
    <template #activator="{on,attrs}">
      <v-btn icon elevation="0" v-bind="attrs" v-on="on">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
    <v-card min-width="300px">
      <v-card-title>Search</v-card-title>
      <v-card-text>
        <v-text-field v-model="search" outlined filled dense hide-details />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "SearchMenu",
  data() {
    return {
      menu: false,
      search: ""
    };
  },
  mounted() {
    this.$store.dispatch("products/fetch");
  }
};
</script>

<style></style>
