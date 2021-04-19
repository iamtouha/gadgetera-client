<template>
  <v-card>
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

    <v-card-text>
      <p>
        Transaction ID:
        {{
          order.cash_on_delivery
            ? "(Cash on delivery)"
            : order.payments[0].transaction_id
        }}
        <br />
        Receiver: {{ order.shipping_address.receiver }}
        <br />
        email: {{ order.shipping_address.email }}
        <br />
        Phone: {{ order.shipping_address.phone }}
        <br />
        Address:
        {{
          `${order.shipping_address.street_address}, ${order.shipping_address.sub_district}, ${order.shipping_address.district}`
        }}
      </p>
      <v-list color="transparent" class="productList">
        <v-list-item
          v-for="item in order.cart"
          :key="item.id"
          class="px-0"
          dense
        >
          <v-list-item-avatar class="mb-1 mt-0">
            <v-img :src="item.product.photos[0] | thumb"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title>
              {{ item.product.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.variant }} &times; {{ item.quantity }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action> {{ item.subtotal }}BDT </v-list-item-action>
        </v-list-item>
        <v-divider />
        <v-list-item dense class="px-0" style="min-height:30px !important">
          <v-list-item-avatar size="20" class="my-0"> </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title class="text-right">
              Cart Total
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            {{ order.cart_total }}BDT
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          v-if="order.coupon"
          dense
          class="px-0"
          style="min-height:30px !important"
        >
          <v-list-item-avatar size="20" class="my-0"> </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title class="text-right">
              Discount({{ order.coupon.code }})
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            -{{ order.coupon.discount }}BDT
          </v-list-item-action>
        </v-list-item>
        <v-list-item dense class="px-0" style="min-height:30px !important">
          <v-list-item-avatar size="20" class="my-0"> </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title class="text-right">
              Delivery Charge
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            {{ order.delivery_charge }}BDT
          </v-list-item-action>
        </v-list-item>
        <v-divider />
        <v-list-item dense class="px-0" style="min-height:30px !important">
          <v-list-item-avatar size="20" class="my-0"> </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title class="text-right">
              Total
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            {{ order.total }}BDT
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-spacer> </v-spacer>
      <v-btn text color="accent" @click="$emit('close')">close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "OrderSummary",
  props: {
    order: Object
  },
  filters: {
    dateStr(val) {
      const date = new Date(val);
      console.log(date.toDateString());
      return dayjs(date).format("DD MMMM, YYYY hh:mm a");
    },
    thumb(photo) {
      return photo.formats?.thumbnail.url || photo.url;
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    }
  }
};
</script>
<style lang="scss">
@media (max-width: 400px) {
  .productList {
    .v-avatar {
      display: none;
    }
  }
}
</style>
