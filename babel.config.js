module.exports = {
  plugins: [
    [
      "import",
      {
        libraryName: "muse-ui",
        libraryDirectory: "lib",
        camel2DashComponentName: false
      }
    ]
  ],
  presets: ["@vue/app"]
};
