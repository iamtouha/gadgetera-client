<template>
  <v-container class="mt-4">
    <v-dialog v-model="saveAddressDialog" max-width="350px">
      <v-card>
        <v-card-title>
          Save address?
        </v-card-title>
        <v-card-text>
          Do you want to save this address for future purchases?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="placeOrder">no thanks</v-btn>
          <v-btn
            elevation="0"
            color="accent"
            class="black--text"
            @click="placeOrder(true)"
            >Okay</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h1 class="display-2 mb-3">Checkout</h1>
    <v-row>
      <v-col cols="12" md="8" order-md="1" order="2">
        <v-card elevation="0">
          <v-card-title>
            Shipping address
          </v-card-title>
          <v-card-text>
            <!-- shipping address form -->
            <v-form ref="addressForm" lazy-validation>
              <v-row>
                <v-col class="py-1" cols="12">
                  <v-text-field
                    v-model="address.receiver"
                    :rules="[rules.min5]"
                    :dense="isMobile"
                    label="Receiver Name"
                    filled
                  ></v-text-field>
                </v-col>
                <v-col class="py-1" cols="12">
                  <v-text-field
                    v-model="address.phone"
                    :rules="[rules.min11, rules.max17, rules.phone]"
                    :dense="isMobile"
                    label="Phone Number"
                    filled
                  ></v-text-field>
                </v-col>
                <v-col class="py-1" cols="6">
                  <v-autocomplete
                    v-model="district_id"
                    :items="districts"
                    :rules="[rules.required]"
                    :dense="isMobile"
                    item-text="name"
                    item-value="id"
                    label="District"
                    filled
                  >
                  </v-autocomplete>
                </v-col>
                <v-col class="py-1" cols="6">
                  <v-autocomplete
                    v-model="address.sub_district"
                    :items="subdistricts"
                    :rules="[rules.required]"
                    :dense="isMobile"
                    no-data-text="Select a district"
                    item-text="name"
                    item-value="name"
                    label="Sub District"
                    filled
                  >
                  </v-autocomplete>
                </v-col>
                <v-col class="py-1" cols="12">
                  <v-textarea
                    v-model="address.street_address"
                    rows="3"
                    :dense="isMobile"
                    :rules="[rules.required]"
                    label="Street Address"
                    filled
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" order-md="2" order="1">
        <v-card elevation="0">
          <v-card-title>Order Summary</v-card-title>
          <v-card-text>
            <v-simple-table class="text-right">
              <tbody>
                <tr>
                  <th>Cart Total:</th>
                  <td>{{ cartTotal }}BDT</td>
                </tr>
                <tr>
                  <th>Delivery Charge:</th>
                  <td>{{ delivery_charge }}BDT</td>
                </tr>
                <tr v-if="discount">
                  <th>Discount({{ discount.code }}):</th>
                  <td>-{{ discount.discount }}BDT</td>
                </tr>
                <tr>
                  <th>Total:</th>
                  <td>
                    {{
                      cartTotal +
                        delivery_charge -
                        (discount ? discount.discount : 0)
                    }}
                    BDT
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-text-field
              v-model="coupon"
              :disabled="Boolean(discount)"
              dense
              hide-details
              outlined
              single-line
              placeholder="Discount Coupon"
              style="border-radius: 4px 0 0 4px;max-width:300px;"
            >
            </v-text-field>
            <v-btn
              height="40px"
              elevation="0"
              style="border-radius:0 4px 4px 0"
              tile
              :loading="discountLoading"
              color="accent"
              class="black--text"
              @click="applyDiscount"
            >
              <v-icon v-if="discount">mdi-close</v-icon>
              <v-icon v-else>mdi-plus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" order-md="3" order="3">
        <!-- payment form -->
        <v-card elevation="0">
          <v-card-title>
            Payment
          </v-card-title>
          <v-card-text>
            <v-form ref="paymentForm" lazy-validation>
              <v-row>
                <v-col class="py-1" cols="12" sm="6">
                  <v-select
                    v-model="payment.method"
                    :items="methods"
                    :rules="[rules.required]"
                    :dense="isMobile"
                    item-text="value"
                    item-value="key"
                    label="Payment Method"
                    filled
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-1" cols="12">
                  <v-text-field
                    v-model="payment.account_no"
                    :rules="[rules.min11, rules.max17]"
                    :dense="isMobile"
                    type="number"
                    label="Account No."
                    hint="sender phone number"
                    filled
                  >
                  </v-text-field>
                </v-col>
                <v-col class="py-1" cols="12">
                  <v-text-field
                    v-model="payment.transaction_id"
                    :rules="[rules.min5]"
                    :dense="isMobile"
                    label="Transaction ID"
                    filled
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="text-center" cols="12" order="4">
        <v-btn
          elevation="0"
          large
          color="accent"
          class="black--text"
          :loading="loading"
          @click="saveAddress"
        >
          Place Order
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import isEqual from "lodash.isequal";
import { mapGetters } from "vuex";
import addressbook from "~/assets/addressbook.json";

