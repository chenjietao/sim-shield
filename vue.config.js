const baseUrl =
  process.env.NODE_ENV === "production" ? "/demo/simShield/" : "/";
module.exports = {
  baseUrl,
  devServer: {
    proxy: {
      "/demo": {
        target: "http://11.11.11.125:8080",
        changeOrigin: true
      }
    }
  }
};
