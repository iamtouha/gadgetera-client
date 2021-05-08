<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <v-card outlined>
          <v-card-title>
            {{ user.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ user.email }}
          </v-card-subtitle>
          <v-card-text v-if="address">
            phone: {{ address.phone }}<br />
            address: {{ address.street_address }}, {{ address.sub_district }},
            {{ address.district }}
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="logOut">
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
        <div class="row mt-3">
          <v-col
            v-for="order in orders"
            :key="order.id"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-card nuxt :to="'/orders/' + order.order_id" outlined>
              <v-card-title class="text-subtitle-1">
                #{{ order.order_id }}
              </v-card-title>
              <v-card-subtitle>
                {{ order.createdAt | formatDate }}
              </v-card-subtitle>
              <v-card-subtitle> status: {{ order.status }} </v-card-subtitle>
            </v-card>
          </v-col>
        </div>
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
  async fetch() {
    try {
      const orders = await this.$axios.$get("/orders");
      this.orders = orders;
    } catch (error) {}
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