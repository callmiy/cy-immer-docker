import lodashIsEqual from "lodash/isEqual";
import { Any } from "./globals";

const isDevEnv = process.env.NODE_ENV === "development";

export function logReducer<S, A>(reducer: (s: S, a: A) => S) {
  return function (prevState: S, action: A) {
    let shouldWrap = (window.____im || {}).logReducers;

    if (isDevEnv && shouldWrap === undefined) {
      shouldWrap = true;
    }

    const nextState = reducer(prevState, action);

    if (shouldWrap) {
      const diff = deepObjectDifference(nextState, prevState);

      console.log("\n\n{ LOG STARTS");

      headerWrap("UPDATE WITH");

      console.log(objectForEnv(action), "\n\n");

      headerWrap("DIFFERENCES");

      console.log(objectForEnv(diff), "\n\n");

      headerWrap("NEXT STATE");

      console.log(objectForEnv(nextState));

      console.log("\nLOG ENDS }");
    }

    return nextState;
  };
}

function deepObjectDifference(compareObject: Any, baseObject: Any) {
  function differences(newObject: Any, baseObjectDiff: Any) {
    return Object.entries(newObject).reduce((acc, [key, value]) => {
      const baseValue = baseObjectDiff[key];

      if (!lodashIsEqual(value, baseValue)) {
        acc[key] =
          isPlainObject(baseValue) && isPlainObject(value)
            ? differences(value, baseValue)
            : value;
      }

      return acc;
    }, {} as Any);
  }

  const diff = {
    "__state__id__@im": baseObject.id,
    ...differences(compareObject, baseObject),
  };

  return diff;
}

function isPlainObject(obj: Any) {
  return Object.prototype.toString.call(obj).includes("Object");
}

export function headerWrap(text: string) {
  text =
    "%c" +
    `---------------------------------------------------------
                     ${text}
---------------------------------------------------------
`;

  console.log(text, "color:green;font-weight:bold;font-size:14px;");
}

function objectForEnv(obj: Any) {
  return JSON.stringify(obj, null, 2);
}
