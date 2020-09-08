<template>
  <v-sheet>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Log in to URL-Shortie</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit="submit" :disabled="loading">
                  <v-text-field
                    outlined
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="email"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" :loading="loading" type="submit">Login</v-btn>
                </v-form>
              </v-card-text>
              <v-card-actions></v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-sheet>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    email: "",
    password: "",
    loading: false,
  }),
  methods: {
    submit(e) {
      e.preventDefault();
      this.loading = true;
      axios
        .post("/api/user/authenticate", {
          email: this.email,
          password: this.password,
        })
        .then(() => this.$router.push("/dashboard"))
        .catch(() => (this.errored = true))
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped>
.loginPage {
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>