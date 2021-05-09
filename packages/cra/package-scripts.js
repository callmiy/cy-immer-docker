const { scripts } = require("../../_shared/_package-scripts");

const env = process.env;
const apiUrl = env.API_URL || "";

const devEnvs = `
  DISABLE_ESLINT_PLUGIN=true \
  SKIP_PREFLIGHT_CHECK=true \
  BROWSER=none \
  REACT_APP_API_URL=${apiUrl} \
  `;

const reactScript = "craco";
// const reactScript = 'react-scripts'

module.exports = {
  scripts: {
    ...scripts,
    default: {
      script: `${devEnvs} ${reactScript} start`,
    },
    b: `${reactScript} build`,
    t: {
      default: {
        script: `${reactScript} test`,
      },
    },
  },
  eject: `${reactScript} eject`,
};
