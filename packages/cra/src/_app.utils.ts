import { CREATE_PARENTS_GQL, LIST_PARENTS } from "@im/sh/src/client.gql";
import {
  CreateParents,
  CreateParentsVariables,
  ListParents,
  ParentFragment,
} from "@im/sh/src/client.qgl-gen";
import {
  GenericEffectDefinition,
  GenericEffectForState,
  GenericHasEffect,
  getGenericEffects,
} from "@im/sh/src/effects";
import { logReducer } from "@im/sh/src/logger";
import {
  DataVal,
  deleteObjectKey,
  ErrorVal,
  InitialVal,
  StateValue,
} from "@im/sh/src/utils";
import immer, { Draft } from "immer";
import { createContext, Dispatch } from "react";

export enum ActionType {
  set_text = "set_text",
  submit = "submit",
  set_parents = "set_parent",

  starting = "loading",
}

export const reducer = logReducer(function (
  prevState: StateMachine,
  action: Action
) {
  const { type, ...payload } = action;

  return immer(prevState, (proxy) => {
    resetStates(proxy);

    switch (type) {
      case ActionType.set_text:
        handleSetText(proxy, payload as InputTextPayload);
        break;

      case ActionType.submit:
        handleSubmit(proxy);
        break;

      case ActionType.set_parents:
        handleSetParents(proxy, payload as SetParentPayload);
        break;

      default:
        throw new Error(`action "${type}" must be accounted for`);
    }
  });
});

export function initState(): StateMachine {
  const state = {
    id: "app",
    effects: {
      value: StateValue.hasEffect,
      effects: [
        {
          functionName: "fetchEffect" as "fetchEffect",
          ownArgs: {},
        },
      ],
    },
    states: {
      value: StateValue.initial,
    },
  };

  return state;
}

function handleSetText(
  proxy: WriteableStateMachine,
  payload: InputTextPayload
) {
  const { states } = proxy;

  // istanbul ignore else:
  if (states.value === StateValue.data) {
    const { text } = payload as InputTextPayload;
    const { parentForm } = states;
    parentForm.text = text;
  }
}

function handleSubmit(proxy: WriteableStateMachine) {
  const { states } = proxy;

  // istanbul ignore else:
  if (states.value === StateValue.data) {
    const { parentForm } = states;
    const trimmedText = parentForm.text.trim();

    if (!trimmedText) {
      parentForm.error = "text: can not be empty";
      return;
    }

    parentForm.error = undefined;
    const effects = getEffects(proxy);

    effects.push({
      functionName: "createParentEffect",
      ownArgs: {
        text: trimmedText,
      },
    });
  }
}

function handleSetParents(
  proxy: WriteableStateMachine,
  payload: SetParentPayload
) {
  const { states } = proxy;
  const dataState = states as DataState;
  const { parents } = payload as SetParentPayload;

  switch (states.value) {
    case StateValue.data:
      states.parents.unshift(...parents);
      dataState.parentForm.text = "";
      break;

    case StateValue.initial:
      dataState.value = StateValue.data;
      dataState.parents = parents;
      dataState.parentForm = {
        text: "",
      };
      break;
  }
}

// ====================================================
// START Effect functions
// ====================================================

const createParentEffect: DefCreateParentEffect["func"] = async (
  { text },
  _props,
  effectArgs
) => {
  const { dispatch } = effectArgs;
  const { client } = window.____im;

  try {
    const result = await client.mutate<CreateParents, CreateParentsVariables>({
      mutation: CREATE_PARENTS_GQL,
      variables: {
        input: [{ text }],
      },
    });
    const validResults = result && result.data && result.data.createParents;

    if (validResults) {
      const [result1] = validResults;

      dispatch({
        type: ActionType.set_parents,
        parents: [result1] as ParentFragment[],
      });
      return;
    }

    // :TODO - else
    console.error("invalid result for create parent");
  } catch (error) {
    console.error(error);
    // :TODO
  }
};

type DefCreateParentEffect = EffectDefinition<
  "createParentEffect",
  { text: string }
>;

const fetchEffect: DefFetchEffect["func"] = async (
  _ownArgs,
  _props,
  effectArgs
) => {
  const { dispatch } = effectArgs;
  const { client } = window.____im;

  try {
    const result = await client.query<ListParents>({
      query: LIST_PARENTS,
    });

    const validResults = result && result.data && result.data.listParents;

    if (validResults) {
      const parents = validResults as ParentFragment[];
      dispatch({
        type: ActionType.set_parents,
        parents,
      });
    }
  } catch (error) {
    // :TODO deal with error
  }
};

type DefFetchEffect = EffectDefinition<"fetchEffect">;

export const effectFunctions = {
  createParentEffect,
  fetchEffect,
};

function getEffects(proxy: StateMachine) {
  return getGenericEffects<EffectObject, StateMachine>(proxy);
}
// ====================================================
// END Effect functions
// ====================================================

function resetStates(proxy: WriteableStateMachine) {
  // any time we call the `reducer`, we must reset the effects by:
  // 1: deleting all previous effects
  // 2: setting the value to `noEffect`
  const { effects } = proxy;
  deleteObjectKey(effects as HasEffects, "effects");
  effects.value = StateValue.noEffect;
}

export const dispatchContext = createContext({} as DispatchContextValue);
export const DispatchProvider = dispatchContext.Provider;

export const stateContext = createContext({} as StateContextValue);
export const StateProvider = stateContext.Provider;

export type Props = {};

type DataState = {
  value: DataVal;
  parentForm: ParentFormState;
  parents: ParentFragment[];
};

type ErrorState = {
  value: ErrorVal;
  error: string;
};

export type StateMachine = GenericEffectForState<EffectObject> & {
  states: { value: InitialVal } | ErrorState | DataState;
};
export type WriteableStateMachine = Draft<StateMachine>;

type EffectObject = DefCreateParentEffect | DefFetchEffect;

type HasEffects = GenericHasEffect<EffectObject>;

type ParentFormState = {
  text: string;
  error?: string;
};

type DispatchType = Dispatch<Action>;

export type DispatchContextValue = {
  dispatch: DispatchType;
};

export type StateContextValue = {
  states: DataState;
};

export type Action =
  | ({
      type: ActionType.set_text;
    } & InputTextPayload)
  | {
      type: ActionType.submit;
      form: FormOwner;
    }
  | ({
      type: ActionType.set_parents;
    } & SetParentPayload)
  | {
      type: ActionType.starting;
    };

export type SetParentPayload = {
  parents: ParentFragment[];
};

export type InputTextPayload = {
  text: string;
  form: FormOwner;
};

type FormOwner = "parent" | "child";

export type EffectArgs = {
  dispatch: DispatchType;
};

type EffectDefinition<
  FunctionName extends keyof typeof effectFunctions,
  OwnArgs = Record<string, unknown>
> = GenericEffectDefinition<EffectArgs, Props, FunctionName, OwnArgs>;
