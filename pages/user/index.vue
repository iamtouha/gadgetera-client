<template>
  <v-container class="mt-4">
    <v-dialog v-model="dialog" max-width="350px">
      <v-card elevation="0">
        <v-card-text class="body-1 pt-3">
          A password reset link will be sent to your email. Please follow that
          link to change the password.
        </v-card-text>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            elevation="0"
            color="accent"
            class="black--text"
            :loading="resetting"
            @click="resetPass"
          >
            continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" md="8" order="2" order-md="1">
        <v-card elevation="0" class="mb-1">
          <v-card-title>Orders</v-card-title>
        </v-card>
        <client-only>
          <template #placeholder>
            <v-skeleton-loader
              type="card-header,article,actions"
            ></v-skeleton-loader>
          </template>
          <v-card v-if="!loading && !orders.length">
            <v-card-text
              >Place your first order
              <nuxt-link to="/products">Here</nuxt-link>
            </v-card-text>
          </v-card>
          <v-card
            v-for="order in orders"
            :key="order.id"
            @click="
              orderDialog = true;
              selectedOrder = order;
            "
            elevation="0"
            class="my-2"
          >
            <v-card-title>
              <h1 class="title">#{{ order.order_id }}</h1>
              <v-spacer />
              <v-btn :x-small="isMobile" outlined text>
                {{ order.status }}
              </v-btn>
            </v-card-title>
            <v-card-subtitle class="pb-2">
              {{ order.createdAt | dateStr }}
            </v-card-subtitle>
          </v-card>
        </client-only>
      </v-col>
      <v-col cols="12" md="4" order="1" order-md="2">
        <client-only>
          <template #placeholder>
            <v-skeleton-loader
              type="card-header,article,actions"
            ></v-skeleton-loader>
          </template>

          <v-card elevation="0">
            <v-card-title>
              <h1 class="headline">{{ user && user.name }}</h1>
            </v-card-title>
            <v-card-subtitle>
              <h2 class="subtitle-1">{{ user && user.email }}</h2>
            </v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="accent" @click="dialog = true">
                Reset password
              </v-btn>

              <v-btn
                elevation="0"
                color="accent"
                class="black--text"
                @click="signout"
              >
                logout
                <v-icon class="d-md-none d-lg-block" right>mdi-logout</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </client-only>
      </v-col>
    </v-row>
    <v-dialog scrollable max-width="500px" v-model="orderDialog">
      <order-summary
        :order="selectedOrder"
        @close="orderDialog = false"
      ></order-summary>
    </v-dialog>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "Dashboard",
  middleware: "authenticated",
  filters: {
    dateStr(val) {
      return dayjs(val).format("DD MMMM, YYYY hh:mm a");
    },
    thumb(photo) {
      return photo.formats?.thumbnail.url || photo.url;
    }
  },
  data() {
    return {
      resetting: false,
      dialog: false,
      orderDialog: false,
      loading: false,
      orders: [],
      selectedOrder: {}
      //
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    user() {
      return this.$store.getters.user;
    }
  },
  fetchOnServer: false,
  async fetch() {
    try {
      this.loading = true;
      const orders = await this.$axios.$get("/orders");
      this.orders = orders;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    signout() {
      this.$store.commit("signOut", this.$nuxt);
    },
    async resetPass() {
      try {
        this.resetting = true;
        await this.$strapi.forgotPassword({
          email: this.user.email
        });
        this.resetting = false;
        this.dialog = false;
        this.$store.commit("showAlert", "Reset password link sent");
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style></style>
