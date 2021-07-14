<template>
  <v-card id="reviews">
    <v-card-title class="text-headline font-weight-medium">
      Product Reviews
    </v-card-title>
    <v-card-text>
      <v-skeleton-loader v-show="loading" type="article" />
      <p v-show="!reviews.length && !loading" class="text-center">
        no reviews found
      </p>
      <v-row v-for="review in reviews" :key="review.id" style="max-width:900px">
        <v-col cols="12" md="4" lg="3" class="px-0 px-md-3 pb-0 pb-md-3 pt-0">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-1 font-weight-bold">
                {{ review.user_name }}
              </v-list-item-title>
              <v-list-item-subtitle class="body-2 primary--text">
                {{ (review.createdAt || review.created_at) | formatDate }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <v-rating
                  readonly
                  :value="review.rating"
                  size="18"
                  dense
                  color="accent"
                />
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="12" md="8" lg="9" class="pt-0 pt-md-3 pb-4 pb-md-3">
          {{ review.message }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ReviewsCard",
  filters: {
    formatDate(val) {
      return new Date(val).toLocaleDateString();
    }
  },
  props: {
    reviews: { type: Array, default: () => [] },
    loading: Boolean
  }
};
</script>

<style></style>
