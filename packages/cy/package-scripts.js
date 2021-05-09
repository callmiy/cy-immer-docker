const { scripts } = require("../../_shared/_package-scripts");

const env = process.env;
const { BACKEND_SERVER_URL = "", API_URL = "", WEB_URL = "" } = env;
const browser = env.CYPRESS_BROWSER;
const cypressBrowser = browser ? ` --browser ${browser}` : "";
// we set $PORT to empty so cypress can auto select a port
const cypressPreEnv = `PORT= CYPRESS_BASE_URL=${WEB_URL}`;
const cypressPostEnv = `--env API_URL=${API_URL},BACKEND_SERVER_URL=${BACKEND_SERVER_URL}`;
const cypressPostEnvOpen = `${cypressPostEnv} ${cypressBrowser}`;

module.exports = {
  scripts: {
    ...scripts,
    default: {
      script: `${cypressPreEnv} \
        cypress open \
        ${cypressPostEnvOpen}
      `,
      description: `e2e test with javascript app in dev mode`,
    },
  },
};
