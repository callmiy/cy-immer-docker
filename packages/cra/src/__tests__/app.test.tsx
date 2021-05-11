import { getClient } from "@im/sh/src/client";
import { CreateParents } from "@im/sh/src/client.qgl-gen";
import {
  loadingId,
  noParentTextId,
  parentErrorTextId,
  parentTextInputId,
  parentTextSubmitId,
} from "@im/sh/src/dom";
import { ImmGlobals } from "@im/sh/src/globals";
import {
  createParentsMswGql,
  listParentsMswGql,
} from "@im/sh/src/msw-handlers";
import { mswServer, mswServerListen } from "@im/sh/src/msw-server";
import { deleteObjectKey } from "@im/sh/src/utils";
import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { App } from "../app";

const parent1 = {
  __typename: "Parent" as "Parent",
  id: "11",
  text: "ab",
};

const parent2 = {
  __typename: "Parent" as "Parent",
  id: "p2",
  text: "ab",
};

const immGlobals = {} as ImmGlobals;

beforeAll(() => {
  window.____im = immGlobals;
});

afterAll(() => {
  deleteObjectKey(window, "____im");
});

afterEach(() => {
  jest.clearAllMocks();
  immGlobals.logApolloQueries = false;
  immGlobals.logReducers = false;
});

describe("component", () => {
  beforeAll(() => {
    mswServerListen();
  });

  afterAll(() => {
    mswServer.close();
  });

  beforeEach(() => {
    getClient({
      immGlobals,
      testing: true,
    });
  });

  afterEach(() => {
    mswServer.resetHandlers();
    cleanup();
    deleteObjectKey(immGlobals, "client");
  });

  it("data first fetch/no data", async () => {
    // immGlobals.logReducers = true;
    // immGlobals.logApolloQueries = true;

    mswServer.use(
      listParentsMswGql({
        listParents: [],
      })
    );

    await act(async () => {
      // when app renders
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { debug } = render(<App />);

      // loading indicator should be visible
      expect(getById(loadingId)).not.toBeNull();

      // text showing there is no parent in the system should not be visible
      expect(getById(noParentTextId)).toBeNull();

      // text showing there is no parent in the system should be visible
      await waitFor(() => {
        expect(getById(noParentTextId)).not.toBeNull();
      });

      // loading indicator should not be visible
      expect(getById(loadingId)).toBeNull();
    });
  });

  const createParents1Data: CreateParents = {
    createParents: [{ ...parent2 }],
  };

  const listParents1Data = {
    listParents: [
      {
        ...parent1,
      },
    ],
  };

  it("parent form", async () => {
    // immGlobals.logReducers = true;
    // immGlobals.logApolloQueries = true;

    mswServer.use(
      listParentsMswGql(listParents1Data),
      createParentsMswGql(createParents1Data)
    );

    await act(async () => {
      // when app renders
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { debug } = render(<App />);
      // debug();

      // user should see fetched data
      await waitFor(() => {
        const el = getById(parent1.id);
        expect(el).not.toBeNull();
      });

      // text showing there empty data returned from fetch should not be visible
      expect(getById(noParentTextId)).toBeNull();

      // form input error should not be visible
      expect(getById(parentErrorTextId)).toBeNull();

      // when user submits empty form
      const submitEl = getById(parentTextSubmitId);
      submitEl.click();

      // form input error should be visible
      await waitFor(() => {
        expect(getById(parentErrorTextId)).not.toBeNull();
      });

      // when user fills form correctly
      const textEl = getById(parentTextInputId) as HTMLInputElement;
      fillField(textEl, "ab");

      // when user submits form
      submitEl.click();

      // created parent should be visible
      const parentEl = await waitFor(() => {
        const el = getById(parent2.id);
        expect(el).not.toBeNull();
        return el;
      });

      expect(parentEl.id).toEqual(parent2.id);

      // form input error should not be visible
      expect(getById(parentErrorTextId)).toBeNull();

      // form should be clear
      expect(textEl.value).toEqual("");
    });
  });
});

// ====================================================
// START
// ====================================================
function getById(id: string) {
  return document.getElementById(id) as HTMLElement;
}

function getByClass(className: string, index?: number) {
  const els = document.getElementsByClassName(className);

  if (index === undefined) {
    return els;
  }

  return els.item(index) as HTMLElement;
}
export function fillField(element: Element, value: string) {
  fireEvent.change(element, {
    target: { value },
  });
}
// ====================================================
// END
// ====================================================
