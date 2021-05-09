const { scripts } = require("../../_shared/_package-scripts");

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
          --root-mode upward \
          --extensions '.ts,.js' \
          --only ./src/**,../shared/src/** \
          ./src/app.ts
      `,
      description: `start express server in development mode`,
    },
    b: {
      script: `rm -rf ./build && \
        NODE_ENV=production \
        DEV_ENV=production \
          babel \
          src \
          --root-mode upward \
          --minified \
          --extensions '.js,.ts' \
          --out-dir ./build
      `,
    },
    s: {
      script: `NODE_ENV=production node ./build/app.js`,
    },
    e: "NODE_ENV=production tsc --project .",
  },
};
