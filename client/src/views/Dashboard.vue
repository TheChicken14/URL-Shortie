<template>
  <v-sheet>
    <v-container style="max-width: 1000px;">
      <v-form @submit="shortenLink" v-model="valid" lazy-validation ref="form">
        <v-row justify="center">
          <v-col sm="6" xs="12">
            <v-text-field
              label="Enter the URL"
              :disabled="shortening"
              type="url"
              v-model="url"
              :rules="rules.url"
            ></v-text-field>
          </v-col>
          <v-col sm="4" xs="10">
            <v-text-field label="Custom short URL" v-model="customURLCode" :disabled="shortening"></v-text-field>
          </v-col>
          <v-col sm="2" xs="2">
            <v-btn color="primary" type="submit">
              <span>Shorten!</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <div v-if="loading">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4" style="text-align: center;">
            <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
          </v-col>
        </v-row>
      </div>
      <v-data-table
        v-if="showTable"
        :headers="headers"
        :items="links"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.longUrl="{ item }">
          <a :href="'/' + item.shortCode">{{ item.title }}</a>
          <div class="text-caption">{{ item.longUrl }}</div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="deleteLink(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
      <v-card v-if="showNoLinks">
        <v-card-title>No links yet!</v-card-title>
      </v-card>
    </v-container>
    <v-snackbar
      v-model="snackbar.open"
      :timeout="snackbar.timeout"
      :color="snackbar.error ? 'error' : 'success'"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.open = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-sheet>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    url: "",
    valid: true,
    customURLCode: "",
    shortening: false,
    headers: [
      {
        text: "Short URL",
        align: "start",
        value: "shortCode",
      },
      { text: "Original URL", value: "longUrl" },
      { text: "Clicks", value: "clickCount" },
      { text: "Actions", value: "actions", sortable: false },
      //{ text: "", value: "data-table-expand" },
    ],
    rules: {
      url: [(v) => !!v || "URL is required"],
    },
    snackbar: {
      error: false,
      message: "",
      open: false,
      timeout: 2000,
    },
  }),
  mounted() {
    this.$store.dispatch("getLinks");
  },
  methods: {
    shortenLink(v) {
      v.preventDefault();
      if (!this.$refs.form.validate()) return;
      this.shortening = true;
      const dataToSubmit =
        this.customURLCode.length > 2
          ? {
              url: this.url,
              id: this.customURLCode,
            }
          : {
              url: this.url,
            };
      axios
        .post("/api/links/create", dataToSubmit)
        .then(() =>
          this.openSnackbar({
            message: "Successfully added link!",
            error: false,
          })
        )
        .catch((e) => {
          if (e.response && e.response.data) {
            this.openSnackbar({
              message: e.response.data.error,
              error: true,
            });
          } else {
            this.openSnackbar({
              message: "An error occurred!",
              error: true,
            });
          }
        })
        .finally(() => {
          this.$store.dispatch("getLinks");
          this.shortening = false;
          this.$refs.form.reset();
        });
    },
    deleteLink(item) {
      // Using fetch because axios wont let me send a body with the delete method
      axios
        .delete(`/api/links/delete/?id=${item.shortCode}`)
        .then(() => this.$store.dispatch("getLinks"));
    },
    openSnackbar({ message, error = false }) {
      this.snackbar = {
        error: error,
        message,
        open: true,
        timeout: 2000,
      };
    },
  },
  computed: {
    loading() {
      return this.$store.state.loadingLinks;
    },
    links() {
      return this.$store.getters.sortedLinks;
    },
    showTable() {
      return !this.loading && this.$store.state.links.length > 0;
    },
    showNoLinks() {
      return !this.loading && this.$store.state.links.length == 0;
    },
  },
};
</script>