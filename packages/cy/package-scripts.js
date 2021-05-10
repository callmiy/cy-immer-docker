const { scripts } = require("../../_shared/_package-scripts");

module.exports = {
  scripts: {
    ...scripts,
    default: {
      script: `cypress open`,
      description: `e2e test - non headless browser`,
    },
    r: {
      script: `cypress run`,
      description: `e2e test - headless browser`,
    },
  },
};
