import { onError } from "@apollo/client/link/error";
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from "@apollo/client";
import { ImmGlobals } from "./globals";
import { getApiUrl } from "./env";

export function getClient(
  args: { immGlobals?: ImmGlobals; testing?: boolean } = {}
) {
  const { immGlobals, testing } = args;
  const globals = immGlobals || ({} as ImmGlobals);

  if (globals.client) {
    return globals;
  }

  let link: ApolloLink;
  let uri = "";

  if (testing) {
    uri = "http://localhost:4000";
    link = createHttpLink({
      uri,
    });
  } else {
    uri = getApiUrl();
    link = createHttpLink({
      uri,
    });
  }

  link = middlewareErrorLink(link);
  link = middlewareLoggerLink(link);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  globals.client = client;
  window.____im = globals;

  return globals;
}

function middlewareLoggerLink(link: ApolloLink) {
  return new ApolloLink((operation, forward) => {
    if (!forward) {
      return null;
    }

    const fop = forward(operation);
    const {
      ____im: { logApolloQueries },
    } = window;

    if (!logApolloQueries) {
      return fop;
    }

    const operationName = `Apollo operation: ${operation.operationName}`;

    console.log(
      "\n\n\n",
      getNow(),
      `\n\n====${operationName}===\n\n`,
      `======QUERY=====\n\n`,
      operation.query.loc ? operation.query.loc.source.body : "",
      `\n\n======VARIABLES======\n\n`,
      JSON.stringify(operation.variables, null, 2),
      `\n\n===End ${operationName}====\n\n`
    );

    if (fop.map) {
      return fop.map((response) => {
        console.log(
          "\n\n\n",
          getNow(),
          `\n=Received response from ${operationName}=\n\n`,
          JSON.stringify(response, null, 2),
          `\n\n=End Received response from ${operationName}=\n\n`
        );

        return response;
      });
    }

    return fop;
  }).concat(link);
}

function middlewareErrorLink(link: ApolloLink) {
  return onError(({ graphQLErrors, networkError, response, operation }) => {
    const {
      ____im: { logApolloQueries },
    } = window;

    if (!logApolloQueries) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    const logError = (errorName: string, obj: object) => {
      const operationName = `Response [${errorName} error] from Apollo operation: ${operation.operationName}`;

      console.error(
        "\n\n\n",
        getNow(),
        `\n=${operationName}=\n\n`,
        obj,
        `\n\n=End Response ${operationName}=`
      );
    };

    if (graphQLErrors) {
      logError("graphQLErrors", graphQLErrors);
    }

    if (response) {
      logError("", response);
    }

    if (networkError) {
      logError("Network", networkError);
    }
  }).concat(link);
}

function getNow() {
  const n = new Date();
  return `${n.getHours()}:${n.getMinutes()}:${n.getSeconds()}:${n.getMilliseconds()}`;
}
