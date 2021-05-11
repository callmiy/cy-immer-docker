const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");

// monorepo packages that this project depends on
const sharedPackagePath = path.join(__dirname, "../shared");

module.exports = {
  jest: {
    // Any Jest configuration options: https://jestjs.io/docs/en/configuration.
    configure: {
      collectCoverageFrom: [
        "src/**/*.ts*",
        "!src/__tests__/**",
        "!src/register-service-worker.*",
        "!src/react-app-env.d.ts",
      ],
      displayName: "cra",
      watchPathIgnorePatterns: [
        "<rootDir>/node_modules*",
        "<rootDir>/package*",
        "<rootDir>/build/",
        "<rootDir>/craco.config.js",
        "<rootDir>/coverage/",
        "<rootDir>/public/",
        "<rootDir>/src/index.tsx",
      ],
      roots: ["<rootDir>", "<rootDir>/../shared/src/"],
    },
  },
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat[sharedPackagePath];
      }
      return webpackConfig;
    },
  },
};
