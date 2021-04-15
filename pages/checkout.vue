<template>
  <v-container class="mt-4">
    <h1 class="display-2">Checkout</h1>
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
                    label="Full Name"
                    filled
                  ></v-text-field>
                </v-col>
                <v-col class="py-1" cols="12">
                  <v-text-field
                    v-model="address.phone"
                    label="Phone Number"
                    filled
                  ></v-text-field>
                </v-col>
                <v-col class="py-1" cols="6">
                  <v-autocomplete
                    v-model="district_id"
                    :items="addressbook.districts"
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
                <v-col class="py-1" cols="6">
                  <v-select
                    v-model="payment.method"
                    :items="methods"
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
                    label="Account No."
                    hint="sender phone number"
                    filled
                  >
                  </v-text-field>
                </v-col>
                <v-col class="py-1" cols="12">
                  <v-text-field
                    v-model="payment.transaction_id"
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
      }
    };
  },
  computed: {
    ...mapGetters("cart", ["cartTotal", "cart"]),
    addressbook() {
      return addressbook;
    },
    subdistricts() {
      return this.addressbook.sub_districts.filter(
        dis => dis.district_id === this.district_id
      );
    }
  },
  watch: {
    district_id(val) {
      const district = this.addressbook.districts.find(dis => dis.id === val);
      this.address.district = district.name;
    }
  }
};
</script>
