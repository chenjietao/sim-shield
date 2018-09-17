module.exports = {
  devServer: {
    proxy: {
      "/demo": {
        target: "http://11.11.11.125:8080",
        changeOrigin: true
      }
    }
  }
};
