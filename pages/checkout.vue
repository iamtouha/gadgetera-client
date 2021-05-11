<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="5">
        <client-only>
          <v-card outlined>
            <v-card-title>Cart</v-card-title>
            <cart increment :checkout-btn="false" increment-btns />

            <v-card-text>
              <v-divider />
              <div class="mx-0 px-2 my-3 d-flex">
                <v-text-field
                  v-model="couponCode"
                  single-line
                  label="Coupon"
                  class="coupon-input"
                  placeholder="Coupon"
                  clearable
                  outlined
                  dense
                  hide-details
                />
                <v-btn
                  max-width="150px"
                  height="40px"
                  text
                  class="primary"
                  @click="getCoupon"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-simple-table class="text-body-2 doc-table">
                <tbody>
                  <tr>
                    <td>Cart total</td>
                    <td>&#2547; {{ Math.ceil(cartTotal) }}</td>
                  </tr>
                  <tr v-if="coupon">
                    <td>Discount ({{ coupon.code }})</td>
                    <td>- &#2547; {{ coupon.discount }}</td>
                  </tr>
                  <tr>
                    <td>Shipping charge</td>
                    <td>&#2547; {{ shipping }}</td>
                  </tr>
                  <tr>
                    <td class="text-subtitle-2">
                      Subtotal
                    </td>
                    <td class="text-subtitle-2">
                      &#2547;
                      {{
                        Math.ceil(cartTotal) +
                          shipping -
                          (coupon ? coupon.discount : 0)
                      }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
              <v-list subheader class="mt-3">
                <v-subheader>Payment Options</v-subheader>
                <v-list-item v-for="option in payment.options" :key="option.id">
                  <v-list-item-content class="py-0">
                    <v-list-item-title>
                      {{ option.name }}
                      <v-icon>mdi-chevron-right</v-icon>
                      {{ option.account }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ option.note }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </client-only>
      </v-col>
      <v-col cols="12" md="7">
        <h1 class="title">
          Shipping Address
        </h1>
        <v-divider />
        <v-text-field v-model="address.receiver" label="Receiver Name" />
        <v-text-field v-model="address.email" label="Email" />
        <v-text-field v-model="address.phone" label="Phone" />
        <v-row>
          <v-col cols="6">
            <v-autocomplete
              v-model="district"
              :items="districts"
              item-text="name"
              item-value="id"
              label="District"
            />
          </v-col>
          <v-col cols="6">
            <v-autocomplete
              v-model="address.sub_district"
              :items="subDistricts"
              item-text="name"
              item-value="name"
              label="Sub District"
            />
          </v-col>
        </v-row>
        <v-text-field v-model="address.street_address" label="Street Address" />
        <h1 class="title mt-6">
          Payment
        </h1>
        <v-divider />
        <v-checkbox
          v-model="order.cash_on_delivery"
          label="Cash on delivery"
          :hint="
            !isDomestic && order.cash_on_delivery
              ? 'Shipping charge is required in advance'
              : ''
          "
          persistent-hint
        />
        <v-select
          v-model="order.option"
          label="Method"
          :items="['bkash', 'nagad', 'rocket']"
        />
        <v-text-field v-model="order.trx_id" label="Transaction Id" />
        <v-btn
          :loading="placing_order"
          class="primary mt-2 orderbtn"
          text
          large
          @click="placeOrder"
        >
          Place Order
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable camelcase */
import { mapGetters, mapMutations } from "vuex";
import { subDistricts, districts } from "~/assets/addressbook.json";
export default {
  name: "Checkout",
  data: () => ({
    district: "",
    couponCode: "",
    placing_order: false,
    coupon: null,
    address: {
      district: "",
      sub_district: "",
      street_address: "",
      phone: "",
      receiver: "",
      email: ""
    },
    order: {
      option: "",
      trx_id: "",
      cash_on_delivery: false
    },
    payment: {
      options: [],
      domestic_districts: "",
      shipping_charge: 0
    },
    shipping: 120
  }),
  async fetch() {
    try {
      const data = await this.$axios.$get("/payment");
      this.payment = data;
    } catch (error) {
      this.$nuxt.error(error);
    }
  },
  head() {
    return {
      title: "Checkout"
    };
  },
  computed: {
    ...mapGetters("cart", ["cartItems", "cartTotal"]),
    districts() {
      return districts;
    },
    subDistricts() {
      if (this.district) {
        return subDistricts.filter(item => item.district_id === this.district);
      }
      return [];
    },
    savedAddress() {
      return this.$store.getters.address;
    },
    isDomestic() {
      const dist = this.address.district?.trim().toLowerCase();
      const arr = this.payment.domestic_districts
        .split(",")
        .map(item => item?.trim().toLowerCase());
      return arr.includes(dist);
    }
  },
  watch: {
    district(val) {
      if (val) {
        const item = districts.find(item => item.id === val);
        this.address.district = item.name;
      }
    },
    isDomestic(val) {
      if (val) {
        return (this.shipping = this.payment.domestic_shipping_charge);
      }
      this.shipping = this.payment.shipping_charge;
    },
    couponCode() {
      if (this.coupon) {
        this.coupon = null;
      }
    },
    cartTotal(val) {
      if (this.coupon && val < this.coupon.minimum_order) {
        this.coupon = null;
        this.SHOW_ALERT("Coupon requirement not fulfilled");
        this.couponCode = "";
      }
    }
  },
  mounted() {
    if (this.savedAddress) {
      const district = districts.find(
        dis => dis.name === this.savedAddress.district
      );
      this.district = district.id;
      this.address = JSON.parse(JSON.stringify(this.savedAddress));
    }
  },
  methods: {
    ...mapMutations(["SHOW_ALERT"]),
    ...mapMutations("cart", ["DUMP_CART"]),
    async getCoupon() {
      try {
        const coupon = await this.$axios.$get("/coupons/" + this.couponCode);
        if (coupon.minimum_order > this.cartTotal) {
          return this.SHOW_ALERT("Minimum order requirement not fulfilled.");
        }
        this.coupon = coupon;
        this.SHOW_ALERT("Coupon Applied");
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    async placeOrder() {
      this.placing_order = true;
      try {
        const cart = this.cartItems.map(item => ({
          product: item.product.id,
          quantity: item.quantity
        }));
        if (!cart.length) {
          return this.SHOW_ALERT("Cart cannot be empty");
        }
        const isSubdist = this.subDistricts.find(
          item => item.name === this.address.sub_district
        );
        if (!isSubdist) {
          this.address.sub_district = "";
        }

        const obj = {
          cart,
          address: this.address,
          trx_id: this.order.trx_id,
          cash_on_delivery: this.order.cash_on_delivery,
          payment_method: this.order.option
        };

        const order = await this.$axios.$post("/orders", obj);
        this.DUMP_CART();
        this.$router.push({ name: "thank-you", params: { order: order.id } });
      } catch (error) {
        //
      } finally {
        this.placing_order = false;
      }
    }
  }
};
</script>
<style>
.coupon-input {
  max-width: 350px !important;
}
.doc-table tr td:last-of-type {
  text-align: right;
}
@media (max-width: 600px) {
  .orderbtn {
    width: 100%;
  }
}
</style>
