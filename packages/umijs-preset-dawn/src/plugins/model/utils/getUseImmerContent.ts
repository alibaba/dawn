export default () => {
  return `/* eslint-disable no-redeclare */
import * as React from "react";
import produce, { Draft } from "immer";

export type UseImmerReturnType<S> = [S, (f: (draft: Draft<S>) => void | S) => void];

// Very thin wrapper for immer with React.useState();
export function useImmer<State = any>(initialValue: State | (() => State)): UseImmerReturnType<State>;
export function useImmer<State = any>(initialValue) {
  const [value, updateValue] = React.useState<State>(initialValue);
  return [
    value,
    React.useCallback(updater => {
      updateValue(produce(updater));
    }, []),
  ];
}
`;
};
