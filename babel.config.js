module.exports = (api) => {
  const isTest = process.env.NODE_ENV === "test";
  // if you don't do this, babel will complain about caching in development
  api.cache(!isTest);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            // node: "current",
            node: 4,
          },
        },
      ],
      "@babel/preset-typescript",
    ],
  };
};
