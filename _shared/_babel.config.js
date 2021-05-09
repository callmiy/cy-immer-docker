module.exports = (api) => {
  // if you don't do this, babel will complain about caching
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current",
          },
        },
      ],
      "@babel/preset-typescript",
    ],
  };
};
