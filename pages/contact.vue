<template>
  <v-container>
    <v-toolbar flat color="transparent">
      <v-toolbar-title>
        Contact us
      </v-toolbar-title>
    </v-toolbar>
    <v-divider />

    <v-row class="mt-5">
      <v-col cols="12">
        <p>
          <v-icon left>
            mdi-bullhorn-outline
          </v-icon>
          We will get back to you ASAP.
        </p>
        <v-form id="contact-form" ref="contactForm" @submit.prevent="sendMail">
          <v-text-field
            v-model="message.email"
            name="email"
            class="mt-3"
            :rules="[v => !!v || 'Email is required']"
            validate-on-blur
            type="email"
            label="Email"
            outlined
          />
          <v-select
            v-model="message.topic"
            name="topic"
            class="mt-3"
            :rules="[v => !!v || 'Field is required']"
            validate-on-blur
            :items="topics"
            outlined
            label="Select topic"
          />
          <v-textarea
            v-model="message.body"
            name="body"
            class="mt-3"
            validate-on-blur
            :rules="[
              v =>
                v.length > 32 ||
                'Please express your concerns more elaborately.'
            ]"
            label="Message body"
            outlined
          />
          <v-btn :loading="loading" text class="accent" type="submit" large>
            Submit
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import emailjs from "emailjs-com";
export default {
  name: "Contact",
  data: () => ({
    loading: false,
    message: {
      email: "",
      topic: null,
      body: ""
    },
    tokens: {
      serviceId: "service_5zf9bnr",
      templateId: "template_0qxgtx6",
      userId: "user_6cT6wQFzaSFL0PM9i2612",
      formId: "#contact-form"
    },
    topics: [
      "Products",
      "Order",
      "User Account",
      "Delivery",
      "Refund",
      "Warrenty Issue",
      "Others"
    ]
  }),

  head() {
    return {
      title: "Contact"
    };
  },
  methods: {
    async sendMail() {
      if (!this.$refs.contactForm?.validate()) {
        return;
      }
      try {
        this.loading = true;
        // eslint-disable-next-line
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!regex.test(this.message.email)) {
          return this.$store.commit("SHOW_ALERT", "Email is invalid");
        }
        const { serviceId, templateId, formId, userId } = this.tokens;
        await emailjs.sendForm(serviceId, templateId, formId, userId);

        this.$store.commit(
          "SHOW_ALERT",
          "Your message was received. We will mail you soon!"
        );
        this.$refs.contactForm?.reset();
      } catch (error) {
        this.$store.commit("SHOW_ALERT", "Something went wrong on our end");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
