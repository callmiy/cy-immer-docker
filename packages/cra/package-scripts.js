const { scripts } = require("../../_shared/_package-scripts");

const envs = process.env;
const { API_URL = "" } = envs;

const devEnvs = `
  DISABLE_ESLINT_PLUGIN=true \
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
        script: `${reactScript} test`,
        description: `run test in watch mode`,
      },
    },
    s: {
      default: {
        script: `serve -s build -l 4000`,
        description: `serve built artefact`,
      },
    },
    eject: `${reactScript} eject`,
    // netlify
    n: {
      s: {
        script: `${productionEnvs} ${reactScript} start`,
        description: `serve netlify on local machine`,
      },
      d: {
        default: {
          script: `netlify dev`,
          description: `run netlify development server`,
        },
        l: {
          script: `netlify dev --live`,
          description: `run netlify development server over the internet`,
        },
      },
      b: {
        default: {
          script: `netlify build`,
          description: `build netlify locally`,
        },
        d: {
          script: `netlify build --dry`,
          description: `build netlify locally dry run`,
        },
      },
      p: {
        script: `netlify deploy --dry=./build --prod`,
        description: `netlify deploy to production`,
      },
    },
  },
};
