/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateParents
// ====================================================

export interface CreateParents_createParents {
  __typename: "Parent";
  id: string;
  text: string;
}

export interface CreateParents {
  createParents: (CreateParents_createParents | null)[] | null;
}

export interface CreateParentsVariables {
  input: ParentInput[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListParents
// ====================================================

export interface ListParents_listParents {
  __typename: "Parent";
  id: string;
  text: string;
}

export interface ListParents {
  listParents: (ListParents_listParents | null)[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ParentFragment
// ====================================================

export interface ParentFragment {
  __typename: "Parent";
  id: string;
  text: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface ParentInput {
  text: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
