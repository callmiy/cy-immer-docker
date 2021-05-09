module.exports = (api) => {
  const envs = process.env;
  const isTest = envs.NODE_ENV === "test";
  const isProd = envs.NODE_ENV === "production";
  // if you don't do this, babel will complain about caching in development
  api.cache(!isTest);

  const plugins = [];

  if (isProd) {
    plugins.push([
      "module-resolver",
      {
        alias: {
          "@im/sh": ".",
        },
      },
    ]);
  }

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
    plugins,
  };
};
