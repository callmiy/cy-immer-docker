import { HasEffectVal, NoEffectVal } from "./utils";
import { VoidFn, Any } from "./globals";
import { StateValue } from "@im/sh/src/utils";

export function getGenericEffects<E, S extends GenericEffectForState<E>>(
  state: S
) {
  const hasEffects = state.effects as GenericHasEffect<E>;

  hasEffects.value = StateValue.hasEffect;

  let effects: E[] = [];

  if (!hasEffects.effects) {
    hasEffects.effects = effects;
  } else {
    effects = hasEffects.effects;
  }

  return effects;
}

export type GenericEffectForState<EffectObj> = {
  id: string;
  effects: GenericEffect<EffectObj>;
};

export type GenericEffect<EffectObj> =
  | GenericHasEffect<EffectObj>
  | { value: NoEffectVal };

export type GenericHasEffect<EffectObj> = {
  value: HasEffectVal;
  effects: Array<EffectObj>;
};

export interface GenericEffectDefinition<
  EffectArgs,
  Props,
  FunctionName,
  OwnArgs = Any
> {
  functionName: FunctionName;
  ownArgs: OwnArgs;
  func?: (
    ownArgs: OwnArgs,
    props: Props,
    effectArgs: EffectArgs
  ) => void | Promise<void | VoidFn | VoidFn>;
}