const lowCostAreas = ["47"];

export default {
  name: "Checkout",
  middleware: "no_cart_item",
  data() {
    return {
      loading: false,
      discountLoading: false,
      saveAddressDialog: false,
      district_id: "",
      coupon: "",
      delivery_charge: 120,
      methods: [
        { key: "bkash", value: "bKash" },
        { key: "nagad", value: "Nagad" },
        { key: "rocket", value: "Rocket" }
      ],
      address: {
        receiver: "",
        phone: "",
        district: "",
        sub_district: "",
        street_address: ""
      },
      payment: {
        method: "",
        account_no: "",
        transaction_id: ""
      },
      rules: {
        required: v => !!v?.trim() || "Field is Required",
        min5: v => v.trim().length >= 5 || "Too short",
        min11: v => v.trim().length >= 11 || "Minimum 11 characters required",
        max17: v => v.trim().length <= 17 || "Too long number",
        phone: v => {
          const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
          return re.test(v) || "Invalid phone number";
        }
      }
    };
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters("cart", ["cartTotal", "cart", "discount"]),
    isEqual() {
      return isEqual(this.user?.address, this.address);
    },
    districts() {
      return addressbook.districts;
    },
    subdistricts() {
      return addressbook.sub_districts.filter(
        dis => dis.district_id === this.district_id
      );
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  watch: {
    district_id(val) {
      switch (lowCostAreas.includes(val)) {
        case true:
          this.delivery_charge = 60;
          break;

        default:
          this.delivery_charge = 120;
          break;
      }
      const district = this.districts.find(dis => dis.id === val);
      this.address.district = district?.name;
    },
    "user.address": {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && typeof val !== "string") {
          this.district_id = this.districts.find(
            dst => dst.name === val.district
          )?.id;
          this.address = JSON.parse(JSON.stringify(val));
        }
      }
    }
  },
  created() {
    if (this.discount) {
      this.coupon = this.discount.code;
    }
    this.$store.dispatch("findAddress");
  },
  methods: {
    applyDiscount() {
      // if discount is available, clear it and stop
      if (this.discount) {
        this.$store.commit("cart/addDiscount", null);
        return (this.coupon = "");
      }
      if (!this.coupon) return;
      // apply for cupon verification
      this.discountLoading = true;
      this.$axios
        .$get(`/coupons/${this.coupon}?order=${this.cartTotal}`)
        .then(coupon => {
          this.$store.commit("cart/addDiscount", coupon);
          this.$store.commit("showAlert", "Coupon Applied");
        })
        .catch(err => console.log(err.message))
        .finally(() => (this.discountLoading = false));
    },
    async placeOrder(saveAddress) {
      this.saveAddressDialog = false;

      // verify inputs

      if (!this.cart.length)
        return this.$store.commit("showAlert", "Add products to cart");
      this.loading = true;
      try {
        const order = {
          saveAddress,
          address: this.address,
          payment: this.payment,
          delivery_charge: this.delivery_charge,
          coupon: this.discount ? this.discount.id : null,
          total:
            this.cartTotal +
            this.delivery_charge -
            (this.discount ? this.discount.discount : 0),
          cart: this.cart.map(item => ({
            product: item.product.id,
            variant: item.variant.id,
            quantity: parseInt(item.quantity)
          }))
        };

        await this.$axios.$post("/orders", order);
        this.$store.commit("showAlert", "Order placed successfully");

        this.moveNext();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    moveNext() {
      this.saveAddressDialog = false;
      this.$store.commit("cart/addDiscount", null);
      this.$store.commit("cart/discardCart");
      this.$router.push("/");
    },
    saveAddress() {
      const valid =
        this.$refs.addressForm?.validate() &&
        this.$refs.paymentForm?.validate();
      if (!valid) return;

      if (this.user && !isEqual(this.user?.address, this.address)) {
        return (this.saveAddressDialog = true);
      }
      this.placeOrder();
    }
  }
};
</script>
