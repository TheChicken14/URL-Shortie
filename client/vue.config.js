module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    host: "localhost",
    hot: true,
    port: 8080,
    proxy: "http://localhost:8888/"
  }
}