<template>
  <v-row justify="center">
    <v-col class="mb-4">
      <v-card class="mx-auto homeCard" max-width="344">
        <h1>URL-Shortie</h1>
        <h2>A simple URL shortener!</h2>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.homeCard {
  padding: 1rem;
  text-align: center;
}
</style>