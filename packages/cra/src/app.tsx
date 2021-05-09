import {
  noParentTextId,
  parentErrorTextId,
  parentSelector,
  parentTextInputId,
  parentTextSubmitId,
  loadingId,
} from "@im/sh/src/dom";
import React, { useContext, useEffect, useReducer } from "react";
import "./App.css";
import {
  dispatchContext,
  DispatchProvider,
  effectFunctions,
  initState,
  reducer,
  stateContext,
  StateProvider,
  ActionType,
} from "./_app.utils";
import { StateValue } from "@im/sh/src/utils";
import { ParentFragment } from "@im/sh/src/client.qgl-gen";

export function App() {
  const [stateMachine, dispatch] = useReducer(reducer, undefined, initState);

  const { states, effects } = stateMachine;

  useEffect(() => {
    if (effects.value === "noEffect") {
      return;
    }

    for (const m of effects.effects) {
      const { functionName, ownArgs } = m;
      const callable = effectFunctions[functionName];
      callable(ownArgs as any, {}, { dispatch });
    }
  }, [effects]);

  switch (states.value) {
    case StateValue.initial:
      return <div id={loadingId}>loading..</div>;

    case StateValue.error:
      return <div>Error</div>;

    case StateValue.data: {
      const { parents } = states;

      return (
        <div>
          <DispatchProvider value={{ dispatch }}>
            <StateProvider value={{ states }}>
              <ParentForm />
              {!parents.length ? (
                <span id={noParentTextId}>
                  No parents: enter text to create one
                </span>
              ) : (
                <Parents />
              )}
            </StateProvider>
          </DispatchProvider>
        </div>
      );
    }
  }
}

function Parents() {
  return <span className={parentSelector}>1</span>;
}

function ParentForm() {
  const {
    states: {
      parentForm: { text, error },
    },
  } = useContext(stateContext);

  const { dispatch } = useContext(dispatchContext);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        dispatch({
          type: ActionType.submit,
          form: "parent",
        });
      }}
    >
      <span>Create Parents</span>

      <div>
        {error && <div id={parentErrorTextId}>{error}</div>}

        <div>
          <input
            id={parentTextInputId}
            type="text"
            value={text}
            onChange={(e) => {
              const { value } = e.currentTarget;
              dispatch({
                type: ActionType.set_text,
                form: "parent",
                text: value,
              });
            }}
          />
          <button id={parentTextSubmitId}>Submit</button>
        </div>
      </div>
    </form>
  );
}
