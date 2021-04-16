<template>
  <v-container class="mt-4">
    <h1 class="display-2 mb-3">Checkout</h1>
    <v-row>
      <v-col cols="12" md="8" order-md="1" order="2">
        <v-card elevation="0">
          <v-card-title>
            Shipping address
          </v-card-title>
          <v-card-text>
            <v-form ref="addressForm">
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
                    :items="addressbook.districts"
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
                  <td>{{ delivery_Charge }}BDT</td>
                </tr>
                <tr>
                  <th>Discount({{ coupon }}):</th>
                  <td>-{{ 0 }}BDT</td>
                </tr>
                <tr>
                  <th>Total:</th>
                  <td>{{ cartTotal + delivery_Charge }}BDT</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-text-field
              v-model="coupon"
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
              color="accent"
              class="black--text"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" order-md="3" order="3">
        <v-card elevation="0">
          <v-card-title>
            Payment
          </v-card-title>
          <v-card-text>
            <v-form ref="paymentForm">
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
        <v-btn elevation="0" large color="accent" class="black--text">
          Place Order
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import addressbook from "~/assets/addressbook.json";
export default {
  name: "Checkout",
  data() {
    return {
      district_id: "",
      coupon: "",
      discount: null,
      delivery_Charge: 120,
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
    ...mapGetters("cart", ["cartTotal", "cart"]),
    addressbook() {
      return addressbook;
    },
    subdistricts() {
      return this.addressbook.sub_districts.filter(
        dis => dis.district_id === this.district_id
      );
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  watch: {
    district_id(val) {
      const district = this.addressbook.districts.find(dis => dis.id === val);
      this.address.district = district?.name;
    }
  },
  methods: {}
};
</script>
