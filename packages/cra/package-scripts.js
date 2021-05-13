const { scripts } = require("../../_shared/_package-scripts");

const envs = process.env;
const { API_URL = "" } = envs;

const devEnvs = `
  SKIP_PREFLIGHT_CHECK=true \
  BROWSER=none \
  REACT_APP_API_URL=${API_URL} \
  `;
const productionEnvs = `
  REACT_APP_API_URL=${API_URL} \
  NODE_ENV=production \
`;

const reactScript = "craco";
// const reactScript = 'react-scripts'
const testScript = "NODE_ENV=test jest --runInBand ";

module.exports = {
  scripts: {
    ...scripts,
    default: {
      script: `${devEnvs} ${reactScript} start`,
      description: `start development server`,
    },
    b: {
      script: `${productionEnvs} ${reactScript} build`,
      description: `build for production`,
    },
    t: {
      default: {
        script: `${testScript} --watch`,
        description: `run test in watch mode`,
      },
      t: {
        script: `${testScript}`,
        description: `run test in none watch mode`,
      },
    },
    e: `react-scripts eject`,
    n: {
      p: {
        script: `DEBUG=* netlify deploy --dir=./build --prod`,
        description: `netlify deploy to production`,
      },
    },
  },
};
