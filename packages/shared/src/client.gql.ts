import { gql } from "@apollo/client/core";

const PARENT_FRAGMENT = gql`
  fragment ParentFragment on Parent {
    id
    text
  }
`;
export const CREATE_PARENTS_GQL = gql`
  mutation CreateParents($input: [ParentInput!]!) {
    createParents(input: $input) {
      ...ParentFragment
    }
  }

  ${PARENT_FRAGMENT}
`;

export const LIST_PARENTS = gql`
  query ListParents {
    listParents {
      ...ParentFragment
    }
  }
  ${PARENT_FRAGMENT}
`;
