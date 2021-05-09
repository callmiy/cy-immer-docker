import { graphql, SetupWorkerApi } from "msw";
import { ApolloClient } from "@apollo/client";

declare global {
  interface Window {
    ____im: ImmGlobals;
    Cypress: typeof Cypress;
  }
}
export type ImmGlobals = {
  logReducers?: boolean;
  logApolloQueries?: boolean;
  client: ApolloClient<Any>;
  mswBrowserWorker?: MswSetupWorkerApi;
  mswGraphql?: MswGraphql;
};

export type MswSetupWorkerApi = SetupWorkerApi;
export type MswGraphql = typeof graphql;

export type VoidFn = () => void;

export type Any = Record<string, unknow>;
