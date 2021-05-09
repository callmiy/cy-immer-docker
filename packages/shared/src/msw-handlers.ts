import { ApolloError } from "@apollo/client/core";
import { graphql } from "msw";
import { CreateParents, ListParents } from "./client.qgl-gen";

const { query, mutation } = graphql;

export function createParentsMswGql(data: CreateParents | ApolloError) {
  return execGraphqlOperation(mutation, "CreateParents", data);
}

export function listParentsMswGql(data: ListParents | ApolloError) {
  return execGraphqlOperation(query, "ListParents", data);
}

function execGraphqlOperation<TData>(
  operationFunc: Query | Mutation,
  operationName: string,
  data: TData
) {
  return operationFunc(operationName, (_req, res, ctx) => {
    if (data instanceof ApolloError) {
      const { graphQLErrors, networkError } = data;

      if (graphQLErrors) {
        return res.once(ctx.errors(graphQLErrors));
      }

      if (networkError) {
        return res.networkError(networkError.message);
      }
    }

    return res.once(ctx.data(data));
  });
}

type Query = typeof query;
type Mutation = typeof mutation;
