const env = process.env;

export function getDataFile() {
  if (hasCypress()) {
    return window.Cypress.env("DATA_FILE") as string;
  }

  return process.env.DATA_FILE as string;
}

export function getApiUrl() {
  // if called by REACT, ensure to return the env set by react
  return (env.REACT_APP_API_URL || env.API_URL) as string;
}

function hasCypress() {
  return "undefined" !== typeof window && !!window.Cypress;
}

export const { PORT, NODE_ENV } = env;
