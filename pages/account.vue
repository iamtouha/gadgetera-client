<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <v-card outlined>
          <v-card-title class="font-weight-bold">
            {{ user.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ user.email }}
          </v-card-subtitle>
          <client-only>
            <v-card-text v-if="address">
              phone: {{ address.phone }}<br />
              address: {{ address.street_address }}, {{ address.sub_district }},
              {{ address.district }}
            </v-card-text>
          </client-only>

          <v-card-actions>
            <v-btn text color="primary" @click="logOut">
              log out
              <v-icon right>
                mdi-logout
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" lg="9">
        <h6 class="title">
          My Orders
        </h6>
        <v-divider />

        <client-only>
          <template #placeholder>
            <v-row class="mt-3">
              <v-col cols="12" sm="6" md="6" lg="4">
                <v-skeleton-loader type="article" />
              </v-col>
            </v-row>
          </template>
          <v-row class="mt-3">
            <v-col v-if="!orders.length">
              No order found.
            </v-col>
            <v-col
              v-for="order in orders"
              :key="order.id"
              cols="12"
              sm="6"
              md="6"
              lg="4"
            >
              <v-card nuxt :to="`/orders/${order.order_id}`" outlined>
                <v-card-title class="text-body-1 font-weight-bold">
                  #{{ order.order_id }}
                </v-card-title>
                <v-card-subtitle>
                  {{ order.createdAt | formatDate }}
                </v-card-subtitle>
                <v-card-subtitle>
                  status:
                  <span class="text-uppercase font-weight-bold accent--text">{{
                    order.status
                  }}</span>
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Account",
  filters: {
    formatDate(val) {
      return new Date(val).toLocaleString();
    }
  },
  middleware: "auth",
  data: () => ({
    orders: []
  }),
  fetchOnServer: false,
  async fetch() {
    try {
      const orders = await this.$axios.$get("/orders");
      this.orders = orders;
    } catch (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    return {
      title: "Account"
    };
  },
  computed: {
    ...mapGetters(["user", "address"])
  },
  methods: {
    logOut() {
      this.$store.dispatch("logOut").then(() => {
        this.$nuxt.$router.push("/");
      });
    }
  }
};
</script>
