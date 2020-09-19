<template>
  <v-app>
    <v-app-bar app color="primary" dark clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center" style="margin-right: 1rem;">
        <h1>URL-Shortie</h1>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      :mobile-breakpoint="600"
      app
      :expand-on-hover="$vuetify.breakpoint.smAndUp"
      :mini-variant="$vuetify.breakpoint.smAndUp"
      clipped
      v-model="drawer"
    >
      <v-list nav dense shaped>
        <v-list-item v-for="item in filteredNavigation" :key="item.title" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2" v-if="loggedIn">
          <v-btn block dark @click="login()">Log out</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main v-if="loading">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4" style="text-align: center;">
          <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
        </v-col>
      </v-row>
    </v-main>

    <v-main v-else>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "App",

  data: () => ({
    drawer: false,
    navigation: [
      { title: "Home", icon: "mdi-home", to: "/" },
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/dashboard",
        login: true,
      },
      {
        title: "Account",
        icon: "mdi-account-box",
        to: "/account",
        login: true,
      },
      {
        title: "Log in",
        icon: "mdi-account-key",
        to: "/login",
        loggedOut: true,
      },
      //{ title: "Admin", icon: "mdi-gavel" },
    ],
  }),
  mounted() {
    this.$store.dispatch("checkToken");
    this.drawer = this.$vuetify.breakpoint.smAndUp;
  },
  methods: {
    logout() {
      axios.post("/api/user/logout").then(() => {
        this.$store.commit("SET_LOGGEDIN", false);
        this.$router.push("/login");
      });
    },
    login() {
      if (this.$route.path !== "/login") {
        this.$router.push("/login");
      }
    },
  },
  computed: {
    loading() {
      return this.$store.state.loadingLoggedInStatus;
    },
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    filteredNavigation() {
      if (this.loggedIn) {
        return this.navigation.filter((n) => !n.loggedOut);
      } else {
        return this.navigation.filter((n) => !n.login);
      }
    },
  },
};
</script>
