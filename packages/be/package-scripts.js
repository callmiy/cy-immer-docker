const { resolve: resolvePath } = require("path");
const { scripts } = require("../../_shared/_package-scripts");

const babelConfig = resolvePath(__dirname, "../../_shared/_babel.config.js");

module.exports = {
  scripts: {
    ...scripts,
    default: {
      script: `nodemon \
        --verbose \
        --delay 300ms \
        --signal SIGINT \
        --ext js,gql \
        --watch ./src \
        --watch ../shared/src \
        --exec \
        babel-node \
          --extensions .ts,.js \
          --only ./src/**,../shared/src/** \
          --config-file ${babelConfig} ./src/app.ts
      `,
      description: `start express server`,
    },
  },
};
