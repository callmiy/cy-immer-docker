const { scripts } = require("../../_shared/_package-scripts");

// babel --copy-files and --ignore options do not work together, so we delete
// unwanted files manually
const ignored = ["__tests__", "*.d.js", "msw*", "*.gen.js"]
  .map((p) => `./build/${p}`)
  .join(" ");

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
        babel \
          src \
          ../shared/src \
          --root-mode upward \
          --minified \
          --copy-files \
          --extensions '.js,.ts' \
          --out-dir ./build && \
        rm -rf ${ignored}
      `,
      description: `build app for production with babel`,
    },
    s: {
      script: `NODE_ENV=production node ./build/app.js`,
      description: `serve app in production`,
    },
  },
};
