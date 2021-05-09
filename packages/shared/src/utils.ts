import { Any } from "./globals";
export function deleteObjectKey(obj: Any, key: keyof Any) {
  delete obj[key];
}

export const StateValue = {
  noEffect: "noEffect" as NoEffectVal,
  hasEffect: "hasEffect" as HasEffectVal,
  fetch: "fetch" as FetchVal,
  initial: "initial" as InitialVal,
  data: "data" as DataVal,
  error: "error" as ErrorVal,
} as const;

export type NoEffectVal = "noEffect";
export type HasEffectVal = "hasEffect";

export type FetchVal = "fetch";

export type InitialVal = "initial";
export type DataVal = "data";
export type ErrorVal = "error";
