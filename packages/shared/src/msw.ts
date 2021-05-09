import { ImmGlobals, MswSetupWorkerApi, MswGraphql } from "./globals";

export function setUpMsw(immGlobals: ImmGlobals) {
  let mswBrowserWorker: MswSetupWorkerApi;

  let mswGraphql: MswGraphql;

  if (!immGlobals.mswBrowserWorker) {
    const msw = require("./msw-browser");

    mswBrowserWorker = msw.mswBrowserWorker;
    mswGraphql = msw.mswGraphql;

    immGlobals.mswBrowserWorker = mswBrowserWorker;
    immGlobals.mswGraphql = mswGraphql;
  }

  return immGlobals;
}
